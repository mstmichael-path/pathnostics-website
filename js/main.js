/* ═══════════════════════════════════════════════════════
   MAIN.JS — GSAP Animations + Kinetic Ticker + Video
   Pathnostics Homepage | Stitch "Clinical Editorial" v2
   ═══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── MAKE EVERYTHING VISIBLE IF REDUCED MOTION ────────────
if (prefersReducedMotion) {
  gsap.utils.toArray('.reveal, .reveal-child, .hero-overline, .hero-h1, .hero-sub, .hero-body, .hero-actions, .hero-card').forEach(el => {
    gsap.set(el, { opacity: 1, y: 0 });
  });
} else {

  // ── HERO LOAD ANIMATION ─────────────────────────────────
  gsap.set(['.hero-overline', '.hero-h1', '.hero-sub', '.hero-body', '.hero-actions', '.hero-card'], {
    opacity: 0,
    y: 30
  });

  const heroTl = gsap.timeline({ delay: 0.3 });
  heroTl
    .to('.hero-overline', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
    .to('.hero-h1',       { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.3')
    .to('.hero-sub',      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
    .to('.hero-body',     { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
    .to('.hero-actions',  { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
    .to('.hero-card',     { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3');

  // ── SCROLL REVEALS ──────────────────────────────────────
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // ── STAGGERED GROUPS ────────────────────────────────────
  gsap.utils.toArray('.reveal-group').forEach(group => {
    const children = group.querySelectorAll('.reveal-child');
    gsap.fromTo(children,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 78%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // ── STAT COUNT-UP ───────────────────────────────────────
  gsap.utils.toArray('.count-up').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = parseInt(el.dataset.decimals) || 0;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.fromTo({ val: 0 }, { val: target }, {
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: function() {
            el.textContent = prefix + this.targets()[0].val.toFixed(decimals) + suffix;
          }
        });
      }
    });
  });
}

// ── NAV SCROLL — GLASSMORPHIC TRANSITION ──────────────────
const nav = document.querySelector('.nav');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 80) {
    nav.classList.add('is-scrolled');
  } else {
    nav.classList.remove('is-scrolled');
  }
  lastScrollY = y;
}, { passive: true });

// ── HAMBURGER MENU ────────────────────────────────────────
const hamburger = document.querySelector('.nav-hamburger');
const mobileNav = document.querySelector('.nav-mobile');
const mobileClose = document.querySelector('.nav-mobile__close');

function openMobileNav() {
  mobileNav.classList.add('is-open');
  mobileNav.setAttribute('aria-hidden', 'false');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  mobileNav.classList.remove('is-open');
  mobileNav.setAttribute('aria-hidden', 'true');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openMobileNav);
mobileClose?.addEventListener('click', closeMobileNav);

document.querySelectorAll('.nav-mobile a').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileNav?.classList.contains('is-open')) {
    closeMobileNav();
  }
});

// ── SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = nav.offsetHeight + 4;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

// ── VIDEO BACKGROUND — AUTO-PLAY HANDLER ──────────────────
document.querySelectorAll('.video-bg video').forEach(video => {
  video.play().catch(() => { video.style.display = 'none'; });
});

// ── WHITEPAPER CAROUSEL ARROWS ──────────────────────────────
const wpScroll = document.getElementById('wp-scroll');
const wpPrev = document.getElementById('wp-prev');
const wpNext = document.getElementById('wp-next');

if (wpScroll && wpPrev && wpNext) {
  const scrollAmount = 340; // roughly one card width + gap
  wpNext.addEventListener('click', () => {
    wpScroll.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
  wpPrev.addEventListener('click', () => {
    wpScroll.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
}
