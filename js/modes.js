/**
 * modes.js — Switches the workspace between Design and the CMS-style modes
 * (Collections / Forms / Media / Blog / Theme / Menu), each a full-width view
 * that replaces the 3-column Design layout while active.
 */
const Modes = {
  current: 'design',

  init() {
    document.querySelectorAll('.wb-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTo(btn.dataset.mode));
    });
    document.querySelectorAll('.wb-mob-mode-item').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTo(btn.dataset.mode);
        if (window.MobileUI) MobileUI.closeAll();
      });
    });
    const backBtn = document.getElementById('wb-mob-back-to-design');
    if (backBtn) backBtn.addEventListener('click', () => this.switchTo('design'));
  },

  switchTo(mode) {
    this.current = mode;
    document.querySelectorAll('.wb-mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    document.querySelectorAll('.wb-mob-mode-item').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    document.getElementById('wb-main').classList.toggle('active', mode === 'design');
    document.getElementById('wb-main').style.display = mode === 'design' ? '' : 'none';
    ['collections', 'forms', 'media', 'blog', 'theme', 'menu'].forEach(m => {
      const el = document.getElementById('mode-' + m);
      if (el) el.classList.toggle('active', mode === m);
    });

    if (window.MobileUI && MobileUI.isMobile()) {
      const tabbar = document.getElementById('wb-mobile-tabbar');
      const backBtn = document.getElementById('wb-mob-back-to-design');
      if (tabbar) tabbar.style.display = mode === 'design' ? '' : 'none';
      if (backBtn) backBtn.style.display = mode === 'design' ? 'none' : '';
    }

    if (mode === 'collections') Collections.render();
    else if (mode === 'forms') Forms.render();
    else if (mode === 'media') MediaLibrary.render();
    else if (mode === 'blog') BlogEngine.render();
    else if (mode === 'theme') ThemeView.render();
    else if (mode === 'menu') MenuBuilder.render();
  },
};
window.Modes = Modes;
