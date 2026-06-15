/* ════════════════════════════════════════════════════════════════
   KINEXUS SYSTEMS — SHARED SITE SCRIPT
   Navbar scroll/mobile menu, scroll-reveal, playbook modal, lead capture
   ════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── NAVBAR SCROLL STATE ─────────────────────────────────────── */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  /* ── MOBILE MENU TOGGLE ──────────────────────────────────────── */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  /* ── SCROLL REVEAL ───────────────────────────────────────────── */
  var revealEls = document.querySelectorAll('.scroll-reveal');
  if (revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ── PLAYBOOK / SUBSCRIBE MODAL ──────────────────────────────── */
  var modal = document.getElementById('playbookModal');
  if (modal) {
    var openTriggers = document.querySelectorAll('[data-open-playbook]');
    var closeBtn = modal.querySelector('.modal-close');

    function openModal() {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (typeof gtag === 'function') {
        gtag('event', 'playbook_modal_open', { event_category: 'engagement' });
      }
    }
    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    openTriggers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    /* Auto-trigger once per session after a short delay, unless dismissed/submitted */
    if (!sessionStorage.getItem('kx_playbook_seen')) {
      setTimeout(function () {
        if (!modal.classList.contains('open')) {
          openModal();
          sessionStorage.setItem('kx_playbook_seen', '1');
        }
      }, 25000);
    }

    /* Form submit */
    var form = document.getElementById('playbookForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('pbName').value.trim();
        var email = document.getElementById('pbEmail').value.trim();
        var company = document.getElementById('pbCompany').value.trim();
        if (!name || !email) return;

        if (typeof gtag === 'function') {
          gtag('event', 'generate_lead', {
            event_category: 'playbook_download',
            event_label: company || 'unspecified'
          });
        }

        form.style.display = 'none';
        var success = modal.querySelector('.modal-success');
        if (success) success.style.display = 'block';

        /* Trigger the playbook download */
        var link = document.createElement('a');
        link.href = '/export-readiness-playbook.pdf';
        link.download = 'Kinexus-Export-Readiness-Playbook.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(closeModal, 3500);
      });
    }
  }

});

/* ── HELPER: lead form submission (contact page) ─────────────── */
function kxSubmitForm(formId, successId, eventLabel) {
  var form = document.getElementById(formId);
  if (!form) return;
  var success = document.getElementById(successId);
  if (form.checkValidity && !form.checkValidity()) { form.reportValidity(); return; }

  if (typeof gtag === 'function') {
    gtag('event', 'generate_lead', { event_category: 'contact_form', event_label: eventLabel || 'contact' });
  }
  form.style.display = 'none';
  if (success) success.style.display = 'block';
}
