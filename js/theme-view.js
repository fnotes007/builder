/**
 * theme-view.js — Theme mode: one-click presets + shape/layout tokens + site-wide settings.
 * Color/font pickers already live in the right-sidebar Theme tab (Editor.renderThemePanel) —
 * this view adds the NEW capabilities: presets, corner radius, content width, and site settings
 * (favicon lives in the SEO tab; siteUrl / back-to-top / WhatsApp / Call live in siteSettings).
 */
const THEME_PRESETS = [
  { name: 'Ocean', primary: '#2563eb', secondary: '#0f172a', accent: '#f59e0b', radius: 14, fontHeading: 'Poppins', fontBody: 'Inter', mode: 'light' },
  { name: 'Forest', primary: '#16a34a', secondary: '#14532d', accent: '#f97316', radius: 10, fontHeading: 'Montserrat', fontBody: 'Open Sans', mode: 'light' },
  { name: 'Sunset', primary: '#ea580c', secondary: '#7c2d12', accent: '#facc15', radius: 20, fontHeading: 'Raleway', fontBody: 'Nunito', mode: 'light' },
  { name: 'Rose', primary: '#e11d48', secondary: '#4c0519', accent: '#fb7185', radius: 18, fontHeading: 'Playfair Display', fontBody: 'Lato', mode: 'light' },
  { name: 'Slate', primary: '#475569', secondary: '#0f172a', accent: '#38bdf8', radius: 6, fontHeading: 'Oswald', fontBody: 'Roboto', mode: 'light' },
  { name: 'Midnight', primary: '#6366f1', secondary: '#c7d2fe', accent: '#f59e0b', radius: 14, fontHeading: 'Poppins', fontBody: 'Inter', mode: 'dark' },
];

