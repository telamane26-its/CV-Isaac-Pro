// ===========================
// NAVIGATION — scroll & mobile
// ===========================
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNavLink();
});

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = menuToggle.querySelectorAll('span');
  const isOpen = navLinks.classList.contains('open');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity = isOpen ? '0' : '1';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity = '';
    });
  });
});

// Active nav link on scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.style.color = '');
        link.style.color = 'var(--color-text)';
      }
    }
  });
}

// ===========================
// INTERSECTION OBSERVER — fade-up animations
// ===========================
const fadeTargets = [
  ...document.querySelectorAll('.stat-card'),
  ...document.querySelectorAll('.timeline-card'),
  ...document.querySelectorAll('.skill-category'),
  ...document.querySelectorAll('.project-card'),
  ...document.querySelectorAll('.contact-item'),
  document.querySelector('.about-text'),
  document.querySelector('.contact-form'),
  document.querySelector('.hero-content'),
];

fadeTargets.forEach(el => {
  if (el) el.classList.add('fade-up');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, entry.target.dataset.delay || 0);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

// Stagger children of grids
function staggerChildren(parent, selector, baseDelay = 80) {
  if (!parent) return;
  parent.querySelectorAll(selector).forEach((el, i) => {
    el.dataset.delay = i * baseDelay;
  });
}

staggerChildren(document.querySelector('.about-stats'), '.stat-card', 100);
staggerChildren(document.querySelector('.skills-grid'), '.skill-category', 100);
staggerChildren(document.querySelector('.projects-grid'), '.project-card', 100);
staggerChildren(document.querySelector('.contact-info'), '.contact-item', 80);

fadeTargets.forEach(el => {
  if (el) observer.observe(el);
});

// ===========================
// SKILL BARS — animate on visibility
// ===========================
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

// ===========================
// CONTACT FORM — fake submit
// ===========================
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');
  const form = document.getElementById('contactForm');

  btn.textContent = 'Envoi en cours…';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    form.reset();
    btn.style.display = 'none';
    success.style.display = 'block';
  }, 1400);
}

// ===========================
// SMOOTH SCROLL OFFSET (polyfill for older browsers)
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===========================
// TYPING EFFECT on hero name (subtle)
// ===========================
const heroName = document.querySelector('.hero-name');
if (heroName) {
  heroName.style.opacity = '0';
  heroName.style.transform = 'translateY(10px)';
  heroName.style.transition = 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s';
  setTimeout(() => {
    heroName.style.opacity = '1';
    heroName.style.transform = 'translateY(0)';
  }, 100);
}

// ===========================
// CURSOR GLOW (subtle, desktop only)
// ===========================
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    will-change: left, top;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

// ===========================
// YEAR AUTO UPDATE
// ===========================
document.querySelectorAll('.footer-copy').forEach(el => {
  el.textContent = el.textContent.replace('2026', new Date().getFullYear());
});
