/**
 * animations.js — Scroll-reveal animation system for all section types.
 *
 * - Global on/off (project.siteSettings.scrollAnimEnabled) with a per-section tri-state override
 *   (inherit / enabled / disabled) that always wins over the global setting when explicitly set.
 * - IntersectionObserver only (no scroll listeners). Toggles a class both ways, so the reveal
 *   genuinely repeats every time a section leaves and re-enters the viewport.
 * - Only opacity + transform are animated (GPU-accelerated, no layout/paint cost).
 * - Subtle/premium defaults: fade-up, 800ms, ease-out, 36px travel distance.
 * - Hard-respects prefers-reduced-motion: animations are skipped entirely (content just shows).
 */
const Animations = {
  TYPES: ['none', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom-in', 'scale-up'],

  // Old type names from before this system was redesigned — kept so previously-saved projects
  // migrate to their closest new equivalent instead of ending up with an invalid/blank type.
  LEGACY_TYPE_MAP: { fade: 'fade-up', 'slide-up': 'fade-up', 'slide-left': 'fade-left', 'slide-right': 'fade-right', zoom: 'zoom-in', flip: 'scale-up', rotate: 'scale-up' },

  defaultData() { return { type: 'fade-up', duration: 800, delay: 0, distance: 36, override: 'inherit' }; },

  fields: [
    { key: 'override', label: 'Animation', type: 'select', options: ['inherit', 'enabled', 'disabled'] },
    { key: 'type', label: 'Animation Type', type: 'select', options: ['none', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom-in', 'scale-up'] },
    { key: 'duration', label: 'Duration (ms)', type: 'number', min: 200, max: 2000, step: 50 },
    { key: 'delay', label: 'Delay (ms)', type: 'number', min: 0, max: 1500, step: 50 },
    { key: 'distance', label: 'Distance (px)', type: 'number', min: 10, max: 120, step: 5 },
  ],

  /** Migrates an old-shape animation object (or none at all) to the current schema. */
  migrate(animation) {
    const d = this.defaultData();
    if (!animation) return d;
    const type = this.LEGACY_TYPE_MAP[animation.type] || animation.type || d.type;
    return {
      type: this.TYPES.includes(type) ? type : d.type,
      duration: animation.duration !== undefined ? animation.duration : d.duration,
      delay: animation.delay !== undefined ? animation.delay : d.delay,
      distance: animation.distance !== undefined ? animation.distance : d.distance,
      override: ['inherit', 'enabled', 'disabled'].includes(animation.override) ? animation.override : d.override,
    };
  },

  /** Resolves whether this section's animation should actually play, given the tri-state
   *  override and the project-wide global toggle (default: on). */
  isEffectivelyEnabled(animation, globalEnabled) {
    if (!animation || animation.type === 'none') return false;
    const override = animation.override || 'inherit';
    if (override === 'enabled') return true;
    if (override === 'disabled') return false;
    return globalEnabled !== false;
  },

  wrap(html, animation, globalEnabled) {
    if (!this.isEffectivelyEnabled(animation, globalEnabled)) return html;
    const rootMatch = html.match(/^<(section|footer|nav)\b/);
    if (!rootMatch) return html;
    const distance = animation.distance !== undefined ? animation.distance : 36;
    const animStyle = `--wb-anim-duration:${animation.duration}ms;--wb-anim-delay:${animation.delay}ms;--wb-anim-distance:${distance}px;`;
    const openTagEnd = html.indexOf('>') + 1;
    let openTag = html.slice(0, openTagEnd);
    const rest = html.slice(openTagEnd);
    if (/\sstyle="/.test(openTag)) {
      openTag = openTag.replace(/\sstyle="([^"]*)"/, (m, existing) => ` style="${animStyle}${existing.replace(/;?$/, ';')}"`);
    } else {
      openTag = openTag.replace(/>$/, ` style="${animStyle}">`);
    }
    openTag = openTag.replace(/^<(section|footer|nav)\b/, `<$1 data-wb-animate="${animation.type}"`);
    return openTag + rest;
  },

  buildCss() {
    return `
[data-wb-animate]{opacity:0;}
[data-wb-animate].wb-in-view{animation-duration:var(--wb-anim-duration,800ms);animation-delay:var(--wb-anim-delay,0ms);animation-fill-mode:both;animation-timing-function:cubic-bezier(.16,.84,.44,1);}
[data-wb-animate="fade-up"].wb-in-view{animation-name:wb-anim-fade-up;}
[data-wb-animate="fade-down"].wb-in-view{animation-name:wb-anim-fade-down;}
[data-wb-animate="fade-left"].wb-in-view{animation-name:wb-anim-fade-left;}
[data-wb-animate="fade-right"].wb-in-view{animation-name:wb-anim-fade-right;}
[data-wb-animate="zoom-in"].wb-in-view{animation-name:wb-anim-zoom-in;}
[data-wb-animate="scale-up"].wb-in-view{animation-name:wb-anim-scale-up;}
@keyframes wb-anim-fade-up{from{opacity:0;transform:translateY(var(--wb-anim-distance,36px));}to{opacity:1;transform:translateY(0);}}
@keyframes wb-anim-fade-down{from{opacity:0;transform:translateY(calc(var(--wb-anim-distance,36px) * -1));}to{opacity:1;transform:translateY(0);}}
@keyframes wb-anim-fade-left{from{opacity:0;transform:translateX(var(--wb-anim-distance,36px));}to{opacity:1;transform:translateX(0);}}
@keyframes wb-anim-fade-right{from{opacity:0;transform:translateX(calc(var(--wb-anim-distance,36px) * -1));}to{opacity:1;transform:translateX(0);}}
@keyframes wb-anim-zoom-in{from{opacity:0;transform:scale(.85);}to{opacity:1;transform:scale(1);}}
@keyframes wb-anim-scale-up{from{opacity:0;transform:translateY(calc(var(--wb-anim-distance,36px) * .4)) scale(.94);}to{opacity:1;transform:translateY(0) scale(1);}}
@media(prefers-reduced-motion:reduce){[data-wb-animate]{opacity:1!important;animation:none!important;transform:none!important;}}`;
  },

  buildJs() {
    return `(function(){
var targets=document.querySelectorAll('[data-wb-animate]');
if(!targets.length)return;
var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduced){targets.forEach(function(el){el.classList.add('wb-in-view');});return;}
if(!('IntersectionObserver' in window)){targets.forEach(function(el){el.classList.add('wb-in-view');});return;}
var obs=new IntersectionObserver(function(entries){
  entries.forEach(function(e){e.target.classList.toggle('wb-in-view',e.isIntersecting);});
},{threshold:0.15});
targets.forEach(function(el){obs.observe(el);});
})();`;
  },
};
window.Animations = Animations;
