/* ============================================
   LEAN APP — Main JS (Corporate Redesign v2)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============ PRELOADER ============
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => { preloader.classList.add('hidden'); }, 900);
  });

  // ============ HERO BACKGROUND ANIMATION ============
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const heroSection = canvas.closest('#hero');

    function sizeCanvas() {
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
    }
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);

    const particles = [];
    const NUM_PARTICLES = 46;

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.6 + 0.6;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.speedY = (Math.random() - 0.5) * 0.25;
        this.opacity = Math.random() * 0.35 + 0.15;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(13,148,136,${this.opacity})`;
        ctx.fill();
      }
    }
    for (let i = 0; i < NUM_PARTICLES; i++) particles.push(new Particle());

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.12;
            ctx.strokeStyle = `rgba(13,148,136,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateBg() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      requestAnimationFrame(animateBg);
    }
    animateBg();
  }

  // ============ PREVENT IMAGE DRAGGING ============
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', e => e.preventDefault());
    img.setAttribute('draggable', 'false');
  });

  // ============ HEADER SHADOW ON SCROLL ============
  const siteHeader = document.querySelector('.site-header');
  const setHeaderShadow = () => {
    if (!siteHeader) return;
    siteHeader.style.boxShadow = window.scrollY > 20
      ? '0 8px 24px rgba(15,23,42,0.10), 0 2px 6px rgba(15,23,42,0.06)'
      : 'var(--shadow-md)';
  };
  window.addEventListener('scroll', setHeaderShadow);
  setHeaderShadow();

  // ============ MOBILE MENU OVERLAY ============
  const burger = document.querySelector('.nav-burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    document.body.classList.add('menu-open');
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  }

  if (burger) burger.addEventListener('click', openMobileMenu);
  if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);

  document.querySelectorAll('.mobile-menu-links a, .mobile-menu-cta').forEach(a => {
    a.addEventListener('click', closeMobileMenu);
  });

  // ============ SCROLL REVEAL ============
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .feat-card, .price-card, .feature-item');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => { entry.target.classList.add('visible'); }, (entry.target.dataset.delay || 0));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => revealObserver.observe(el));

  document.querySelectorAll('.feature-list .feature-item').forEach((el, i) => { el.dataset.delay = i * 60; });
  document.querySelectorAll('.features-grid .feat-card').forEach((el, i) => { el.dataset.delay = i * 80; });
  document.querySelectorAll('.pricing-grid .price-card').forEach((el, i) => { el.dataset.delay = i * 60; });

  // ============ RSV INFINITE SCROLL ============
  const track = document.querySelector('.rsv-screens-track');
  if (track) {
    const items = track.innerHTML;
    track.innerHTML += items;
  }

  // ============ CONTACT FORM — EmailJS ============
  const EMAILJS_PUBLIC_KEY  = '_BMrGw-7W-Qpb_lFN';
  const EMAILJS_SERVICE_ID  = 'service_w1ljoy9';
  const EMAILJS_TEMPLATE_ID = 'template_2qxa7kb';

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const msg = form.querySelector('.form-msg');

      const name    = form.querySelector('[name="name"]').value.trim();
      const email   = form.querySelector('[name="email"]').value.trim();
      const phone   = form.querySelector('[name="phone"]').value.trim();
      const company = form.querySelector('[name="company"]').value.trim();
      const subjectSelect = form.querySelector('[name="subject"]');
      const subjectValue  = subjectSelect.value;
      const subjectLabel  = subjectValue
        ? subjectSelect.options[subjectSelect.selectedIndex].textContent
        : 'General Enquiry';
      const message = form.querySelector('[name="message"]').value.trim();

      if (!name || !email || !message) {
        showMsg(msg, 'error', 'Please fill in all required fields.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMsg(msg, 'error', 'Please enter a valid email address.');
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Sending...';

      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name    : name,
            from_email   : email,
            phone        : phone   || 'Not provided',
            company      : company || 'Not provided',
            subject      : subjectLabel,
            message      : message,
            reply_to     : email,
            to_name      : 'Value-flow Team',
            submitted_at : new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
          },
          EMAILJS_PUBLIC_KEY
        );

        showMsg(msg, 'success', '✓ Message sent! We\'ll get back to you soon.');
        form.reset();
      } catch (err) {
        console.error('EmailJS error:', err);
        showMsg(msg, 'error', 'Something went wrong. Please email us at support@value-flow.se');
      }

      btn.disabled = false;
      btn.textContent = 'Send Your Message';
    });
  }

  function showMsg(el, type, text) {
    el.className = 'form-msg ' + type;
    el.textContent = text;
    setTimeout(() => { el.className = 'form-msg'; el.textContent = ''; }, 6000);
  }

  // ============ NEWSLETTER FORM ============
  const nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = nlForm.querySelector('.newsletter-input');
      if (input.value.trim()) {
        input.value = '';
        input.placeholder = '✓ Subscribed! Thank you.';
        setTimeout(() => input.placeholder = 'Your email address', 3000);
      }
    });
  }

  // ============ SMOOTH NAV CLOSE ON CLICK (desktop links) ============
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', closeMobileMenu);
  });

});