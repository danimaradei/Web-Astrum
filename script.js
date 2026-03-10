/* ================================================
   ASTRUM — SEDS ITBA · script.js (Light Theme)
   ================================================ */

// ── Intro screen ──────────────────────────────────────────────────────────────
(function initIntro() {
  const screen = document.getElementById('intro-screen');
  const video  = document.getElementById('intro-video');
  const bar    = document.getElementById('intro-bar');

  document.body.style.overflow = 'hidden';

  function dismiss() {
    screen.classList.add('hidden');
    document.body.style.overflow = '';
  }

  video.addEventListener('timeupdate', () => {
    if (video.duration) {
      bar.style.width = (video.currentTime / video.duration * 100) + '%';
    }
  });

  video.addEventListener('ended', dismiss);

  const fallback = setTimeout(dismiss, 8000);
  video.addEventListener('ended', () => clearTimeout(fallback));
})();

// ── Floating Particles (light bg) ────────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  const COLORS = [
    'rgba(0, 150, 214, VAL)',   // cyan
    'rgba(123, 45, 139, VAL)',  // purple
    'rgba(240, 112, 48, VAL)',  // orange
    'rgba(30, 31, 69, VAL)',    // navy
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomColor(alpha) {
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    return c.replace('VAL', alpha);
  }

  function createParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x:      Math.random() * W,
        y:      Math.random() * H,
        r:      Math.random() * 2.5 + 0.5,
        alpha:  Math.random() * 0.12 + 0.03,
        dx:     (Math.random() - 0.5) * 0.3,
        dy:     (Math.random() - 0.5) * 0.3,
        color:  randomColor(1),
        pulse:  Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.012 + 0.004,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.pulse += p.pulseSpeed;
      const a = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));
      const color = p.color.replace('1)', `${a})`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createParticles(100); });
  resize();
  createParticles(100);
  requestAnimationFrame(draw);
})();


// ── Navbar scroll effect ───────────────────────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();


// ── Mobile nav toggle ──────────────────────────────────────────────────────────
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );
})();


// ── Scroll reveal ─────────────────────────────────────────────────────────────
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(
        entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
      );
      const delay = siblings.indexOf(entry.target) * 80;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


// ── Counter animation ─────────────────────────────────────────────────────────
(function initCounters() {
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const startTime = performance.now();
    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.floor(easeOutCubic(progress) * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(n => observer.observe(n));
})();


// ── Active nav highlight ───────────────────────────────────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id)
            link.style.color = 'var(--navy)';
        });
      }
    });
  }, { threshold: 0.4 }).observe && sections.forEach(s =>
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + entry.target.id)
              link.style.color = 'var(--navy)';
          });
        }
      });
    }, { threshold: 0.4 }).observe(s)
  );
})();


// ── Edition card hover tilt ────────────────────────────────────────────────────
(function initCardTilt() {
  document.querySelectorAll('.edition-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 3;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -3;
      card.style.transform = `translateX(6px) perspective(700px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = '';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.08s ease';
    });
  });
})();


// ── Contact form ───────────────────────────────────────────────────────────────
function handleSubmit() {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const btn     = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');

  if (!name || !email || !message) { shakeElement(btn); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    shakeElement(document.getElementById('email')); return;
  }

  btn.textContent = 'Enviando...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    btn.style.display = 'none';
    success.style.display = 'block';
    ['name','university','email','role','message'].forEach(id => {
      document.getElementById(id).value = '';
    });
    setTimeout(() => {
      success.style.display = 'none';
      btn.style.display = '';
      btn.textContent = 'Enviar mensaje';
      btn.disabled = false;
      btn.style.opacity = '';
    }, 4000);
  }, 1200);
}

function shakeElement(el) {
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.4s ease';
  el.addEventListener('animationend', () => el.style.animation = '', { once: true });
}

const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60%  { transform: translateX(-6px); }
    40%, 80%  { transform: translateX(6px); }
  }
`;
document.head.appendChild(style);


// ── Parallax orbits on scroll ──────────────────────────────────────────────────
(function initParallax() {
  const orbits = document.querySelectorAll('.orbit');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        orbits.forEach((orbit, i) => {
          orbit.style.transform = `translate(-50%, calc(-50% + ${scrollY * (i + 1) * 0.04}px))`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


// ── Subtle cursor glow (light) ────────────────────────────────────────────────
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 350px; height: 350px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,150,214,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    left: 0; top: 0;
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
  `;
  document.body.appendChild(glow);
  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();
