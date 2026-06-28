<?php
/**
 * Kinexus lead capture endpoint.
 *
 * Accepts JSON POSTs from the contact form (source=contact) and the
 * Export Readiness Playbook dialog (source=playbook). Every submission is
 * written to data/leads.csv + data/leads.jsonl FIRST (so a lead is never lost
 * even when the database is unreachable) and then inserted into the `leads`
 * table. If the DB step fails, the file copy is the durable fallback.
 */

header('Content-Type: application/json');

// Where new-lead notification emails are sent.
const NOTIFY_EMAIL = 'surbhi.goyal@kinexus.co.in';
// From address must be on the site domain so the host mail server accepts it.
const NOTIFY_FROM  = 'noreply@kinexus.co.in';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid request']);
    exit;
}

$source    = trim($data['source']    ?? 'contact');
$name      = trim($data['name']      ?? '');
$company   = trim($data['company']   ?? '');
$phone     = trim($data['phone']     ?? '');
$email     = trim($data['email']     ?? '');
$sector    = trim($data['sector']    ?? '');
$size      = trim($data['employees'] ?? ($data['size'] ?? ''));
$challenge = trim($data['challenge'] ?? '');

if (!in_array($source, ['contact', 'playbook'], true)) {
    $source = 'contact';
}

if ($source === 'contact' && (!$name || !$company || !$phone)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Name, company and phone are required']);
    exit;
}

if ($source === 'playbook' && (!$name || !$email)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Name and email are required']);
    exit;
}

$submission = [
    'submitted_at' => gmdate('c'),
    'source'       => $source,
    'name'         => $name,
    'company'      => $company,
    'phone'        => $phone,
    'email'        => $email,
    'sector'       => $sector,
    'employees'    => $size,
    'challenge'    => $challenge,
    'ip_address'   => $_SERVER['REMOTE_ADDR']     ?? '',
    'user_agent'   => $_SERVER['HTTP_USER_AGENT']  ?? '',
];

function kxEnsureDataDirectory(): string
{
    $dir = __DIR__ . '/data';
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        throw new RuntimeException('Could not create submission data directory');
    }

    $htaccess = $dir . '/.htaccess';
    if (!file_exists($htaccess)) {
        file_put_contents($htaccess, "Require all denied\nDeny from all\n");
    }

    return $dir;
}

function kxAppendCsv(string $path, array $submission): void
{
    $isNew  = !file_exists($path) || filesize($path) === 0;
    $handle = fopen($path, 'ab');
    if (!$handle) {
        throw new RuntimeException('Could not open CSV submission file');
    }
    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        throw new RuntimeException('Could not lock CSV submission file');
    }
    if ($isNew) {
        fputcsv($handle, array_keys($submission));
    }
    fputcsv($handle, array_values($submission));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
}

