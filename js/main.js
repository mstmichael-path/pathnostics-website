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

// ═══════════════════════════════════════════════════════════
// THREE-TIER NAVIGATION SYSTEM (v11)
// Whole nav goes purple together. Utility + local stay visible.
// ═══════════════════════════════════════════════════════════

const navSystem = document.getElementById('nav-system');
const localNavProgress = document.getElementById('local-nav-progress');

// ── Scroll behavior ─────────────────────────────────────
let lastScrollY = 0;
let ticking = false;

const footerEl = document.querySelector('.footer');
const pageShellEl = document.querySelector('.page-shell');

function updateNavOnScroll() {
  const y = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = Math.min(100, (y / Math.max(docHeight, 1)) * 100);

  // "At footer" detection — mode-aware:
  //   - Reveal mode (body.has-footer-reveal): trigger when more than half
  //     the footer is exposed below the page-shell's bottom edge. Scales
  //     with footer height so the trigger fires at a consistent visual
  //     moment regardless of how tall the footer is.
  //   - Normal flow: footer scrolls in; use footer's own top crossing mid.
  // Desktop-only — mobile keeps the normal scrolled nav.
  let atFooter = false;
  if (window.innerWidth >= 1024) {
    if (document.body.classList.contains('has-footer-reveal') && pageShellEl && footerEl) {
      atFooter = pageShellEl.getBoundingClientRect().bottom < window.innerHeight - footerEl.offsetHeight * 0.5;
    } else if (footerEl) {
      atFooter = footerEl.getBoundingClientRect().top < window.innerHeight * 0.5;
    }
  }

  // Three states:
  //   - top of page (y<=80): no class → all 3 nav tiers visible
  //   - mid-scroll: is-scrolled → utility+global collapse, local sticks
  //   - at footer: is-at-footer → only global-nav shows on solid purple
  if (atFooter) {
    navSystem?.classList.add('is-at-footer');
    navSystem?.classList.remove('is-scrolled');
  } else if (y > 80) {
    navSystem?.classList.add('is-scrolled');
    navSystem?.classList.remove('is-at-footer');
  } else {
    navSystem?.classList.remove('is-scrolled');
    navSystem?.classList.remove('is-at-footer');
  }

  // Coral progress bar fills as user scrolls
  if (localNavProgress) {
    localNavProgress.style.width = progress + '%';
  }

  // Update current section indicator
  updateActiveSection();

  lastScrollY = y;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateNavOnScroll);
    ticking = true;
  }
}, { passive: true });

// ── Active section detection (Tier 3) ──────────────────
const sectionIds = ['hero', 'cost', 'diagnostics-fail', 'tirt', 'product', 'athome'];

function updateActiveSection() {
  const y = window.scrollY + 200;
  let active = null;

  for (let i = sectionIds.length - 1; i >= 0; i--) {
    const sec = document.getElementById(sectionIds[i]);
    if (sec && sec.offsetTop <= y) {
      active = sectionIds[i];
      break;
    }
  }

  // Highlight active link in Tier 3 (only those with data-target)
  document.querySelectorAll('.local-nav__items a[data-target]').forEach(link => {
    if (link.dataset.target === active) {
      link.classList.add('is-active');
    } else {
      link.classList.remove('is-active');
    }
  });
}

// ── Mega menu hover handlers ───────────────────────────
const menuItems = document.querySelectorAll('.global-menu__item[data-menu]');
let openTimeout = null;
let closeTimeout = null;

