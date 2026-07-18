/**
 * menu-builder.js — Menu mode: customize the navbar.
 * Starts auto-synced to visible sections (same as the default navbar). The moment the user adds
 * a custom link/dropdown or reorders anything, menu.customized flips true and Exporter.buildNavbar
 * uses this structure instead of the auto-generated one.
 */
const MenuBuilder = {
  markCustomized() { Builder.project.menu.customized = true; },

  /** Section-based options a "Page link" item can point to (single-page site: anchors to sections). */
  sectionOptionsHtml(selectedId) {
    const navSections = Builder.project.sections.filter(s => s.visible !== false && !NAV_EXCLUDE.has(s.type));
    return navSections.map(s => {
      const def = SectionRegistry[s.type];
      const label = s.navLabel || s.heading || s.companyName || def.meta.name;
      return `<option value="${s.id}" ${s.id === selectedId ? 'selected' : ''}>${escapeHtml(label)}</option>`;
    }).join('');
  },

  render() {
    const menu = Builder.project.menu;
    const mainEl = document.getElementById('menu-main');
    mainEl.innerHTML = `
      <h2 style="margin-top:0;">Menu</h2>
      <div class="wb-mode-empty" style="margin-bottom:16px;">Starts synced to your visible sections automatically. The moment you add a custom link or dropdown, or reorder anything here, it stops auto-syncing and becomes your permanent nav structure.</div>

      <div class="wb-mode-section">
        <div class="wb-toggle-row"><input type="checkbox" id="wb-menu-sticky" ${menu.sticky ? 'checked' : ''}> Sticky header (stays pinned to the top while scrolling)</div>
        <div class="wb-toggle-row"><input type="checkbox" id="wb-menu-transparent" ${menu.transparent ? 'checked' : ''}> Transparent header (overlays the page — looks best when the first section is a dark Hero)</div>
      </div>

      <div class="wb-mode-section">
        <h4>Menu items</h4>
        <div id="wb-menu-items-list"></div>
        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
          <button class="wb-btn-line" id="wb-menu-add-section" style="width:auto;">+ Section link</button>
          <button class="wb-btn-line" id="wb-menu-add-link" style="width:auto;">+ Custom link</button>
          <button class="wb-btn-line" id="wb-menu-add-dropdown" style="width:auto;">+ Dropdown</button>
        </div>
      </div>`;

    document.getElementById('wb-menu-sticky').addEventListener('change', e => {
      Builder.history.snapshotCommand('Toggle Sticky Header', () => Builder.project.menu, (s) => { Builder.project.menu = s; },
        () => { menu.sticky = e.target.checked; this.markCustomized(); });
    });
    document.getElementById('wb-menu-transparent').addEventListener('change', e => {
      Builder.history.snapshotCommand('Toggle Transparent Header', () => Builder.project.menu, (s) => { Builder.project.menu = s; },
        () => { menu.transparent = e.target.checked; this.markCustomized(); });
    });
    document.getElementById('wb-menu-add-section').addEventListener('click', () => {
      const navSections = Builder.project.sections.filter(s => s.visible !== false && !NAV_EXCLUDE.has(s.type));
      if (!navSections.length) { UI.toast('No linkable sections on the canvas yet.', true); return; }
      const first = navSections[0];
      const def = SectionRegistry[first.type];
      Builder.history.snapshotCommand('Add Menu Item', () => Builder.project.menu, (s) => { Builder.project.menu = s; },
        () => { menu.items.push({ id: uid('mi'), label: first.navLabel || first.heading || first.companyName || def.meta.name, type: 'section', sectionId: first.id, url: '', children: [] }); this.markCustomized(); });
      this.render();
    });
    document.getElementById('wb-menu-add-link').addEventListener('click', () => {
      Builder.history.snapshotCommand('Add Menu Item', () => Builder.project.menu, (s) => { Builder.project.menu = s; },
        () => { menu.items.push({ id: uid('mi'), label: 'New Link', type: 'link', sectionId: '', url: 'https://', children: [] }); this.markCustomized(); });
      this.render();
    });
    document.getElementById('wb-menu-add-dropdown').addEventListener('click', () => {
      Builder.history.snapshotCommand('Add Menu Dropdown', () => Builder.project.menu, (s) => { Builder.project.menu = s; },
        () => { menu.items.push({ id: uid('mi'), label: 'New Dropdown', type: 'dropdown', sectionId: '', url: '', children: [] }); this.markCustomized(); });
      this.render();
    });

    this.renderItemsList();
  },

  renderItemsList() {
    const menu = Builder.project.menu;
    const wrap = document.getElementById('wb-menu-items-list');
    if (!menu.items.length) {
      wrap.innerHTML = '<div class="wb-mode-empty">No menu items. Add a section link, custom link, or dropdown above.</div>';
      return;
    }
    wrap.innerHTML = menu.items.map((item, idx) => {
      const typeSelect = `<select class="mi-type">
        <option value="section" ${item.type === 'section' ? 'selected' : ''}>Section</option>
        <option value="link" ${item.type === 'link' ? 'selected' : ''}>Custom link</option>
        <option value="dropdown" ${item.type === 'dropdown' ? 'selected' : ''}>Dropdown</option>
      </select>`;
      let targetInput = '';
      if (item.type === 'section') targetInput = `<select class="mi-section">${this.sectionOptionsHtml(item.sectionId)}</select>`;
      else if (item.type === 'link') targetInput = `<input type="text" class="mi-url" value="${escapeHtml(item.url)}" placeholder="https://...">`;

      const childrenHtml = item.type === 'dropdown' ? `
        <div class="wb-menu-children">
          ${item.children.map(c => `
            <div class="wb-menu-child-row" data-cid="${c.id}">
              <input type="text" class="mc-label" value="${escapeHtml(c.label)}" style="width:110px;">
              <select class="mc-type">
                <option value="section" ${c.type === 'section' ? 'selected' : ''}>Section</option>
                <option value="link" ${c.type === 'link' ? 'selected' : ''}>Link</option>
              </select>
              ${c.type === 'section' ? `<select class="mc-section">${this.sectionOptionsHtml(c.sectionId)}</select>` : `<input type="text" class="mc-url" value="${escapeHtml(c.url)}" placeholder="https://...">`}
              <button class="mc-del" type="button">✕</button>
            </div>`).join('')}
          <button class="wb-btn-line mi-add-child" type="button" style="width:auto;font-size:.68rem;">+ Add dropdown item</button>
        </div>` : '';

      return `<div class="wb-menu-item-row" data-id="${item.id}" draggable="true">
        <div class="wb-menu-item-head">
          <span class="wb-menu-drag-handle" title="Drag to reorder">⠿</span>
          <button type="button" class="mi-up" title="Move up" ${idx === 0 ? 'disabled' : ''}>↑</button>
          <button type="button" class="mi-down" title="Move down" ${idx === menu.items.length - 1 ? 'disabled' : ''}>↓</button>
          <input type="text" class="mi-label" value="${escapeHtml(item.label)}">
          ${typeSelect}
          ${item.type !== 'dropdown' ? targetInput : ''}
          <button type="button" class="mi-del" title="Delete">✕</button>
        </div>
        ${childrenHtml}
      </div>`;
    }).join('');

    let draggedId = null;
    wrap.querySelectorAll('.wb-menu-item-row').forEach(row => {
      row.addEventListener('dragstart', (e) => {
        draggedId = row.dataset.id;
        row.classList.add('wb-menu-dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      row.addEventListener('dragend', () => {
        row.classList.remove('wb-menu-dragging');
        wrap.querySelectorAll('.wb-menu-item-row').forEach(r => r.classList.remove('wb-menu-drop-before', 'wb-menu-drop-after'));
        draggedId = null;
      });
      row.addEventListener('dragover', (e) => {
        e.preventDefault();
        wrap.querySelectorAll('.wb-menu-item-row').forEach(r => r.classList.remove('wb-menu-drop-before', 'wb-menu-drop-after'));
        if (!draggedId || row.dataset.id === draggedId) return;
        const rect = row.getBoundingClientRect();
        row.classList.add((e.clientY - rect.top) < rect.height / 2 ? 'wb-menu-drop-before' : 'wb-menu-drop-after');
      });
      row.addEventListener('drop', (e) => {
        e.preventDefault();
        wrap.querySelectorAll('.wb-menu-item-row').forEach(r => r.classList.remove('wb-menu-drop-before', 'wb-menu-drop-after'));
        if (!draggedId || row.dataset.id === draggedId) return;
        const rect = row.getBoundingClientRect();
        const before = (e.clientY - rect.top) < rect.height / 2;
        let fi = menu.items.findIndex(x => x.id === draggedId);
        let ti = menu.items.findIndex(x => x.id === row.dataset.id);
        if (!before) ti += 1;
        if (fi < ti) ti -= 1;
        Builder.history.snapshotCommand('Reorder Menu', () => Builder.project.menu, (s) => { Builder.project.menu = s; },
          () => { const [moved] = menu.items.splice(fi, 1); menu.items.splice(ti, 0, moved); this.markCustomized(); });
        this.renderItemsList();
      });
    });

    wrap.querySelectorAll('.wb-menu-item-row').forEach(row => {
      const id = row.dataset.id;
      const item = menu.items.find(x => x.id === id);
      row.querySelector('.mi-label').addEventListener('change', e => {
        Builder.history.snapshotCommand('Rename Menu Item', () => Builder.project.menu, (s) => { Builder.project.menu = s; }, () => { item.label = e.target.value; this.markCustomized(); });
      });
      row.querySelector('.mi-type').addEventListener('change', e => {
        Builder.history.snapshotCommand('Change Menu Item Type', () => Builder.project.menu, (s) => { Builder.project.menu = s; }, () => { item.type = e.target.value; this.markCustomized(); });
        this.renderItemsList();
      });
      const secSel = row.querySelector('.mi-section');
      if (secSel) secSel.addEventListener('change', e => {
        Builder.history.snapshotCommand('Set Menu Target', () => Builder.project.menu, (s) => { Builder.project.menu = s; }, () => { item.sectionId = e.target.value; this.markCustomized(); });
      });
      const urlInp = row.querySelector('.mi-url');
      if (urlInp) urlInp.addEventListener('change', e => {
        Builder.history.snapshotCommand('Set Menu URL', () => Builder.project.menu, (s) => { Builder.project.menu = s; }, () => { item.url = e.target.value; this.markCustomized(); });
      });

      row.querySelector('.mi-up').addEventListener('click', () => {
        const i = menu.items.indexOf(item);
        if (i > 0) {
          Builder.history.snapshotCommand('Reorder Menu', () => Builder.project.menu, (s) => { Builder.project.menu = s; },
            () => { [menu.items[i - 1], menu.items[i]] = [menu.items[i], menu.items[i - 1]]; this.markCustomized(); });
          this.renderItemsList();
        }
      });
      row.querySelector('.mi-down').addEventListener('click', () => {
        const i = menu.items.indexOf(item);
        if (i < menu.items.length - 1) {
          Builder.history.snapshotCommand('Reorder Menu', () => Builder.project.menu, (s) => { Builder.project.menu = s; },
            () => { [menu.items[i + 1], menu.items[i]] = [menu.items[i], menu.items[i + 1]]; this.markCustomized(); });
          this.renderItemsList();
        }
      });
      row.querySelector('.mi-del').addEventListener('click', () => {
        Builder.history.snapshotCommand('Delete Menu Item', () => Builder.project.menu, (s) => { Builder.project.menu = s; },
          () => { menu.items = menu.items.filter(x => x.id !== id); this.markCustomized(); });
        this.renderItemsList();
      });

      const addChildBtn = row.querySelector('.mi-add-child');
      if (addChildBtn) addChildBtn.addEventListener('click', () => {
        const navSections = Builder.project.sections.filter(s => s.visible !== false && !NAV_EXCLUDE.has(s.type));
        Builder.history.snapshotCommand('Add Dropdown Item', () => Builder.project.menu, (s) => { Builder.project.menu = s; },
          () => { item.children.push({ id: uid('mc'), label: 'Item', type: 'section', sectionId: (navSections[0] || {}).id || '', url: '' }); this.markCustomized(); });
        this.renderItemsList();
      });
      row.querySelectorAll('.wb-menu-child-row').forEach(crow => {
        const cid = crow.dataset.cid;
        const child = item.children.find(x => x.id === cid);
        crow.querySelector('.mc-label').addEventListener('change', e => {
          Builder.history.snapshotCommand('Rename Dropdown Item', () => Builder.project.menu, (s) => { Builder.project.menu = s; }, () => { child.label = e.target.value; this.markCustomized(); });
        });
        crow.querySelector('.mc-type').addEventListener('change', e => {
          Builder.history.snapshotCommand('Change Dropdown Item Type', () => Builder.project.menu, (s) => { Builder.project.menu = s; }, () => { child.type = e.target.value; this.markCustomized(); });
          this.renderItemsList();
        });
        const cs = crow.querySelector('.mc-section');
        if (cs) cs.addEventListener('change', e => {
          Builder.history.snapshotCommand('Set Dropdown Target', () => Builder.project.menu, (s) => { Builder.project.menu = s; }, () => { child.sectionId = e.target.value; this.markCustomized(); });
        });
        const cu = crow.querySelector('.mc-url');
        if (cu) cu.addEventListener('change', e => {
          Builder.history.snapshotCommand('Set Dropdown URL', () => Builder.project.menu, (s) => { Builder.project.menu = s; }, () => { child.url = e.target.value; this.markCustomized(); });
        });
        crow.querySelector('.mc-del').addEventListener('click', () => {
          Builder.history.snapshotCommand('Delete Dropdown Item', () => Builder.project.menu, (s) => { Builder.project.menu = s; },
            () => { item.children = item.children.filter(x => x.id !== cid); this.markCustomized(); });
          this.renderItemsList();
        });
      });
    });
  },
};
window.MenuBuilder = MenuBuilder;