const ThemeView = {
  render() {
    const t = Builder.project.theme;
    const ss = Builder.project.siteSettings;
    const mainEl = document.getElementById('theme-main');
    mainEl.innerHTML = `
      <h2 style="margin-top:0;">Theme</h2>
      <div class="wb-mode-empty" style="margin-bottom:18px;">One-click presets, plus shape and site-wide settings. Fine-grained colors, mode, and fonts stay in the right-hand Theme tab in Design mode — presets here just set all of it at once.</div>

      <div class="wb-mode-section">
        <h4>Presets</h4>
        <div class="wb-theme-presets" id="wb-theme-presets"></div>
      </div>

      <div class="wb-mode-section">
        <h4>Shape &amp; layout</h4>
        <div class="wb-field">
          <label>Corner radius <span id="wb-radius-val">${t.radius}px</span></label>
          <input type="range" id="wb-th-radius" min="0" max="24" value="${t.radius}" style="width:100%;">
        </div>
        <div class="wb-field">
          <label>Content width <span id="wb-container-val">${t.container}px</span></label>
          <input type="range" id="wb-th-container" min="960" max="1400" step="20" value="${t.container}" style="width:100%;">
        </div>
      </div>

      <div class="wb-mode-section">
        <h4>Site settings</h4>
        <div class="wb-field">
          <label>Site URL (used for sitemap.xml — set this once you have a real domain)</label>
          <input type="text" id="wb-site-url" value="${escapeHtml(ss.siteUrl)}" placeholder="https://example.com">
        </div>
      </div>

      <div class="wb-mode-section">
        <h4>Floating widgets</h4>
        <div class="wb-toggle-row"><input type="checkbox" id="wb-site-backtotop" ${ss.backToTop ? 'checked' : ''}> Back-to-top button (appears after scrolling down)</div>
        <div class="wb-toggle-row"><input type="checkbox" id="wb-site-whatsapp" ${ss.whatsappEnabled ? 'checked' : ''}> Floating WhatsApp button</div>
        <div class="wb-field" id="wb-whatsapp-number-field" style="${ss.whatsappEnabled ? '' : 'display:none;'}margin-left:24px;">
          <label>WhatsApp number (with country code, digits only)</label>
          <input type="text" id="wb-site-whatsapp-number" value="${escapeHtml(ss.whatsappNumber)}" placeholder="919876543210">
        </div>
        <div class="wb-toggle-row"><input type="checkbox" id="wb-site-call" ${ss.callEnabled ? 'checked' : ''}> Floating Call button</div>
        <div class="wb-field" id="wb-call-number-field" style="${ss.callEnabled ? '' : 'display:none;'}margin-left:24px;">
          <label>Phone number (as it should be dialed)</label>
          <input type="text" id="wb-site-call-number" value="${escapeHtml(ss.callNumber)}" placeholder="+919876543210">
        </div>
      </div>

      <div class="wb-mode-section">
        <h4>Scroll Reveal Animations</h4>
        <div class="wb-mode-empty" style="margin-bottom:10px;">Elements fade/slide into view as visitors scroll down the page. Configure the animation type, duration, delay, and distance per-section in Design mode's Inspector — this is the master switch for the whole site.</div>
        <div class="wb-toggle-row"><input type="checkbox" id="wb-scrollanim-enabled" ${ss.scrollAnimEnabled!==false ? 'checked' : ''}> Enable scroll reveal animations site-wide</div>
        <div class="wb-mode-empty" style="margin-top:8px;">Individual sections can still be forced on or off regardless of this setting via their own "Animation" dropdown (Inherit Global / Enabled / Disabled) in the Scroll Animation panel. Automatically disabled for visitors with "reduce motion" turned on.</div>
      </div>

      <div class="wb-mode-section">
        <h4>Background Animations</h4>
        <div class="wb-mode-empty" style="margin-bottom:10px;">Controls how heavy the animated section backgrounds (set per-section in Design mode) are allowed to get. Applies site-wide to every visitor.</div>
        <div class="wb-field">
          <label>Quality</label>
          <select id="wb-anim-quality">
            <option value="low" ${ss.animQuality==='low'?'selected':''}>Low — CSS-only, no particles, best battery life</option>
            <option value="medium" ${ss.animQuality==='medium'?'selected':''}>Medium — light particle counts, reduced blur</option>
            <option value="high" ${ss.animQuality==='high'?'selected':''}>High — full effects (default)</option>
            <option value="ultra" ${ss.animQuality==='ultra'?'selected':''}>Ultra — maximum particle counts</option>
          </select>
        </div>
        <div class="wb-toggle-row"><input type="checkbox" id="wb-anim-autodetect" ${ss.animAutoDetect ? 'checked' : ''}> Auto-detect low-end devices and reduce quality automatically for them</div>
        <div class="wb-toggle-row"><input type="checkbox" id="wb-anim-allowdisable" ${ss.animAllowDisable ? 'checked' : ''}> Show visitors a button to turn animations off entirely</div>
        <div class="wb-mode-empty" style="margin-top:8px;">Always on regardless of these settings: animations pause when a visitor's browser tab is in the background, and simplify automatically for anyone with "reduce motion" turned on in their device's accessibility settings.</div>
      </div>`;

    document.getElementById('wb-theme-presets').innerHTML = THEME_PRESETS.map((p, i) => `
      <button type="button" class="wb-theme-preset-btn" data-i="${i}">
        <div class="wb-theme-preset-swatch" style="background:${p.primary};"></div>
        <div class="tpname">${escapeHtml(p.name)}</div>
      </button>`).join('');
    document.querySelectorAll('.wb-theme-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = THEME_PRESETS[+btn.dataset.i];
        Builder.history.snapshotCommand('Apply Theme Preset', () => Builder.project.theme, (s) => { Builder.project.theme = s; },
          () => { Object.assign(t, { primary: p.primary, secondary: p.secondary, accent: p.accent, radius: p.radius, fontHeading: p.fontHeading, fontBody: p.fontBody, mode: p.mode }); });
        Builder.applyThemeVars();
        this.render();
        if (typeof Editor !== 'undefined') Editor.renderThemePanel();
        UI.toast(`"${p.name}" preset applied.`, 'success');
      });
    });

    document.getElementById('wb-th-radius').addEventListener('input', e => {
      t.radius = +e.target.value;
      document.getElementById('wb-radius-val').textContent = t.radius + 'px';
      Builder.applyThemeVars();
    });
    document.getElementById('wb-th-radius').addEventListener('change', e => {
      Builder.history.snapshotCommand('Set Corner Radius', () => Builder.project.theme, (s) => { Builder.project.theme = s; }, () => { t.radius = +e.target.value; });
    });
    document.getElementById('wb-th-container').addEventListener('input', e => {
      t.container = +e.target.value;
      document.getElementById('wb-container-val').textContent = t.container + 'px';
      Builder.applyThemeVars();
    });
    document.getElementById('wb-th-container').addEventListener('change', e => {
      Builder.history.snapshotCommand('Set Content Width', () => Builder.project.theme, (s) => { Builder.project.theme = s; }, () => { t.container = +e.target.value; });
    });

    document.getElementById('wb-site-url').addEventListener('change', e => {
      Builder.history.snapshotCommand('Set Site URL', () => Builder.project.siteSettings, (s) => { Builder.project.siteSettings = s; },
        () => { ss.siteUrl = e.target.value.trim().replace(/\/$/, ''); });
    });
    document.getElementById('wb-site-backtotop').addEventListener('change', e => {
      Builder.history.snapshotCommand('Toggle Back To Top', () => Builder.project.siteSettings, (s) => { Builder.project.siteSettings = s; },
        () => { ss.backToTop = e.target.checked; });
    });
    document.getElementById('wb-site-whatsapp').addEventListener('change', e => {
      Builder.history.snapshotCommand('Toggle WhatsApp Button', () => Builder.project.siteSettings, (s) => { Builder.project.siteSettings = s; },
        () => { ss.whatsappEnabled = e.target.checked; });
      document.getElementById('wb-whatsapp-number-field').style.display = e.target.checked ? '' : 'none';
    });
    document.getElementById('wb-site-whatsapp-number').addEventListener('change', e => {
      Builder.history.snapshotCommand('Set WhatsApp Number', () => Builder.project.siteSettings, (s) => { Builder.project.siteSettings = s; },
        () => { ss.whatsappNumber = e.target.value.replace(/[^0-9]/g, ''); });
    });
    document.getElementById('wb-site-call').addEventListener('change', e => {
      Builder.history.snapshotCommand('Toggle Call Button', () => Builder.project.siteSettings, (s) => { Builder.project.siteSettings = s; },
        () => { ss.callEnabled = e.target.checked; });
      document.getElementById('wb-call-number-field').style.display = e.target.checked ? '' : 'none';
    });
    document.getElementById('wb-site-call-number').addEventListener('change', e => {
      Builder.history.snapshotCommand('Set Call Number', () => Builder.project.siteSettings, (s) => { Builder.project.siteSettings = s; },
        () => { ss.callNumber = e.target.value.trim(); });
    });
    document.getElementById('wb-scrollanim-enabled').addEventListener('change', e => {
      Builder.history.snapshotCommand('Toggle Scroll Animations', () => Builder.project.siteSettings, (s) => { Builder.project.siteSettings = s; },
        () => { ss.scrollAnimEnabled = e.target.checked; });
    });
    document.getElementById('wb-anim-quality').addEventListener('change', e => {
      Builder.history.snapshotCommand('Set Animation Quality', () => Builder.project.siteSettings, (s) => { Builder.project.siteSettings = s; },
        () => { ss.animQuality = e.target.value; });
      Builder.syncBgEffectSettings();
      if (window.BgEffects) { BgEffects.unmountAll(); BgEffects.mountAll(document.getElementById('wb-preview-root')); }
    });
    document.getElementById('wb-anim-autodetect').addEventListener('change', e => {
      Builder.history.snapshotCommand('Toggle Auto-Detect', () => Builder.project.siteSettings, (s) => { Builder.project.siteSettings = s; },
        () => { ss.animAutoDetect = e.target.checked; });
      Builder.syncBgEffectSettings();
      if (window.BgEffects) { BgEffects.unmountAll(); BgEffects.mountAll(document.getElementById('wb-preview-root')); }
    });
    document.getElementById('wb-anim-allowdisable').addEventListener('change', e => {
      Builder.history.snapshotCommand('Toggle Visitor Animation Control', () => Builder.project.siteSettings, (s) => { Builder.project.siteSettings = s; },
        () => { ss.animAllowDisable = e.target.checked; });
    });
  },
};
window.ThemeView = ThemeView;
window.THEME_PRESETS = THEME_PRESETS;
