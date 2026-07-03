/* ==========================================================================
   Kinexus Blog — shared per-post script.
   Auto-wires prev/next navigation and "related" cards from posts.js, so a new
   post slots into the navigation automatically once it's in the manifest.
   Requires: <body data-slug="this-post-slug"> and posts.js loaded first.
   ========================================================================== */
(function () {
    var posts = (window.KINEXUS_POSTS || []).slice();
    posts.sort(function (a, b) { return (a.date < b.date) ? 1 : (a.date > b.date ? -1 : 0); });

    var slug = document.body.getAttribute('data-slug');
    var idx = -1;
    for (var i = 0; i < posts.length; i++) { if (posts[i].slug === slug) { idx = i; break; } }

    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); }
    function url(p) { return '/blog/' + p.slug + '.html'; }
    function fmtDate(iso) {
        var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var p = iso.split('-');
        return p[2].replace(/^0/, '') + ' ' + m[parseInt(p[1], 10) - 1] + ' ' + p[0];
    }

    // Prev / next (newer = prev, older = next in the sorted list)
    var navEl = document.getElementById('post-nav');
    if (navEl && idx !== -1) {
        var html = '';
        var newer = posts[idx - 1], older = posts[idx + 1];
        if (newer) html += '<a class="prev" href="' + url(newer) + '"><div class="dir">← Newer</div><div class="t">' + esc(newer.title) + '</div></a>';
        else html += '<a class="prev" href="/blog.html"><div class="dir">←</div><div class="t">All insights</div></a>';
        if (older) html += '<a class="next" href="' + url(older) + '"><div class="dir">Older →</div><div class="t">' + esc(older.title) + '</div></a>';
        else html += '<a class="next" href="/index.html#contact"><div class="dir">Next step →</div><div class="t">Book a diagnostic</div></a>';
        navEl.innerHTML = html;
    }

    // Related: same category, excluding this post, up to 3 (fall back to recent)
    var relWrap = document.getElementById('related');
    var relGrid = document.getElementById('related-grid');
    if (relGrid && idx !== -1) {
        var me = posts[idx];
        var rel = posts.filter(function (p) { return p.slug !== slug && p.category === me.category; });
        if (rel.length < 3) {
            posts.forEach(function (p) { if (p.slug !== slug && rel.indexOf(p) === -1 && rel.length < 3) rel.push(p); });
        }
        rel = rel.slice(0, 3);
        if (rel.length) {
            relGrid.innerHTML = rel.map(function (p) {
                return '<article class="post-card"><a class="thumb" href="' + url(p) + '" aria-hidden="true" tabindex="-1">' + (p.emoji || '📄') + '</a>'
                    + '<div class="body"><div class="cat">' + esc(p.category) + '</div>'
                    + '<h3><a href="' + url(p) + '">' + esc(p.title) + '</a></h3>'
                    + '<div class="meta"><time datetime="' + p.date + '">' + fmtDate(p.date) + '</time></div></div></article>';
            }).join('');
        } else if (relWrap) { relWrap.style.display = 'none'; }
    }

    // Mobile nav toggle
    var tgl = document.querySelector('.nav-toggle');
    if (tgl) tgl.addEventListener('click', function () {
        var links = document.querySelector('.nav-links');
        var open = links.classList.toggle('open');
        tgl.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
})();