function kxAppendJsonl(string $path, array $submission): void
{
    $line = json_encode($submission, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . PHP_EOL;
    if (file_put_contents($path, $line, FILE_APPEND | LOCK_EX) === false) {
        throw new RuntimeException('Could not write JSONL submission file');
    }
}

function kxStoreSubmissionFiles(array $submission): void
{
    $dir = kxEnsureDataDirectory();
    kxAppendCsv($dir . '/leads.csv', $submission);
    kxAppendJsonl($dir . '/leads.jsonl', $submission);
}

/**
 * Email a new-lead notification. Never throws — a failed send must not break
 * lead capture; failures are logged for follow-up.
 */
function kxNotify(array $submission): void
{
    try {
        $kind = $submission['source'] === 'playbook' ? 'Playbook' : 'Contact';
        $subject = 'New ' . $kind . ' lead: ' . $submission['name']
            . ($submission['company'] !== '' ? ' (' . $submission['company'] . ')' : '');

        $labels = [
            'source'       => 'Source',
            'name'         => 'Name',
            'company'      => 'Company',
            'phone'        => 'Phone',
            'email'        => 'Email',
            'sector'       => 'Sector',
            'employees'    => 'Employees',
            'challenge'    => 'Biggest challenge',
            'submitted_at' => 'Submitted at (UTC)',
            'ip_address'   => 'IP address',
        ];
        $lines = ['A new lead was captured on kinexus.co.in:', ''];
        foreach ($labels as $key => $label) {
            $value = trim((string)($submission[$key] ?? ''));
            if ($value !== '') {
                $lines[] = $label . ': ' . $value;
            }
        }
        $body = implode("\n", $lines) . "\n";

        $replyTo = $submission['email'] !== '' ? $submission['email'] : NOTIFY_FROM;
        $headers = 'From: Kinexus Website <' . NOTIFY_FROM . ">\r\n"
            . 'Reply-To: ' . $replyTo . "\r\n"
            . "Content-Type: text/plain; charset=utf-8\r\n";

        if (!@mail(NOTIFY_EMAIL, $subject, $body, $headers)) {
            error_log('Kinexus lead notification mail() returned false for ' . $submission['email']);
        }
    } catch (Throwable $mailError) {
        error_log('Kinexus lead notification error: ' . $mailError->getMessage());
    }
}

$fileStored = false;
$notified   = false;

try {
    // Durable fallback first: capture the lead to disk before touching the DB.
    kxStoreSubmissionFiles($submission);
    $fileStored = true;

    // Notify once the lead is safely captured, independent of the DB outcome.
    kxNotify($submission);
    $notified = true;

    if (!is_readable(__DIR__ . '/db-config.php')) {
        throw new RuntimeException('Database config file is missing');
    }

    require_once __DIR__ . '/db-config.php';

    foreach (['DB_NAME', 'DB_USER', 'DB_PASS'] as $constant) {
        if (!defined($constant) || constant($constant) === '') {
            throw new RuntimeException($constant . ' is not configured');
        }
    }

    $dbHost    = defined('DB_HOST')    ? DB_HOST    : 'localhost';
    $dbPort    = defined('DB_PORT')    ? DB_PORT    : '3306';
    $dbCharset = defined('DB_CHARSET') ? DB_CHARSET : 'utf8mb4';
    // DB_CHARSET may carry a full collation (e.g. "utf8mb4_unicode_ci"); the PDO
    // DSN charset parameter needs the charset name only, so take the leading token.
    $dsnCharset = explode('_', $dbCharset)[0] ?: 'utf8mb4';
    $dsn = 'mysql:host=' . $dbHost . ';port=' . $dbPort . ';dbname=' . DB_NAME . ';charset=' . $dsnCharset;

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];
    if (defined('DB_SSL') && DB_SSL && defined('PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT')) {
        $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = false;
    }

    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);

    $pdo->exec("CREATE TABLE IF NOT EXISTS leads (
        id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        source       VARCHAR(40)   NOT NULL DEFAULT 'contact',
        name         VARCHAR(120)  NOT NULL,
        company      VARCHAR(160)  DEFAULT NULL,
        phone        VARCHAR(30)   DEFAULT NULL,
        email        VARCHAR(160)  DEFAULT NULL,
        sector       VARCHAR(120)  DEFAULT NULL,
        employees    VARCHAR(20)   DEFAULT NULL,
        challenge    TEXT          DEFAULT NULL,
        ip_address   VARCHAR(45)   DEFAULT NULL,
        user_agent   VARCHAR(255)  DEFAULT NULL,
        submitted_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_source (source),
        INDEX idx_submitted_at (submitted_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $stmt = $pdo->prepare(
        "INSERT INTO leads
            (source, name, company, phone, email, sector, employees, challenge, ip_address, user_agent)
         VALUES
            (:source, :name, :company, :phone, :email, :sector, :employees, :challenge, :ip, :ua)"
    );
    $stmt->execute([
        ':source'    => $source,
        ':name'      => $name,
        ':company'   => $company   ?: null,
        ':phone'     => $phone     ?: null,
        ':email'     => $email     ?: null,
        ':sector'    => $sector    ?: null,
        ':employees' => $size      ?: null,
        ':challenge' => $challenge ?: null,
        ':ip'        => $_SERVER['REMOTE_ADDR']    ?? null,
        ':ua'        => mb_substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255) ?: null,
    ]);

    echo json_encode(['ok' => true, 'stored' => 'db']);

} catch (Throwable $e) {
    error_log('Kinexus lead capture DB error: ' . $e->getMessage());
    try {
        if (!$fileStored) {
            kxStoreSubmissionFiles($submission);
            $fileStored = true;
        }
        if (!$notified) {
            kxNotify($submission);
            $notified = true;
        }
        // Lead is safely on disk — report success so the visitor flow continues.
        echo json_encode(['ok' => true, 'stored' => 'file']);
    } catch (Throwable $fileError) {
        error_log('Kinexus lead capture file fallback error: ' . $fileError->getMessage());
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Server error. Please email hello@kinexus.co.in']);
    }
}
