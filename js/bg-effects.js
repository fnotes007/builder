/**
 * bg-effects.js — Animated Background system.
 *
 * Design:
 * - CSS-only effects (gradient/aurora/mesh/blobs/shapes/waves/lines/rays/noise) cost nothing but
 *   GPU compositing — no JS runs for these at all, ever.
 * - Canvas effects (particles/stars/snow/rain/bubbles/circles/attraction) run one requestAnimationFrame
 *   loop per instance, auto-skip entirely at 'low' quality, and pause when their layer scrolls off
 *   screen (IntersectionObserver) or the tab is hidden (visibilitychange).
 * - Mouse effects (parallax/glow) use a single rAF-throttled pointermove listener updating CSS custom
 *   properties — no canvas, near-zero cost.
 * - Everything respects prefers-reduced-motion (hard override, not user-configurable-off) and a
 *   site-wide quality tier (Low/Medium/High/Ultra) that can be auto-detected from device signals.
 * - The whole runtime is ONE function (BgEffects.runtimeSource) so the exact same code runs live in
 *   the editor canvas (called directly) and in the exported site (embedded via .toString()) — no
 *   duplicated logic to drift out of sync.
 */
const BgEffects = {
  NONE: 'none',

  CATALOG: {
    'animated-gradient': { name: 'Animated Gradient', category: 'css', heavy: false },
    'aurora': { name: 'Aurora Lights', category: 'css', heavy: true },
    'mesh-gradient': { name: 'Mesh Gradient', category: 'css', heavy: true },
    'floating-blobs': { name: 'Floating Blobs', category: 'css', heavy: true },
    'geometric-shapes': { name: 'Moving Geometric Shapes', category: 'css', heavy: false },
    'soft-waves': { name: 'Soft Waves', category: 'css', heavy: false },
    'abstract-lines': { name: 'Abstract Lines', category: 'css', heavy: false },
    'light-rays': { name: 'Light Rays', category: 'css', heavy: false },
    'subtle-noise': { name: 'Subtle Noise', category: 'css', heavy: false },
    'floating-particles': { name: 'Floating Particles', category: 'canvas', heavy: false },
    'star-field': { name: 'Star Field', category: 'canvas', heavy: false },
    'snow': { name: 'Snow', category: 'canvas', heavy: false },
    'rain': { name: 'Rain', category: 'canvas', heavy: false },
    'bubbles': { name: 'Bubbles', category: 'canvas', heavy: false },
    'floating-circles': { name: 'Floating Circles', category: 'canvas', heavy: false },
    'mouse-parallax': { name: 'Mouse Parallax', category: 'mouse', heavy: false },
    'mouse-glow': { name: 'Mouse Glow', category: 'mouse', heavy: false },
    'particle-attraction': { name: 'Interactive Particle Attraction', category: 'canvas-mouse', heavy: true },
  },

  defaultConfig() {
    return { speed: 1, opacity: 0.6, color1: '#6366f1', color2: '#f59e0b', color3: '#22d3ee', density: 60, intensity: 0.5 };
  },

  fields: [
    { key: 'bgEffect', label: 'Background Effect', type: 'select', options: ['none','animated-gradient','aurora','mesh-gradient','floating-blobs','geometric-shapes','soft-waves','abstract-lines','light-rays','subtle-noise','floating-particles','star-field','snow','rain','bubbles','floating-circles','mouse-parallax','mouse-glow','particle-attraction'] },
    { key: 'bgEffectSpeed', label: 'Speed', type: 'number', min: 0.25, max: 3, step: 0.25 },
    { key: 'bgEffectOpacity', label: 'Opacity', type: 'number', min: 0.05, max: 1, step: 0.05 },
    { key: 'bgEffectColor1', label: 'Color 1', type: 'color' },
    { key: 'bgEffectColor2', label: 'Color 2', type: 'color' },
    { key: 'bgEffectColor3', label: 'Color 3 / Accent', type: 'color' },
    { key: 'bgEffectDensity', label: 'Particle Count', type: 'number', min: 10, max: 200, step: 5 },
    { key: 'bgEffectIntensity', label: 'Intensity', type: 'number', min: 0.1, max: 1, step: 0.05 },
  ],

  // ---- section data helpers ----
  isActive(section) { return !!section.bgEffect && section.bgEffect !== 'none' && this.CATALOG[section.bgEffect]; },

  configOf(section) {
    const d = this.defaultConfig();
    return {
      speed: section.bgEffectSpeed !== undefined ? section.bgEffectSpeed : d.speed,
      opacity: section.bgEffectOpacity !== undefined ? section.bgEffectOpacity : d.opacity,
      color1: section.bgEffectColor1 || d.color1,
      color2: section.bgEffectColor2 || d.color2,
      color3: section.bgEffectColor3 || d.color3,
      density: section.bgEffectDensity !== undefined ? section.bgEffectDensity : d.density,
      intensity: section.bgEffectIntensity !== undefined ? section.bgEffectIntensity : d.intensity,
    };
  },

  // ---- HTML generation ----
  /** Builds the .wb-bg-layer element (and any static inner markup CSS effects need) for a section. */
  renderLayer(section) {
    const type = section.bgEffect;
    const meta = this.CATALOG[type];
    if (!meta) return '';
    const c = this.configOf(section);
    const styleVars = `--bg-speed:${c.speed};--bg-c1:${escapeHtml(c.color1)};--bg-c2:${escapeHtml(c.color2)};--bg-c3:${escapeHtml(c.color3)};--bg-intensity:${c.intensity};opacity:${c.opacity};`;
    const cfgJson = escapeHtml(JSON.stringify(c)).replace(/'/g, '&#039;');
    let inner = '';
    if (type === 'floating-blobs') {
      const n = Math.max(2, Math.min(6, Math.round(c.density / 30)));
      inner = Array.from({ length: n }).map((_, i) => `<span class="wb-blob" style="--i:${i};--n:${n};"></span>`).join('');
    } else if (type === 'geometric-shapes') {
      const n = Math.max(3, Math.min(10, Math.round(c.density / 15)));
      inner = Array.from({ length: n }).map((_, i) => `<span class="wb-geo-shape wb-geo-shape-${(i % 4) + 1}" style="--i:${i};--n:${n};"></span>`).join('');
    } else if (type === 'abstract-lines') {
      const n = Math.max(3, Math.min(8, Math.round(c.density / 20)));
      inner = Array.from({ length: n }).map((_, i) => `<span class="wb-line" style="--i:${i};--n:${n};"></span>`).join('');
    } else if (type === 'mouse-parallax') {
      inner = `<span class="wb-parallax-layer wb-parallax-1"></span><span class="wb-parallax-layer wb-parallax-2"></span><span class="wb-parallax-layer wb-parallax-3"></span>`;
    }
    return `<div class="wb-bg-layer" data-bg-type="${type}" data-bg-heavy="${meta.heavy ? '1' : '0'}" data-bg-config='${cfgJson}' style="${styleVars}">${inner}</div>`;
  },

  /** Wraps a rendered section's HTML: injects the bg layer + wraps existing content in a positioned
   *  layer above it, so text/buttons always paint above the background regardless of effect type. */
  injectIntoSectionHtml(html, section) {
    if (!this.isActive(section)) return html;
    const rootMatch = html.match(/^<(\w+)/);
    if (!rootMatch) return html;
    const rootTag = rootMatch[1];
    const openTagEnd = html.indexOf('>') + 1;
    const closeTag = `</${rootTag}>`;
    const closeIdx = html.lastIndexOf(closeTag);
    if (openTagEnd <= 0 || closeIdx === -1) return html;
    let openTag = html.slice(0, openTagEnd);
    const inner = html.slice(openTagEnd, closeIdx);
    if (/style="/.test(openTag)) {
      openTag = openTag.replace(/style="([^"]*)"/, (m, existing) => `style="${existing.replace(/;?$/, '')};position:relative;overflow:hidden;"`);
    } else {
      openTag = openTag.replace(/>$/, ' style="position:relative;overflow:hidden;">');
    }
    const bgLayerHtml = this.renderLayer(section);
    return `${openTag}${bgLayerHtml}<div class="wb-bg-content-layer">${inner}</div>${closeTag}`;
  },

  // ---- CSS (shared, generated once regardless of how many sections use effects) ----
  buildCss() {
    return `
.wb-bg-layer{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
.wb-bg-content-layer{position:relative;z-index:1;}
.wb-bg-layer canvas{position:absolute;inset:0;width:100%;height:100%;display:block;}

/* Animated Gradient */
.wb-bg-layer[data-bg-type="animated-gradient"]{background:linear-gradient(135deg,var(--bg-c1),var(--bg-c2),var(--bg-c3),var(--bg-c1));background-size:300% 300%;animation:wb-bg-gradient-shift calc(10s / var(--bg-speed)) ease infinite;}
@keyframes wb-bg-gradient-shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

/* Aurora */
.wb-bg-layer[data-bg-type="aurora"]{background:radial-gradient(ellipse 60% 50% at 20% 20%,var(--bg-c1) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 80% 30%,var(--bg-c2) 0%,transparent 60%),radial-gradient(ellipse 70% 60% at 50% 80%,var(--bg-c3) 0%,transparent 60%);filter:blur(50px);animation:wb-bg-aurora-drift calc(18s / var(--bg-speed)) ease-in-out infinite;}
@keyframes wb-bg-aurora-drift{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(3%,-4%) scale(1.08);}66%{transform:translate(-3%,3%) scale(0.96);}}

/* Mesh Gradient */
.wb-bg-layer[data-bg-type="mesh-gradient"]{background:radial-gradient(at 10% 20%,var(--bg-c1) 0,transparent 45%),radial-gradient(at 85% 15%,var(--bg-c2) 0,transparent 45%),radial-gradient(at 25% 85%,var(--bg-c3) 0,transparent 45%),radial-gradient(at 90% 80%,var(--bg-c1) 0,transparent 45%);animation:wb-bg-mesh-shift calc(14s / var(--bg-speed)) ease-in-out infinite alternate;}
@keyframes wb-bg-mesh-shift{0%{filter:hue-rotate(0deg);transform:scale(1);}100%{filter:hue-rotate(20deg);transform:scale(1.06);}}

/* Floating Blobs */
.wb-bg-layer[data-bg-type="floating-blobs"] .wb-blob{position:absolute;width:38%;height:38%;border-radius:50%;filter:blur(35px);left:calc(10% + (var(--i) * (70% / var(--n))));top:calc(15% + (var(--i) * 9%) % 60%);background:calc(var(--i) % 3 == 0 ? var(--bg-c1) : var(--i) % 3 == 1 ? var(--bg-c2) : var(--bg-c3));background:var(--bg-c1);animation:wb-bg-blob-float calc((14s + (var(--i) * 3s)) / var(--bg-speed)) ease-in-out infinite;animation-delay:calc(var(--i) * -2.5s);}
.wb-bg-layer[data-bg-type="floating-blobs"] .wb-blob:nth-child(3n+1){background:var(--bg-c1);}
.wb-bg-layer[data-bg-type="floating-blobs"] .wb-blob:nth-child(3n+2){background:var(--bg-c2);}
.wb-bg-layer[data-bg-type="floating-blobs"] .wb-blob:nth-child(3n+3){background:var(--bg-c3);}
@keyframes wb-bg-blob-float{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(6%,-8%) scale(1.15);}}

/* Geometric Shapes */
.wb-bg-layer[data-bg-type="geometric-shapes"] .wb-geo-shape{position:absolute;width:36px;height:36px;opacity:.5;left:calc((var(--i) * (100% / var(--n))));top:calc(10% + (var(--i) * 13%) % 75%);border:2px solid var(--bg-c1);animation:wb-bg-geo-spin calc((16s + var(--i) * 2s) / var(--bg-speed)) linear infinite;}
.wb-bg-layer[data-bg-type="geometric-shapes"] .wb-geo-shape-1{border-color:var(--bg-c1);}
.wb-bg-layer[data-bg-type="geometric-shapes"] .wb-geo-shape-2{border-color:var(--bg-c2);border-radius:50%;}
.wb-bg-layer[data-bg-type="geometric-shapes"] .wb-geo-shape-3{border-color:var(--bg-c3);clip-path:polygon(50% 0%,0% 100%,100% 100%);}
.wb-bg-layer[data-bg-type="geometric-shapes"] .wb-geo-shape-4{border-color:var(--bg-c1);clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);}
@keyframes wb-bg-geo-spin{0%{transform:rotate(0deg) translateY(0);}50%{transform:rotate(180deg) translateY(-20px);}100%{transform:rotate(360deg) translateY(0);}}

/* Soft Waves */
.wb-bg-layer[data-bg-type="soft-waves"]{background-image:url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,40 C300,100 900,0 1200,50 L1200,120 L0,120 Z' fill='%23888'/%3E%3C/svg%3E");background-size:1400px 60%;background-repeat:repeat-x;background-position:0 bottom;animation:wb-bg-wave-scroll calc(12s / var(--bg-speed)) linear infinite;mix-blend-mode:overlay;}
@keyframes wb-bg-wave-scroll{from{background-position-x:0;}to{background-position-x:-1400px;}}

/* Abstract Lines */
.wb-bg-layer[data-bg-type="abstract-lines"] .wb-line{position:absolute;width:150%;height:2px;left:-25%;top:calc(var(--i) * (100% / var(--n)));background:linear-gradient(90deg,transparent,var(--bg-c1),transparent);opacity:.5;transform:rotate(-8deg);animation:wb-bg-line-slide calc((10s + var(--i) * 1.5s) / var(--bg-speed)) ease-in-out infinite;}
.wb-bg-layer[data-bg-type="abstract-lines"] .wb-line:nth-child(2n){background:linear-gradient(90deg,transparent,var(--bg-c2),transparent);}
@keyframes wb-bg-line-slide{0%,100%{transform:rotate(-8deg) translateX(-3%);}50%{transform:rotate(-8deg) translateX(3%);}}

/* Light Rays */
.wb-bg-layer[data-bg-type="light-rays"]{background:conic-gradient(from 0deg at 50% 0%,transparent 0deg,var(--bg-c1) 8deg,transparent 20deg,transparent 160deg,var(--bg-c2) 168deg,transparent 180deg,transparent 340deg,var(--bg-c3) 350deg,transparent 360deg);animation:wb-bg-rays-spin calc(30s / var(--bg-speed)) linear infinite;transform-origin:50% 0%;opacity:calc(var(--bg-intensity) * 0.8);}
@keyframes wb-bg-rays-spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}

/* Subtle Noise */
.wb-bg-layer[data-bg-type="subtle-noise"]{background-image:url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:180px 180px;animation:wb-bg-noise-flicker calc(1.4s / var(--bg-speed)) steps(2) infinite;}
@keyframes wb-bg-noise-flicker{0%,100%{opacity:.9;}50%{opacity:.6;}}

/* Mouse Parallax */
.wb-bg-layer[data-bg-type="mouse-parallax"] .wb-parallax-layer{position:absolute;inset:-10%;border-radius:50%;opacity:.35;}
.wb-bg-layer[data-bg-type="mouse-parallax"] .wb-parallax-1{background:radial-gradient(circle at 30% 30%,var(--bg-c1),transparent 55%);transform:translate(calc(var(--mx,0) * -18px),calc(var(--my,0) * -18px));}
.wb-bg-layer[data-bg-type="mouse-parallax"] .wb-parallax-2{background:radial-gradient(circle at 70% 60%,var(--bg-c2),transparent 55%);transform:translate(calc(var(--mx,0) * 30px),calc(var(--my,0) * 30px));}
.wb-bg-layer[data-bg-type="mouse-parallax"] .wb-parallax-3{background:radial-gradient(circle at 50% 80%,var(--bg-c3),transparent 55%);transform:translate(calc(var(--mx,0) * -12px),calc(var(--my,0) * 12px));}

/* Mouse Glow */
.wb-bg-layer[data-bg-type="mouse-glow"]{background:radial-gradient(circle 260px at var(--gx,50%) var(--gy,50%),var(--bg-c1),transparent 70%);}

/* Quality tiers: low disables filters (blur is the most expensive op here) and freezes CSS motion.
   NOTE: these target .wb-bg-layer directly (not "[data-wb-quality] .wb-bg-layer") because the live
   editor canvas scopes all exported CSS under #wb-preview-root as a descendant selector — an
   ancestor-based selector (quality lives on <body>, which is an ANCESTOR of the canvas root, not a
   descendant) would silently never match there. The runtime copies the resolved quality onto each
   layer element itself so the same selectors work correctly in both the canvas and the real export. */
.wb-bg-layer[data-wb-quality="low"]{filter:none !important;animation-play-state:paused !important;}
.wb-bg-layer[data-bg-heavy="1"][data-wb-quality="low"]{display:none;}
.wb-bg-layer[data-bg-type="aurora"][data-wb-quality="medium"],
.wb-bg-layer[data-bg-type="floating-blobs"][data-wb-quality="medium"]{filter:blur(20px);}

@media(prefers-reduced-motion:reduce){
  .wb-bg-layer{animation:none !important;filter:none !important;}
  .wb-bg-layer[data-bg-heavy="1"]{display:none;}
}

/* Visitor "disable animations" toggle */
#wb-anim-toggle{position:fixed;left:16px;bottom:16px;z-index:998;background:rgba(0,0,0,.65);color:#fff;border:none;border-radius:999px;padding:8px 14px;font-size:.72rem;font-family:inherit;cursor:pointer;backdrop-filter:blur(4px);}
body[data-wb-anim-disabled="1"] .wb-bg-layer{display:none !important;}
`;
  },

  // ---- Runtime (shared between live canvas preview and exported static site) ----
  /** Self-contained IIFE source. Called directly for the live canvas; embedded via .toString()
   *  for the exported site. Must not reference anything outside its own closure. */
  runtimeSource: function () {
    (function () {
      if (window.__wbBg) return; // installed already; mountAll/unmountAll are idempotent, re-grab refs
      var state = { loops: [], observers: [], mouseHandlers: [], mounted: new WeakSet(), quality: 'high', reducedMotion: false };

      function detectTier() {
        try {
          var cores = navigator.hardwareConcurrency || 4;
          var mem = navigator.deviceMemory || 4;
          var saveData = navigator.connection && navigator.connection.saveData;
          if (saveData) return 'low';
          if (mem <= 2 || cores <= 2) return 'low';
          if (mem <= 4 || cores <= 4) return 'medium';
          return 'high';
        } catch (e) { return 'medium'; }
      }

      function resolveQuality(root) {
        var body = document.body;
        var configured = (body && body.getAttribute('data-wb-quality-setting')) || 'high';
        var autoDetect = body && body.getAttribute('data-wb-auto-detect') !== '0';
        var order = { low: 0, medium: 1, high: 2, ultra: 3 };
        var q = configured;
        if (autoDetect) {
          var detected = detectTier();
          if (order[detected] < order[q]) q = detected;
        }
        state.reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (state.reducedMotion) q = 'low';
        state.quality = q;
        if (body) body.setAttribute('data-wb-quality', q);
        return q;
      }

      function densityForQuality(base, quality) {
        var caps = { low: 0, medium: 30, high: 120, ultra: 260 };
        return Math.max(0, Math.min(base, caps[quality] !== undefined ? caps[quality] : base));
      }

      // ---------- Canvas particle systems ----------
      function makeCanvas(layer) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        if (!ctx) return null;
        layer.appendChild(canvas);
        function resize() {
          var r = layer.getBoundingClientRect();
          canvas.width = Math.max(1, Math.round(r.width));
          canvas.height = Math.max(1, Math.round(r.height));
        }
        resize();
        var ro = ('ResizeObserver' in window) ? new ResizeObserver(resize) : null;
        if (ro) { ro.observe(layer); state.observers.push(ro); }
        else window.addEventListener('resize', resize);
        return { canvas: canvas, ctx: ctx, resize: resize };
      }

      function particleSystem(layer, cfg, type) {
        var quality = state.quality;
        var count = densityForQuality(cfg.density || 60, quality);
        if (count <= 0) return; // low quality: skip canvas entirely, CSS/flat background shows instead
        var cv = makeCanvas(layer);
        if (!cv) return;
        var ctx = cv.ctx, canvas = cv.canvas;
        var speed = cfg.speed || 1;
        var intensity = cfg.intensity !== undefined ? cfg.intensity : 0.5;
        var colors = [cfg.color1, cfg.color2, cfg.color3].filter(Boolean);
        var mouse = { x: -9999, y: -9999 };

        function rand(a, b) { return a + Math.random() * (b - a); }
        function hexToRgba(hex, a) {
          var h = (hex || '#ffffff').replace('#', '');
          if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
          var r = parseInt(h.substr(0, 2), 16) || 255, g = parseInt(h.substr(2, 2), 16) || 255, b = parseInt(h.substr(4, 2), 16) || 255;
          return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        }

        var particles = [];
        function spawn(i) {
          var w = canvas.width, h = canvas.height;
          var p = { color: colors[i % colors.length] || '#ffffff' };
          if (type === 'floating-particles') {
            p.x = rand(0, w); p.y = rand(0, h); p.r = rand(1.5, 3.5) * (0.6 + intensity); p.vx = rand(-0.15, 0.15) * speed; p.vy = rand(-0.25, -0.08) * speed; p.a = rand(0.3, 0.8); p.phase = rand(0, Math.PI * 2);
          } else if (type === 'star-field') {
            p.x = rand(0, w); p.y = rand(0, h); p.r = rand(0.6, 1.8); p.a = rand(0.3, 1); p.phase = rand(0, Math.PI * 2); p.twinkleSpeed = rand(0.02, 0.06) * speed;
          } else if (type === 'snow') {
            p.x = rand(0, w); p.y = rand(-h, h); p.r = rand(1.5, 4); p.vy = rand(0.3, 1) * speed; p.vx = rand(-0.3, 0.3) * speed; p.sway = rand(0, Math.PI * 2); p.a = rand(0.5, 0.9);
          } else if (type === 'rain') {
            p.x = rand(0, w); p.y = rand(-h, 0); p.len = rand(10, 22); p.vy = rand(6, 11) * speed; p.a = rand(0.25, 0.5);
          } else if (type === 'bubbles') {
            p.x = rand(0, w); p.y = h + rand(0, h); p.r = rand(3, 10) * (0.6 + intensity); p.vy = -rand(0.3, 0.9) * speed; p.wob = rand(0, Math.PI * 2); p.a = rand(0.2, 0.5);
          } else if (type === 'floating-circles') {
            p.x = rand(0, w); p.y = rand(0, h); p.r = rand(8, 22) * (0.5 + intensity); p.vx = rand(-0.25, 0.25) * speed; p.vy = rand(-0.25, 0.25) * speed; p.a = rand(0.12, 0.3);
          } else if (type === 'particle-attraction') {
            p.x = rand(0, w); p.y = rand(0, h); p.vx = 0; p.vy = 0; p.r = rand(1.5, 3); p.a = rand(0.4, 0.8);
          }
          return p;
        }
        for (var i = 0; i < count; i++) particles.push(spawn(i));

        function onMove(e) {
          var r = canvas.getBoundingClientRect();
          var t = e.touches ? e.touches[0] : e;
          mouse.x = t.clientX - r.left; mouse.y = t.clientY - r.top;
        }
        function onLeave() { mouse.x = -9999; mouse.y = -9999; }
        if (type === 'particle-attraction') {
          layer.style.pointerEvents = 'auto';
          layer.addEventListener('mousemove', onMove);
          layer.addEventListener('mouseleave', onLeave);
          layer.addEventListener('touchmove', onMove, { passive: true });
          state.mouseHandlers.push({ el: layer, fns: [['mousemove', onMove], ['mouseleave', onLeave], ['touchmove', onMove]] });
        }

        var t0 = performance.now();
        function frame(now) {
          var w = canvas.width, h = canvas.height;
          ctx.clearRect(0, 0, w, h);
          for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            if (type === 'floating-particles') {
              p.x += p.vx + Math.sin(now / 1000 + p.phase) * 0.15; p.y += p.vy;
              if (p.y < -10) { p.y = h + 10; p.x = rand(0, w); }
              ctx.beginPath(); ctx.fillStyle = hexToRgba(p.color, p.a * 0.7); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
            } else if (type === 'star-field') {
              var tw = 0.5 + 0.5 * Math.sin(now / 1000 * p.twinkleSpeed * 30 + p.phase);
              ctx.beginPath(); ctx.fillStyle = hexToRgba(p.color, p.a * tw); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
            } else if (type === 'snow') {
              p.y += p.vy; p.x += Math.sin(now / 800 + p.sway) * 0.3 * speed;
              if (p.y > h + 5) { p.y = -5; p.x = rand(0, w); }
              ctx.beginPath(); ctx.fillStyle = hexToRgba(p.color, p.a); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
            } else if (type === 'rain') {
              p.y += p.vy;
              if (p.y > h + 20) { p.y = -20; p.x = rand(0, w); }
              ctx.strokeStyle = hexToRgba(p.color, p.a); ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - 1, p.y + p.len); ctx.stroke();
            } else if (type === 'bubbles') {
              p.y += p.vy; p.x += Math.sin(now / 900 + p.wob) * 0.4;
              if (p.y < -15) { p.y = h + 15; p.x = rand(0, w); }
              ctx.beginPath(); ctx.strokeStyle = hexToRgba(p.color, p.a); ctx.lineWidth = 1; ctx.arc(p.x, p.y, p.r, 0, 7); ctx.stroke();
            } else if (type === 'floating-circles') {
              p.x += p.vx; p.y += p.vy;
              if (p.x < -p.r) p.x = w + p.r; if (p.x > w + p.r) p.x = -p.r;
              if (p.y < -p.r) p.y = h + p.r; if (p.y > h + p.r) p.y = -p.r;
              ctx.beginPath(); ctx.fillStyle = hexToRgba(p.color, p.a); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
            } else if (type === 'particle-attraction') {
              var dx = mouse.x - p.x, dy = mouse.y - p.y, dist = Math.sqrt(dx * dx + dy * dy) || 1;
              if (dist < 140) { var f = (140 - dist) / 140 * 0.06 * speed; p.vx += (dx / dist) * f; p.vy += (dy / dist) * f; }
              p.vx *= 0.96; p.vy *= 0.96;
              p.x += p.vx; p.y += p.vy;
              if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1;
              p.x = Math.max(0, Math.min(w, p.x)); p.y = Math.max(0, Math.min(h, p.y));
              ctx.beginPath(); ctx.fillStyle = hexToRgba(p.color, p.a); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
            }
          }
        }

        var running = true, visible = true, raf = null;
        function tick(now) { if (running && visible) { frame(now); } raf = requestAnimationFrame(tick); }
        raf = requestAnimationFrame(tick);

        if ('IntersectionObserver' in window) {
          var io = new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }, { threshold: 0.01 });
          io.observe(layer);
          state.observers.push(io);
        }

        state.loops.push({
          pause: function () { running = false; },
          resume: function () { running = true; },
          destroy: function () {
            running = false; if (raf) cancelAnimationFrame(raf);
            if (type === 'particle-attraction') {
              layer.removeEventListener('mousemove', onMove);
              layer.removeEventListener('mouseleave', onLeave);
              layer.removeEventListener('touchmove', onMove);
            }
          },
        });
      }

      // ---------- Mouse parallax / glow (no canvas) ----------
      function mouseEffect(layer, type) {
        var raf = null, targetX = 0, targetY = 0, curX = 0, curY = 0;
        function onMove(e) {
          var r = layer.getBoundingClientRect();
          var t = e.touches ? e.touches[0] : e;
          var relX = (t.clientX - r.left) / r.width;
          var relY = (t.clientY - r.top) / r.height;
          if (type === 'mouse-glow') { targetX = relX * 100; targetY = relY * 100; }
          else { targetX = (relX - 0.5) * 2; targetY = (relY - 0.5) * 2; }
        }
        layer.style.pointerEvents = 'auto';
        layer.addEventListener('mousemove', onMove);
        layer.addEventListener('touchmove', onMove, { passive: true });
        function loop() {
          curX += (targetX - curX) * 0.08; curY += (targetY - curY) * 0.08;
          if (type === 'mouse-glow') { layer.style.setProperty('--gx', curX + '%'); layer.style.setProperty('--gy', curY + '%'); }
          else { layer.style.setProperty('--mx', curX.toFixed(3)); layer.style.setProperty('--my', curY.toFixed(3)); }
          raf = requestAnimationFrame(loop);
        }
        raf = requestAnimationFrame(loop);
        state.loops.push({ pause: function () {}, resume: function () {}, destroy: function () { if (raf) cancelAnimationFrame(raf); layer.removeEventListener('mousemove', onMove); layer.removeEventListener('touchmove', onMove); } });
      }

      // ---------- mount / unmount ----------
      function mountAll(root) {
        root = root || document;
        var q = resolveQuality(root);
        var layers = root.querySelectorAll('.wb-bg-layer[data-bg-type]');
        layers.forEach(function (layer) { layer.setAttribute('data-wb-quality', q); });
        if (q === 'low' || state.reducedMotion) {
          // Heavy CSS effects are hidden via CSS at low quality / reduced motion; canvas/mouse skip entirely.
          return;
        }
        layers.forEach(function (layer) {
          if (state.mounted.has(layer)) return;
          state.mounted.add(layer);
          var type = layer.getAttribute('data-bg-type');
          var cfg = {};
          try { cfg = JSON.parse(layer.getAttribute('data-bg-config') || '{}'); } catch (e) {}
          var canvasTypes = ['floating-particles', 'star-field', 'snow', 'rain', 'bubbles', 'floating-circles', 'particle-attraction'];
          if (canvasTypes.indexOf(type) !== -1) particleSystem(layer, cfg, type);
          else if (type === 'mouse-parallax' || type === 'mouse-glow') mouseEffect(layer, type);
        });
      }

      function unmountAll() {
        state.loops.forEach(function (l) { l.destroy(); });
        state.loops = [];
        state.observers.forEach(function (o) { o.disconnect(); });
        state.observers = [];
        state.mounted = new WeakSet();
      }

      document.addEventListener('visibilitychange', function () {
        var fn = document.hidden ? 'pause' : 'resume';
        state.loops.forEach(function (l) { l[fn](); });
      });

      // Visitor-facing disable toggle (only present if the site owner enabled it)
      var toggleBtn = document.getElementById('wb-anim-toggle');
      if (toggleBtn) {
        try {
          if (localStorage.getItem('wb-anim-disabled') === '1') document.body.setAttribute('data-wb-anim-disabled', '1');
        } catch (e) {}
        toggleBtn.addEventListener('click', function () {
          var disabled = document.body.getAttribute('data-wb-anim-disabled') === '1';
          if (disabled) { document.body.removeAttribute('data-wb-anim-disabled'); mountAll(document); }
          else { document.body.setAttribute('data-wb-anim-disabled', '1'); unmountAll(); }
          try { localStorage.setItem('wb-anim-disabled', disabled ? '0' : '1'); } catch (e) {}
        });
      }

      window.__wbBg = { mountAll: mountAll, unmountAll: unmountAll, resolveQuality: resolveQuality };
      mountAll(document);
    })();
  },

  /** Called by the editor after each canvas render. */
  mountAll(root) {
    if (!window.__wbBg) { try { this.runtimeSource(); } catch (e) {} }
    if (window.__wbBg) window.__wbBg.mountAll(root);
  },
  unmountAll() {
    if (window.__wbBg) window.__wbBg.unmountAll();
  },
  exportRuntimeJs() {
    return `(${this.runtimeSource.toString()})();`;
  },
};
window.BgEffects = BgEffects;
