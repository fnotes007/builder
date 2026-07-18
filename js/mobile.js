/**
 * mobile.js — Mobile UI layer for phones ≤768px
 */
const MobileUI = {
  activeDrawer: null,
  _swipeStartY: 0,
  isMobile() { return window.innerWidth <= 768; },
  init() {
    this.bindTabBar();
    this.bindDrawerCloseButtons();
    this.bindOverlay();
    this.bindSwipeToClose();
    this.bindMobilePreview();
    if (this.isMobile()) this.renderMobileLayerList();
    window.addEventListener('resize', () => {
      if (this.isMobile()) this.renderMobileLayerList();
      else this.closeAll();
    });
  },
  openDrawer(id) {
    this.closeAll();
    const drawer = document.getElementById(id);
    const overlay = document.getElementById('wb-drawer-overlay');
    if (!drawer) return;
    if (id === 'wb-drawer-layers') this.renderMobileLayerList();
    if (id === 'wb-drawer-inspector') this.renderMobileInspector();
    if (id === 'wb-drawer-templates') this.renderMobileTemplates();
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('visible');
    this.activeDrawer = id;
    document.querySelectorAll('.wb-mob-tab').forEach(t => t.classList.toggle('active', t.dataset.drawer === id));
  },
  closeAll() {
    document.querySelectorAll('.wb-drawer').forEach(d => d.classList.remove('open'));
    const ov = document.getElementById('wb-drawer-overlay');
    if (ov) ov.classList.remove('visible');
    document.querySelectorAll('.wb-mob-tab').forEach(t => t.classList.remove('active'));
    this.activeDrawer = null;
  },
  bindTabBar() {
    document.querySelectorAll('.wb-mob-tab[data-drawer]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.activeDrawer === btn.dataset.drawer) this.closeAll();
        else this.openDrawer(btn.dataset.drawer);
      });
    });
  },
  bindDrawerCloseButtons() {
    document.querySelectorAll('[data-close-drawer]').forEach(btn => {
      btn.addEventListener('click', () => this.closeAll());
    });
  },
  bindOverlay() {
    const ov = document.getElementById('wb-drawer-overlay');
    if (ov) ov.addEventListener('click', () => this.closeAll());
  },
  bindSwipeToClose() {
    document.querySelectorAll('.wb-drawer-handle').forEach(handle => {
      const drawer = handle.closest('.wb-drawer');
      if (!drawer) return;
      handle.addEventListener('touchstart', e => { this._swipeStartY = e.touches[0].clientY; }, { passive: true });
      handle.addEventListener('touchend', e => { if (e.changedTouches[0].clientY - this._swipeStartY > 60) this.closeAll(); }, { passive: true });
    });
  },
  bindMobilePreview() {
    const btn = document.getElementById('wb-mob-preview');
    if (btn) btn.addEventListener('click', () => { this.closeAll(); document.getElementById('btn-preview')?.click(); });
  },
  renderMobileLayerList() {
    const container = document.getElementById('wb-mob-layer-list');
    if (!container || !Builder.project) return;
    const sections = Builder.project.sections;
    const selectedId = Builder.project.selectedSectionId;
    container.innerHTML = sections.map((s, idx) => {
      const def = SectionRegistry[s.type]; if (!def) return '';
      const isFirst = idx === 0, isLast = idx === sections.length - 1;
      return `<div class="wb-mob-layer-item${s.id === selectedId ? ' active' : ''}" data-section-id="${s.id}">
        <span class="wb-mob-layer-icon">${def.meta.icon}</span>
        <span class="wb-mob-layer-name">${escapeHtml(s.heading || s.companyName || def.meta.name)}</span>
        <div class="wb-mob-layer-actions">
          <button class="wb-mob-layer-btn" data-mob-action="up" data-index="${idx}" ${isFirst ? 'disabled' : ''}>↑</button>
          <button class="wb-mob-layer-btn" data-mob-action="down" data-index="${idx}" ${isLast ? 'disabled' : ''}>↓</button>
          <button class="wb-mob-layer-btn" data-mob-action="vis" data-id="${s.id}">${s.visible === false ? '🚫' : '👁'}</button>
          <button class="wb-mob-layer-btn danger" data-mob-action="del" data-id="${s.id}">✕</button>
        </div>
      </div>`;
    }).join('');
    container.querySelectorAll('.wb-mob-layer-item').forEach(item => {
      item.addEventListener('click', e => {
        if (e.target.closest('.wb-mob-layer-actions')) return;
        Builder.selectSection(item.dataset.sectionId);
        this.openDrawer('wb-drawer-inspector');
      });
    });
    container.querySelectorAll('[data-mob-action]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const action = btn.dataset.mobAction, idx = parseInt(btn.dataset.index, 10), id = btn.dataset.id;
        if (action === 'up' && idx > 0) { Builder.reorderSection(idx, idx - 1); this.renderMobileLayerList(); }
        else if (action === 'down' && idx < Builder.project.sections.length - 1) { Builder.reorderSection(idx, idx + 1); this.renderMobileLayerList(); }
        else if (action === 'vis') { Builder.toggleVisibility(id); this.renderMobileLayerList(); }
        else if (action === 'del') { if (confirm('Delete this section?')) { Builder.deleteSection(id); this.renderMobileLayerList(); } }
      });
    });
  },
  renderMobileInspector() {
    const body = document.getElementById('wb-mob-inspector-body');
    const titleEl = document.getElementById('wb-mob-inspector-title');
    if (!body || !Builder.project) return;
    const id = Builder.project.selectedSectionId;
    const section = id ? Builder.getSection(id) : null;
    if (!section) {
      if (titleEl) titleEl.textContent = 'Inspector';
      body.innerHTML = '<p style="color:var(--text-3);font-size:.82rem;padding:16px 0;line-height:1.6;">Tap a section on the canvas first, then come back here to edit its properties.</p>';
      return;
    }
    const def = SectionRegistry[section.type];
    if (titleEl) titleEl.textContent = def.meta.icon + ' ' + def.meta.name;
    const fieldsHtml = def.fields.map(f => Editor.renderField(section, f)).join('');
    const animHtml = Editor.renderAnimationFields(section);
    body.innerHTML = `<div class="wb-inspector-fields" style="padding:0;">${fieldsHtml}</div>
<div style="font-size:.66rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--text-3);padding:14px 0 6px;border-top:1px solid var(--border);margin-top:8px;">Animation</div>
<div class="wb-inspector-fields" style="padding:0;">${animHtml}</div>`;
    Editor.bindFieldEvents(body, section);
    Editor.bindAnimationFieldEvents(body, section);
  },
  renderMobileTemplates() {
    const body = document.getElementById('wb-mob-templates-body');
    if (!body || !window.IndustryTemplates) return;
    body.innerHTML = IndustryTemplates.map(tmpl => `
      <div class="wb-template-card">
        <img src="${tmpl.thumbnail}" alt="${escapeHtml(tmpl.name)}" class="wb-template-thumb" loading="lazy">
        <div class="wb-template-info"><strong>${tmpl.icon} ${escapeHtml(tmpl.name)}</strong><p>${escapeHtml(tmpl.description)}</p>
        <button class="wb-tool-btn wb-tool-btn-primary wb-template-load" data-template-id="${tmpl.id}" style="width:100%;justify-content:center;">Use Template</button></div>
      </div>`).join('');
    body.querySelectorAll('.wb-template-load').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('Load this template? Current project will be replaced.')) return;
        const tmpl = IndustryTemplates.find(t => t.id === btn.dataset.templateId);
        if (!tmpl) return;
        const project = tmpl.project(); Importer.backfillProjectDefaults(project);
        Builder.project = project; Builder.history.clear(); Builder.renderAll(); Builder.selectSection(null);
        this.closeAll(); UI.toast('Template loaded!', 'success');
      });
    });
  },
  onRenderAll() { if (!this.isMobile()) return; if (this.activeDrawer === 'wb-drawer-layers') this.renderMobileLayerList(); if (this.activeDrawer === 'wb-drawer-inspector') this.renderMobileInspector(); },
  onSelectSection(id) { if (!this.isMobile() || !id) return; this.openDrawer('wb-drawer-inspector'); },
};
window.MobileUI = MobileUI;
