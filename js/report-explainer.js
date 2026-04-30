/* ═══════════════════════════════════════════════════════
   REPORT-EXPLAINER.JS — Inline BeatController
   Scoped to #re-wrap — no global conflicts
   ═══════════════════════════════════════════════════════ */

(function() {
  const W = document.getElementById('re-wrap');
  if (!W) return;

  const $ = s => W.querySelector(s);
  const $$ = s => W.querySelectorAll(s);

  // ── HELPERS ────────────────────────────────────────

  function showCallout(text) {
    const el = $('#re-callout');
    gsap.to(el, { opacity: 0, duration: 0.2, onComplete: () => {
      el.textContent = text;
      gsap.to(el, { opacity: 1, duration: 0.4 });
    }});
  }

  function clearHL() {
    $$('.re-hl').forEach(b => b.remove());
    $$('.re-insight-arrow').forEach(a => a.remove());
  }

  function resetStage() {
    clearHL();
    const stage = $('#re-stage');
    stage.classList.remove('re-two-up');
    gsap.set(stage, { scale: 1, x: 0, y: 0, opacity: 1 });
    gsap.set('#re-p1', { opacity: 1, display: 'block', scale: 1, x: 0, y: 0 });
    gsap.set('#re-p2', { display: 'none', opacity: 0 });
    gsap.set('#re-table', { rotateX: 0, translateZ: 0, transformPerspective: 'none' });
    gsap.set('#re-brand-close', { opacity: 0 });
    gsap.set('#re-panels', { opacity: 0 });
    $$('.re-panel').forEach(p => gsap.set(p, { x: '100%' }));
    $$('[class*="re-col-"]').forEach(c => gsap.set(c, { opacity: 1 }));
  }

  function hlOverEl(el, type, pad) {
    type = type || 'teal'; pad = pad || 4;
    const page = el.closest('.re-page');
    const pr = page.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    const box = document.createElement('div');
    box.className = 're-hl re-hl--' + type;
    box.style.cssText = 'top:'+(er.top-pr.top-pad)+'px;left:'+(er.left-pr.left-pad)+'px;width:'+(er.width+pad*2)+'px;height:'+(er.height+pad*2)+'px;';
    page.querySelector('.re-hl-layer').appendChild(box);
    return box;
  }

  function drawBox(box, dur) {
    dur = dur || 0.6;
    gsap.fromTo(box, { opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: dur, ease: 'power2.inOut' });
  }

  // ── BEATS ──────────────────────────────────────────

  const beats = [
    // BEAT 1 — Intro
    { duration: 4000, run() {
      resetStage();
      const stage = $('#re-stage');
      stage.classList.add('re-two-up');
      $('#re-p2').style.display = 'block';
      gsap.set([stage, '#re-p1', '#re-p2'], { opacity: 0 });
      gsap.set(stage, { scale: 0.65 });
      const tl = gsap.timeline();
      tl.to([stage, '#re-p1', '#re-p2'], { opacity: 1, duration: 0.8 })
        .to(stage, { scale: 1, duration: 1.2, ease: 'power2.inOut' }, '+=0.5')
        .call(() => { stage.classList.remove('re-two-up'); $('#re-p2').style.display = 'none'; gsap.set(stage, { scale: 1 }); });
      showCallout("The Guidance UTI report. Two pages — everything your physician needs to make a treatment decision.");
    }},

    // BEAT 2 — Organisms
    { duration: 6000, run() {
      resetStage();
      showCallout("Three organisms detected — together, in the same sample, interacting. Counts shown as semi-quantitative ranges.");
      const org = $('#re-organisms');
      const box = hlOverEl(org, 'teal', 6);
      drawBox(box, 0.8);
      $$('.re-org-name').forEach((n, i) => {
        const u = document.createElement('span');
        u.style.cssText = 'position:absolute;bottom:-1px;left:0;width:100%;height:2px;background:#00ae81;transform:scaleX(0);transform-origin:left;';
        n.style.position = 'relative';
        n.appendChild(u);
        gsap.to(u, { scaleX: 1, duration: 0.5, delay: 1 + i * 0.4, ease: 'power2.out' });
      });
    }},

    // BEAT 3 — Color Panels
    { duration: 8000, run() {
      resetStage();
      gsap.to('#re-p1', { opacity: 0.2, duration: 0.5 });
      gsap.set('#re-panels', { opacity: 1 });
      const panels = $$('.re-panel');
      const tl = gsap.timeline({ delay: 0.5 });
      panels.forEach((p, i) => { tl.to(p, { x: '0%', duration: 0.5, ease: 'power3.out' }, i * 0.4); });
      tl.to(panels, { x: '-100%', duration: 0.6, ease: 'power3.in', stagger: 0.05 }, '+=2');
      tl.to('#re-p1', { opacity: 1, duration: 0.5 });
      tl.set('#re-panels', { opacity: 0 });
      tl.set(panels, { x: '100%' });
      gsap.to('#re-callout', { opacity: 0, duration: 0.2 });
    }},

    // BEAT 4 — Table Appears
    { duration: 5000, run() {
      resetStage();
      showCallout("20 antibiotics tested. The Legend tells you how to read every cell: S = susceptible, I = intermediate, R = resistant, RGD = resistance gene detected.");
      const table = $('#re-table');
      const legend = $('#re-legend');
      const tb = hlOverEl(table, 'teal', 6);
      const lb = hlOverEl(legend, 'teal', 4);
      gsap.timeline({ delay: 0.3 }).call(() => drawBox(tb, 0.8)).call(() => drawBox(lb, 0.6), [], '+=0.2');
    }},

    // BEAT 5 — Column Walk
    { duration: 8000, run() {
      resetStage();
      $$('[class*="re-col-"]').forEach(c => gsap.to(c, { opacity: 0.3, duration: 0.3 }));
      $$('.re-col-1').forEach(c => gsap.to(c, { opacity: 1, duration: 0.3 }));
      showCallout("Doxycycline: Pooled susceptibility detected (S). MIC of 4. Available oral and IV. A viable treatment option.");
      gsap.delayedCall(3.5, () => {
        $$('.re-col-1').forEach(c => gsap.to(c, { opacity: 0.3, duration: 0.3 }));
        $$('.re-col-3').forEach(c => gsap.to(c, { opacity: 1, duration: 0.3 }));
        showCallout("Nitrofurantoin: Susceptible, oral formulation. One of the most commonly prescribed UTI antibiotics — confirmed effective here.");
      });
    }},

    // BEAT 6 — 3D Lift + S/I/R highlights
    { duration: 8000, run() {
      resetStage();
      showCallout("10 antibiotics show pooled susceptibility. 3 intermediate. 7 resistant. Guidance shows the full picture — all at once.");
      const table = $('#re-table');
      const tl = gsap.timeline({ delay: 0.3 });
      tl.to(table, { rotateX: -15, translateZ: 40, transformPerspective: 800, duration: 0.8, ease: 'power2.out' });
      tl.call(() => { for (let i=1;i<=10;i++){const c=$('#re-row-past .re-col-'+i);if(c){const b=hlOverEl(c,'teal',2);gsap.set(b,{opacity:1});}} }, [], '+=0.3');
      tl.call(() => { for (let i=14;i<=20;i++){const c=$('#re-row-past .re-col-'+i);if(c){const b=hlOverEl(c,'coral',2);gsap.set(b,{opacity:1});}} }, [], '+=0.3');
      tl.call(() => { for (let i=11;i<=13;i++){const c=$('#re-row-past .re-col-'+i);if(c){const b=hlOverEl(c,'amber',2);gsap.set(b,{opacity:1});}} }, [], '+=0.3');
      tl.to(table, { rotateX: 0, translateZ: 0, duration: 0.8, ease: 'power2.inOut' }, '+=2');
    }},

    // BEAT 7 — RGD Insight
    { duration: 8000, run() {
      resetStage();
      const rgdLabel = $('#re-row-rgd .re-row-label');
      const lb = hlOverEl(rgdLabel, 'teal', 4);
      drawBox(lb, 0.6);
      gsap.delayedCall(1, () => {
        [8,9,10,12,13,17,18,19,20].forEach(i => {
          const c = $('#re-row-rgd .re-col-'+i);
          if(c){const b=hlOverEl(c,'amber',2);gsap.fromTo(b,{opacity:0},{opacity:1,duration:0.4});}
        });
      });
      gsap.delayedCall(3, () => {
        showCallout("Resistance gene detected — but pooled susceptibility is still S. Gene presence does not always equal clinical resistance. P-AST evaluates the actual infection.");
        const pastCell = $('#re-row-past .re-col-8');
        if(pastCell){const sb=hlOverEl(pastCell,'teal',3);gsap.fromTo(sb,{opacity:0},{opacity:1,duration:0.5});}
      });
      showCallout("Resistance genes are detected in several columns. But gene presence does not always equal clinical resistance.");
    }},

    // BEAT 8 — Page 2
    { duration: 8000, run() {
      resetStage();
      showCallout("Page 2 is the action page. Plain language. The physician sees exactly which antibiotics to use — and which to avoid.");
      gsap.to('#re-p1', { opacity: 0, duration: 0.5, onComplete: () => { $('#re-p1').style.display = 'none'; }});
      $('#re-p2').style.display = 'block';
      gsap.fromTo('#re-p2', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.5 });
      ['#re-p2-s','#re-p2-i','#re-p2-r'].forEach((s,i) => {
        gsap.fromTo(s, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, delay: 1.2 + i * 0.5 });
      });
      gsap.delayedCall(3, () => {
        const sl = $('#re-p2-s');
        const b = hlOverEl(sl, 'teal', 6);
        drawBox(b, 1.0);
      });
    }},

    // BEAT 9 — Close
    { duration: 6000, run() {
      resetStage();
      const stage = $('#re-stage');
      stage.classList.add('re-two-up');
      $('#re-p1').style.display = 'block';
      $('#re-p2').style.display = 'block';
      gsap.set('#re-p1', { opacity: 1 });
      gsap.set('#re-p2', { opacity: 1 });
      gsap.fromTo(stage, { scale: 0.6, opacity: 0 }, { scale: 0.6, opacity: 1, duration: 0.8 });
      gsap.to(stage, { opacity: 0.15, duration: 0.5, delay: 1.5 });
      gsap.to('#re-brand-close', { opacity: 1, duration: 0.5, delay: 2 });
      gsap.fromTo('#re-brand-line', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, delay: 2.2 });
      gsap.fromTo('#re-brand-tagline', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, delay: 3.2 });
      showCallout("One sample. One pooled test. One clear answer.");
    }}
  ];

  // ── CONTROLLER ─────────────────────────────────────

  let current = 0, isPlaying = false, timer = null;

  function goTo(i) {
    clearTimeout(timer);
    current = i;
    updateDots();
    beats[i].run();
  }

  function next() {
    if (current < beats.length - 1) { goTo(current + 1); if (isPlaying) scheduleNext(); }
    else pause();
  }

  function prev() {
    if (current > 0) { goTo(current - 1); if (isPlaying) scheduleNext(); }
  }

  function play() { isPlaying = true; updatePlayBtn(); goTo(current); scheduleNext(); }
  function pause() { isPlaying = false; clearTimeout(timer); updatePlayBtn(); }
  function toggle() { isPlaying ? pause() : play(); }

  function scheduleNext() {
    clearTimeout(timer);
    timer = setTimeout(() => { if (isPlaying) next(); }, beats[current].duration);
  }

  function updateDots() {
    $$('.re-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function updatePlayBtn() {
    const btn = $('#re-play-btn');
    if (btn) btn.textContent = isPlaying ? '⏸ Pause' : '▶ Play';
  }

  // ── INIT ───────────────────────────────────────────

  // Wire controls
  const prevBtn = $('#re-prev-btn');
  const nextBtn = $('#re-next-btn');
  const playBtn = $('#re-play-btn');

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);
  if (playBtn) playBtn.addEventListener('click', toggle);

  $$('.re-dot').forEach(d => {
    d.addEventListener('click', () => { pause(); goTo(parseInt(d.dataset.beat)); });
  });

  // Start at Beat 1 when scrolled into view
  ScrollTrigger.create({
    trigger: W,
    start: 'top 80%',
    once: true,
    onEnter: () => goTo(0)
  });

})();
