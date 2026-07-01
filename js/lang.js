function applyLang(lang) {
  const t = translations[lang];
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });

  if (document.querySelector('#name'))             document.querySelector('#name').placeholder             = t.form_name_ph;
  if (document.querySelector('#email'))            document.querySelector('#email').placeholder            = t.form_email_ph;
  if (document.querySelector('#message'))          document.querySelector('#message').placeholder          = t.form_msg_ph;
  if (document.querySelector('.newsletter-input')) document.querySelector('.newsletter-input').placeholder = t.news_ph;

  const footerCopy = document.querySelector('[data-i18n="footer_copy"]');
  if (footerCopy) {
    footerCopy.innerHTML = lang === 'sv'
      ? '© 2018 <span>value-flow.se</span> — Alla rättigheter förbehållna'
      : '© 2018 <span>value-flow.se</span> — All Rights Reserved';
  }

  const mobileCopy = document.querySelector('.mobile-menu-copy');
  if (mobileCopy) {
    mobileCopy.textContent = lang === 'sv'
      ? '© 2018 value-flow.se — Alla rättigheter förbehållna'
      : '© 2018 value-flow.se — All Rights Reserved';
  }

  // Sync both the desktop pill toggle and the mobile-menu toggle
  document.querySelectorAll('#lang-toggle, #lang-toggle-mobile').forEach(btn => {
    const flagEl = btn.querySelector('.lang-flag-emoji');
    const lblEl  = btn.querySelector('.lang-label');
    if (lang === 'en') {
      btn.dataset.lang = 'sv';
      if (flagEl) flagEl.textContent = '🇸🇪';
      if (lblEl) lblEl.textContent = 'Svenska';
    } else {
      btn.dataset.lang = 'en';
      if (flagEl) flagEl.textContent = '🇬🇧';
      if (lblEl) lblEl.textContent = 'English';
    }
  });

  localStorage.setItem('lean_lang', lang);
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('lean_lang') || 'en';
  applyLang(saved);

  document.querySelectorAll('#lang-toggle, #lang-toggle-mobile').forEach(btn => {
    btn.addEventListener('click', function () {
      applyLang(this.dataset.lang);
    });
  });
});