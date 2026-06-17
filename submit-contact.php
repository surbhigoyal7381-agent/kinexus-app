<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://www.kinexussystems.com');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid request']);
    exit;
}

$name      = trim($data['name']      ?? '');
$company   = trim($data['company']   ?? '');
$phone     = trim($data['phone']     ?? '');
$email     = trim($data['email']     ?? '');
$sector    = trim($data['sector']    ?? '');
$size      = trim($data['size']      ?? '');
$challenge = trim($data['challenge'] ?? '');

if (!$name || !$company || !$phone || !$sector) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Required fields missing']);
    exit;
}

require_once __DIR__ . '/db-config.php';

try {
    $dbHost = defined('DB_HOST') ? DB_HOST : 'localhost';
    $dbPort = defined('DB_PORT') ? DB_PORT : '3306';
    $dbCharset = defined('DB_CHARSET') ? DB_CHARSET : 'utf8mb4';
    $dsn = 'mysql:host=' . $dbHost . ';port=' . $dbPort . ';dbname=' . DB_NAME . ';charset=' . $dbCharset;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    if (defined('DB_SSL') && DB_SSL && defined('PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT')) {
        $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = false;
    }

    $pdo = new PDO(
        $dsn,
        DB_USER,
        DB_PASS,
        $options
    );

    $pdo->exec("CREATE TABLE IF NOT EXISTS contact_submissions (
        id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name         VARCHAR(120)  NOT NULL,
        company      VARCHAR(160)  NOT NULL,
        phone        VARCHAR(30)   NOT NULL,
        email        VARCHAR(160)  DEFAULT NULL,
        sector       VARCHAR(120)  NOT NULL,
        employees    VARCHAR(20)   DEFAULT NULL,
        challenge    TEXT          DEFAULT NULL,
        submitted_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
        ip_address   VARCHAR(45)   DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $stmt = $pdo->prepare(
        "INSERT INTO contact_submissions
            (name, company, phone, email, sector, employees, challenge, ip_address)
         VALUES
            (:name, :company, :phone, :email, :sector, :size, :challenge, :ip)"
    );
    $stmt->execute([
        ':name'      => $name,
        ':company'   => $company,
        ':phone'     => $phone,
        ':email'     => $email ?: null,
        ':sector'    => $sector,
        ':size'      => $size ?: null,
        ':challenge' => $challenge ?: null,
        ':ip'        => $_SERVER['REMOTE_ADDR'] ?? null,
    ]);

    echo json_encode(['ok' => true]);

} catch (PDOException $e) {
    error_log('Kinexus contact form DB error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Server error. Please try again or email hello@kinexus.in']);
}