menuItems.forEach(item => {
  // Open with delay (prevents flickers)
  item.addEventListener('mouseenter', () => {
    clearTimeout(closeTimeout);
    clearTimeout(openTimeout);
    openTimeout = setTimeout(() => {
      // Close all others
      menuItems.forEach(other => {
        if (other !== item) other.classList.remove('is-open');
      });
      item.classList.add('is-open');
      item.querySelector('.global-menu__link')?.setAttribute('aria-expanded', 'true');
    }, 150);
  });

  // Close with delay
  item.addEventListener('mouseleave', () => {
    clearTimeout(openTimeout);
    closeTimeout = setTimeout(() => {
      item.classList.remove('is-open');
      item.querySelector('.global-menu__link')?.setAttribute('aria-expanded', 'false');
    }, 300);
  });

  // Click on parent link toggles mega panel (for touch + keyboard)
  const link = item.querySelector('.global-menu__link');
  link?.addEventListener('click', (e) => {
    // Only intercept if mega panel exists; let single-link items pass through
    if (item.querySelector('.mega-panel')) {
      e.preventDefault();
      const isOpen = item.classList.contains('is-open');
      menuItems.forEach(other => other.classList.remove('is-open'));
      if (!isOpen) {
        item.classList.add('is-open');
        link.setAttribute('aria-expanded', 'true');
      }
    }
  });
});

// Close all menus on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    menuItems.forEach(item => item.classList.remove('is-open'));
    document.querySelectorAll('.global-menu__link').forEach(link => link.setAttribute('aria-expanded', 'false'));
    document.getElementById('search-dropdown')?.classList.remove('is-open');
  }
});

// Close menus when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.global-menu__item') && !e.target.closest('.mega-panel')) {
    menuItems.forEach(item => item.classList.remove('is-open'));
  }
  if (!e.target.closest('.global-nav__search-btn') && !e.target.closest('.search-dropdown')) {
    document.getElementById('search-dropdown')?.classList.remove('is-open');
  }
});

// ── Search dropdown ─────────────────────────────────────
const searchToggle = document.getElementById('search-toggle');
const searchDropdown = document.getElementById('search-dropdown');

searchToggle?.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = searchDropdown?.classList.toggle('is-open');
  searchToggle.setAttribute('aria-expanded', isOpen);
  if (isOpen) {
    setTimeout(() => searchDropdown.querySelector('input')?.focus(), 50);
  }
});

// ── Local nav (Tier 3) click-to-scroll for anchor links only ───
document.querySelectorAll('.local-nav__items a[data-target]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.getElementById(link.dataset.target);
    if (target) {
      e.preventDefault();
      const offset = 170; // account for full sticky nav (utility + global + local)
      const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

// Reference for downstream smooth-scroll handler (kept for compatibility)
const nav = navSystem;

// ── SMOOTH SCROLL FOR OTHER ANCHOR LINKS ────────────────
document.querySelectorAll('a[href^="#"]:not(.local-nav__items a)').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = (nav?.offsetHeight || 72) + 8;
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

// ── FOOTER PARALLAX REVEAL — desktop + only when footer fits in viewport ──
// Activates by toggling body.has-footer-reveal. CSS pins the footer at
// position: fixed; bottom: 0 and gives body padding-bottom = footer height
// so the page-shell scrolls over the footer. If footer height exceeds 85%
// of the viewport (e.g. tall references list), reveal is disabled and the
// footer stays in normal flow.
(() => {
  const footer = document.querySelector('.footer');
  if (!footer) return;

  const sync = () => {
    if (window.innerWidth >= 1024) {
      document.body.classList.add('has-footer-reveal');
      document.body.style.setProperty('--footer-h', footer.offsetHeight + 'px');
    } else {
      document.body.classList.remove('has-footer-reveal');
      document.body.style.removeProperty('--footer-h');
    }
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };

  sync();
  window.addEventListener('load', sync);
  window.addEventListener('resize', sync);
})();

// ── FOOTER BACK-TO-TOP — smooth scroll on click ──
(() => {
  const btn = document.querySelector('.footer__back-to-top');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ── FOOTER NEWSLETTER — silent submit + toast confirmation ──
// Form posts into a hidden iframe so the page doesn't navigate. We show an
// optimistic "thanks" toast on submit (Mailchimp's actual response loads
// silently in the iframe and isn't surfaced to the user).
(() => {
  const form = document.querySelector('.footer__subscribe');
  if (!form) return;

  const toast = document.createElement('div');
  toast.className = 'footer__toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);

  let timer = null;
  const show = (msg) => {
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('is-visible'), 3500);
  };

  form.addEventListener('submit', () => {
    show("Thanks — you're on the list.");
    setTimeout(() => form.reset(), 200);
  });
})();

