/* Shared behaviour for the house sites: sticky nav, mobile menu, scroll reveal,
   and the lead form (posts to submit-lead.php, then opens WhatsApp pre-filled). */
(function () {
    'use strict';

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- nav ---- */
    var nav = document.querySelector('.nav');
    if (nav) {
        var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    var burger = document.querySelector('.burger');
    var links = document.querySelector('.nav-links');
    if (burger && links) {
        burger.addEventListener('click', function () {
            var open = links.classList.toggle('open');
            burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        links.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') {
                links.classList.remove('open');
                burger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ---- scroll reveal ---- */
    var rv = document.querySelectorAll('.rv');
    if ('IntersectionObserver' in window && !reduced) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var sibs = Array.prototype.slice.call(entry.target.parentElement.children);
                var i = Math.min(sibs.indexOf(entry.target), 5);
                setTimeout(function () { entry.target.classList.add('in'); }, i * 65);
                io.unobserve(entry.target);
            });
        }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
        Array.prototype.forEach.call(rv, function (el) { io.observe(el); });
    } else {
        Array.prototype.forEach.call(rv, function (el) { el.classList.add('in'); });
    }

    /* ---- lead form ---- */
    var form = document.querySelector('form[data-lead]');
    if (form) {
        var wa = form.getAttribute('data-wa') || '919876701788';
        var brand = form.getAttribute('data-brand') || 'Kinexus';
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var val = function (id) { var el = form.querySelector('#' + id); return el ? el.value.trim() : ''; };
            var name = val('name'), company = val('company'), phone = val('phone'),
                sector = val('sector'), challenge = val('message');
            try {
                fetch('submit-lead.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        source: form.getAttribute('data-source') || 'contact',
                        name: name, company: company, phone: phone,
                        sector: sector, challenge: challenge
                    })
                }).catch(function () {});
            } catch (err) { /* WhatsApp is the backup channel */ }

            var msg = 'Hi ' + brand + ', I would like to talk.'
                    + '\nName: ' + name
                    + '\nCompany: ' + company
                    + '\nPhone: ' + phone
                    + '\nBusiness: ' + sector
                    + '\nNot working: ' + challenge;
            window.open('https://wa.me/' + wa + '?text=' + encodeURIComponent(msg), '_blank');

            var note = form.querySelector('.form-note');
            if (note) {
                note.textContent = '✓ Thanks' + (name ? ', ' + name : '')
                    + '. WhatsApp is opening — we’ll come back to you shortly.';
                note.style.color = '#0F7A5A';
            }
            form.reset();
        });
    }
})();
