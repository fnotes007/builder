/**
 * collections.js — CMS Engine: custom collections (Products, Team, Properties, etc.)
 * Data lives at Builder.project.collections (schemas) and Builder.project.collectionItems (data).
 */
const FIELD_TYPES = ['text', 'textarea', 'image', 'number', 'boolean', 'date'];

const Collections = {
  activeId: null,
  editingItemId: null,

  init() {
    document.getElementById('col-new-btn').addEventListener('click', () => this.newCollection());
  },

  newCollection() {
    const name = prompt('Collection name (e.g. "Products", "Team", "Properties"):');
    if (!name || !name.trim()) return;
    const col = {
      id: uid('col'), name: name.trim(), slug: Exporter.slugify(name),
      fields: [
        { id: uid('field'), name: 'Title', type: 'text' },
        { id: uid('field'), name: 'Description', type: 'textarea' },
        { id: uid('field'), name: 'Image', type: 'image' },
      ],
    };
    Builder.history.snapshotCommand('New Collection',
      () => Builder.project.collections,
      (s) => { Builder.project.collections = s; },
      () => { Builder.project.collections.push(col); Builder.project.collectionItems[col.id] = []; });
    this.activeId = col.id;
    this.render();
  },

  render() {
    const cols = Builder.project.collections;
    const listEl = document.getElementById('col-list-items');
    listEl.innerHTML = cols.map(c => {
      const items = Builder.project.collectionItems[c.id] || [];
      return `<div class="wb-col-item ${c.id === this.activeId ? 'active' : ''}" data-id="${c.id}">
        <div>${escapeHtml(c.name)}</div>
        <div class="cnt">${items.length} item${items.length === 1 ? '' : 's'} · ${c.fields.length} field${c.fields.length === 1 ? '' : 's'}</div>
      </div>`;
    }).join('');
    listEl.querySelectorAll('.wb-col-item').forEach(el => {
      el.addEventListener('click', () => { this.activeId = el.dataset.id; this.editingItemId = null; this.render(); });
    });

    const mainEl = document.getElementById('col-main');
    if (!cols.length) {
      mainEl.innerHTML = `<div class="wb-mode-empty">
        <p><b>No collections yet.</b></p>
        <p style="margin-top:8px;">Collections are custom, structured content types — Products, Team Members, Properties, Events, anything with repeating fields. Click <b>+ New Collection</b> to define your first one, then drag a <b>Collection Grid</b> section onto the canvas in Design mode to display it.</p>
      </div>`;
      return;
    }
    if (!this.activeId || !cols.find(c => c.id === this.activeId)) this.activeId = cols[0].id;
    this.renderMain();
  },

  renderMain() {
    const col = Builder.project.collections.find(c => c.id === this.activeId);
    if (!col) return;
    const items = Builder.project.collectionItems[col.id] || [];
    const mainEl = document.getElementById('col-main');
    mainEl.innerHTML = `
      <h2>${escapeHtml(col.name)}</h2>
      <div class="wb-mode-sub">Slug: ${escapeHtml(col.slug)} · reference this collection from a Collection Grid section in Design mode</div>
      <div class="wb-mode-section">
        <h4>Fields</h4>
        <div id="wb-fields-list"></div>
        <button class="wb-btn-line" id="add-field-btn">+ Add field</button>
      </div>
      <div class="wb-mode-section">
        <h4>Items (${items.length})</h4>
        <table class="wb-items-table">
          <thead><tr>${col.fields.map(f => `<th>${escapeHtml(f.name)}</th>`).join('')}<th></th></tr></thead>
          <tbody id="wb-items-tbody"></tbody>
        </table>
        <button class="wb-btn-line" id="add-item-btn" style="margin-top:10px;">+ Add item</button>
        <div class="wb-item-form" id="wb-item-form"></div>
      </div>`;
    this.renderFieldsList(col);
    this.renderItemsTable(col);
    document.getElementById('add-field-btn').addEventListener('click', () => {
      Builder.history.snapshotCommand('Add Field',
        () => Builder.project.collections, (s) => { Builder.project.collections = s; },
        () => { col.fields.push({ id: uid('field'), name: 'New Field', type: 'text' }); });
      this.renderMain(); this.render();
    });
    document.getElementById('add-item-btn').addEventListener('click', () => { this.editingItemId = null; this.showItemForm(col); });
  },

  renderFieldsList(col) {
    const wrap = document.getElementById('wb-fields-list');
    wrap.innerHTML = col.fields.map(f => `
      <div class="wb-field-row" data-fid="${f.id}">
        <input type="text" class="fname" value="${escapeHtml(f.name)}">
        <select class="ftype">${FIELD_TYPES.map(t => `<option value="${t}" ${t === f.type ? 'selected' : ''}>${t}</option>`).join('')}</select>
        <button class="wb-field-del" title="Delete field">✕</button>
      </div>`).join('');
    wrap.querySelectorAll('.wb-field-row').forEach(row => {
      const fid = row.dataset.fid;
      const field = col.fields.find(f => f.id === fid);
      row.querySelector('.fname').addEventListener('change', e => {
        Builder.history.snapshotCommand('Rename Field', () => Builder.project.collections, (s) => { Builder.project.collections = s; },
          () => { field.name = e.target.value || field.name; });
        this.renderMain();
      });
      row.querySelector('.ftype').addEventListener('change', e => {
        Builder.history.snapshotCommand('Change Field Type', () => Builder.project.collections, (s) => { Builder.project.collections = s; },
          () => { field.type = e.target.value; });
        this.renderMain();
      });
      row.querySelector('.wb-field-del').addEventListener('click', () => {
        if (col.fields.length <= 1) { UI.toast('A collection needs at least one field.', true); return; }
        if (!confirm(`Delete field "${field.name}"? This removes its data from all items.`)) return;
        Builder.history.snapshotCommand('Delete Field',
          () => ({ collections: Builder.project.collections, items: Builder.project.collectionItems }),
          (s) => { Builder.project.collections = s.collections; Builder.project.collectionItems = s.items; },
          () => {
            col.fields = col.fields.filter(f => f.id !== fid);
            (Builder.project.collectionItems[col.id] || []).forEach(it => { delete it.data[fid]; });
          });
        this.renderMain(); this.render();
      });
    });
  },

  renderItemsTable(col) {
    const tbody = document.getElementById('wb-items-tbody');
    const rows = Builder.project.collectionItems[col.id] || [];
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="${col.fields.length + 1}" style="color:var(--text-3);">No items yet.</td></tr>`;
      return;
    }
    tbody.innerHTML = rows.map(it => `
      <tr data-iid="${it.id}">
        ${col.fields.map(f => `<td>${escapeHtml(String(it.data[f.id] || ''))}</td>`).join('')}
        <td class="row-actions">
          <button class="iedit" title="Edit">✎</button>
          <button class="idel" title="Delete">✕</button>
        </td>
      </tr>`).join('');
    tbody.querySelectorAll('tr').forEach(tr => {
      const iid = tr.dataset.iid;
      tr.querySelector('.iedit').addEventListener('click', () => { this.editingItemId = iid; this.showItemForm(col); });
      tr.querySelector('.idel').addEventListener('click', () => {
        if (!confirm('Delete this item?')) return;
        Builder.history.snapshotCommand('Delete Item', () => Builder.project.collectionItems, (s) => { Builder.project.collectionItems = s; },
          () => { Builder.project.collectionItems[col.id] = Builder.project.collectionItems[col.id].filter(x => x.id !== iid); });
        this.renderMain(); this.render();
      });
    });
  },

  showItemForm(col) {
    const form = document.getElementById('wb-item-form');
    const editing = this.editingItemId ? (Builder.project.collectionItems[col.id] || []).find(x => x.id === this.editingItemId) : null;
    const data = editing ? editing.data : {};
    form.classList.add('open');
    form.innerHTML = col.fields.map(f => {
      const val = data[f.id] || '';
      const inputEl = f.type === 'textarea'
        ? `<textarea rows="3" data-fid="${f.id}">${escapeHtml(val)}</textarea>`
        : `<input type="${f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}" data-fid="${f.id}" value="${escapeHtml(val)}" placeholder="${f.type === 'image' ? 'Image URL, or pick from Media' : ''}">`;
      const pickBtn = f.type === 'image' ? `<button type="button" class="wb-btn-line" data-pick-for="${f.id}" style="margin-top:6px;">Pick from Media Library</button>` : '';
      return `<div class="wb-field"><label>${escapeHtml(f.name)}</label>${inputEl}${pickBtn}</div>`;
    }).join('') + `
      <div style="display:flex;gap:8px;margin-top:6px;">
        <button class="wb-btn-primary-lg" id="item-save-btn">${editing ? 'Save changes' : 'Add item'}</button>
        <button class="wb-btn-line" id="item-cancel-btn" style="width:auto;">Cancel</button>
      </div>`;

    form.querySelectorAll('[data-pick-for]').forEach(btn => {
      btn.addEventListener('click', () => {
        const assets = Builder.project.assets || [];
        if (!assets.length) { UI.toast('No media yet — upload one in the Media tab first.', true); return; }
        MediaLibrary.openPicker((url) => {
          const input = form.querySelector(`[data-fid="${btn.dataset.pickFor}"]`);
          if (input) input.value = url;
        });
      });
    });

    document.getElementById('item-cancel-btn').addEventListener('click', () => {
      this.editingItemId = null; form.classList.remove('open'); form.innerHTML = '';
    });
    document.getElementById('item-save-btn').addEventListener('click', () => {
      const newData = {};
      form.querySelectorAll('[data-fid]').forEach(el => { newData[el.dataset.fid] = el.value; });
      Builder.history.snapshotCommand('Save Item', () => Builder.project.collectionItems, (s) => { Builder.project.collectionItems = s; },
        () => {
          if (editing) { editing.data = newData; }
          else {
            if (!Builder.project.collectionItems[col.id]) Builder.project.collectionItems[col.id] = [];
            Builder.project.collectionItems[col.id].push({ id: uid('item'), data: newData });
          }
        });
      this.editingItemId = null; form.classList.remove('open'); form.innerHTML = '';
      this.renderMain(); this.render();
      UI.toast('Saved.', 'success');
    });
  },
};
window.Collections = Collections;
