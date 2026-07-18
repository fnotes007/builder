/**
 * forms.js — Form Builder: define custom field-sets (Contact, Newsletter, Job Application...)
 * Since this is an offline, serverless site builder, a form's "action" is either:
 *   - mailto: opens the visitor's email client with a prefilled message (no backend needed)
 *   - custom: POSTs to an endpoint the user supplies (Formspree, Web3Forms, Google Forms, their own API, etc.)
 */
const FORM_FIELD_TYPES = ['text', 'email', 'tel', 'number', 'textarea', 'dropdown', 'radio', 'checkbox', 'date'];

const Forms = {
  activeId: null,

  init() {
    document.getElementById('form-new-btn').addEventListener('click', () => this.newForm());
  },

  newForm() {
    const name = prompt('Form name (e.g. "Contact", "Newsletter Signup", "Job Application"):');
    if (!name || !name.trim()) return;
    const form = {
      id: uid('form'), name: name.trim(), slug: Exporter.slugify(name),
      action: 'mailto', actionTarget: Builder.project.meta.title ? '' : '',
      fields: [
        { id: uid('ff'), label: 'Full name', type: 'text', required: true, options: '' },
        { id: uid('ff'), label: 'Email', type: 'email', required: true, options: '' },
        { id: uid('ff'), label: 'Message', type: 'textarea', required: false, options: '' },
      ],
    };
    Builder.history.snapshotCommand('New Form', () => Builder.project.forms, (s) => { Builder.project.forms = s; },
      () => { Builder.project.forms.push(form); });
    this.activeId = form.id;
    this.render();
  },

  render() {
    const forms = Builder.project.forms;
    const listEl = document.getElementById('form-list-items');
    listEl.innerHTML = forms.map(f => `
      <div class="wb-col-item ${f.id === this.activeId ? 'active' : ''}" data-id="${f.id}">
        <div>${escapeHtml(f.name)}</div>
        <div class="cnt">${f.fields.length} field${f.fields.length === 1 ? '' : 's'}</div>
      </div>`).join('');
    listEl.querySelectorAll('.wb-col-item').forEach(el => {
      el.addEventListener('click', () => { this.activeId = el.dataset.id; this.render(); });
    });

    const mainEl = document.getElementById('form-main');
    if (!forms.length) {
      mainEl.innerHTML = `<div class="wb-mode-empty">
        <p><b>No forms yet.</b></p>
        <p style="margin-top:8px;">Forms are drag-and-drop field sets — Contact, Newsletter Signup, Job Application, anything visitors fill out. Click <b>+ New Form</b> to design your first one, then drag a <b>Custom Form</b> section onto the canvas in Design mode to display it.</p>
      </div>`;
      return;
    }
    if (!this.activeId || !forms.find(f => f.id === this.activeId)) this.activeId = forms[0].id;
    this.renderMain();
  },

  renderMain() {
    const form = Builder.project.forms.find(f => f.id === this.activeId);
    if (!form) return;
    const mainEl = document.getElementById('form-main');
    mainEl.innerHTML = `
      <h2>${escapeHtml(form.name)}</h2>
      <div class="wb-mode-sub">Slug: ${escapeHtml(form.slug)} · reference this form from a Custom Form section in Design mode</div>
      <div class="wb-mode-section">
        <h4>Fields</h4>
        <div id="wb-form-fields-list"></div>
        <button class="wb-btn-line" id="add-form-field-btn">+ Add field</button>
      </div>
      <div class="wb-mode-section">
        <h4>On submit</h4>
        <div class="wb-field-row">
          <select id="form-action-select" style="flex:1;">
            <option value="mailto" ${form.action === 'mailto' ? 'selected' : ''}>Email me (opens visitor's mail app)</option>
            <option value="custom" ${form.action === 'custom' ? 'selected' : ''}>Custom endpoint URL (Formspree, Web3Forms, your API...)</option>
          </select>
        </div>
        <div id="form-action-target-wrap" style="${form.action === 'custom' ? '' : 'display:none;'}margin-top:8px;">
          <input type="text" id="form-action-target" value="${escapeHtml(form.actionTarget || '')}" placeholder="https://formspree.io/f/yourid" style="width:100%;background:var(--panel-2);border:1px solid var(--border);color:var(--text);padding:8px 10px;border-radius:6px;font-size:.78rem;">
        </div>
        <div class="wb-mode-empty" style="margin-top:8px;">Since this is a fully offline, no-backend builder, form submissions never touch a server we control. "Email me" opens the visitor's own email client with the message prefilled — reliable, zero setup. For a silent submit-and-redirect experience, sign up for a free endpoint at Formspree or Web3Forms and paste it above.</div>
      </div>`;
    this.renderFieldsList(form);
    document.getElementById('add-form-field-btn').addEventListener('click', () => {
      Builder.history.snapshotCommand('Add Form Field', () => Builder.project.forms, (s) => { Builder.project.forms = s; },
        () => { form.fields.push({ id: uid('ff'), label: 'New Field', type: 'text', required: false, options: '' }); });
      this.renderMain(); this.render();
    });
    document.getElementById('form-action-select').addEventListener('change', e => {
      Builder.history.snapshotCommand('Change Form Action', () => Builder.project.forms, (s) => { Builder.project.forms = s; },
        () => { form.action = e.target.value; });
      document.getElementById('form-action-target-wrap').style.display = e.target.value === 'custom' ? '' : 'none';
    });
    document.getElementById('form-action-target').addEventListener('change', e => {
      Builder.history.snapshotCommand('Set Form Endpoint', () => Builder.project.forms, (s) => { Builder.project.forms = s; },
        () => { form.actionTarget = e.target.value.trim(); });
    });
  },

  renderFieldsList(form) {
    const wrap = document.getElementById('wb-form-fields-list');
    wrap.innerHTML = form.fields.map(f => `
      <div class="wb-field-row" data-fid="${f.id}">
        <input type="text" class="ffl" value="${escapeHtml(f.label)}" style="flex:2;min-width:120px;">
        <select class="fft">${FORM_FIELD_TYPES.map(t => `<option value="${t}" ${t === f.type ? 'selected' : ''}>${t}</option>`).join('')}</select>
        <label class="wb-checkbox-row"><input type="checkbox" class="ffr" ${f.required ? 'checked' : ''}> Required</label>
        ${(f.type === 'dropdown' || f.type === 'radio') ? `<input type="text" class="ffo" placeholder="Options, comma-separated" value="${escapeHtml(f.options || '')}" style="flex-basis:100%;margin-top:6px;">` : ''}
        <button class="wb-field-del" title="Delete field">✕</button>
      </div>`).join('');
    wrap.querySelectorAll('.wb-field-row').forEach(row => {
      const fid = row.dataset.fid;
      const field = form.fields.find(f => f.id === fid);
      row.querySelector('.ffl').addEventListener('change', e => {
        Builder.history.snapshotCommand('Rename Form Field', () => Builder.project.forms, (s) => { Builder.project.forms = s; },
          () => { field.label = e.target.value || field.label; });
      });
      row.querySelector('.fft').addEventListener('change', e => {
        Builder.history.snapshotCommand('Change Field Type', () => Builder.project.forms, (s) => { Builder.project.forms = s; },
          () => { field.type = e.target.value; });
        this.renderMain();
      });
      row.querySelector('.ffr').addEventListener('change', e => {
        Builder.history.snapshotCommand('Toggle Required', () => Builder.project.forms, (s) => { Builder.project.forms = s; },
          () => { field.required = e.target.checked; });
      });
      const opt = row.querySelector('.ffo');
      if (opt) opt.addEventListener('change', e => {
        Builder.history.snapshotCommand('Set Field Options', () => Builder.project.forms, (s) => { Builder.project.forms = s; },
          () => { field.options = e.target.value; });
      });
      row.querySelector('.wb-field-del').addEventListener('click', () => {
        if (form.fields.length <= 1) { UI.toast('A form needs at least one field.', true); return; }
        if (!confirm(`Delete field "${field.label}"?`)) return;
        Builder.history.snapshotCommand('Delete Form Field', () => Builder.project.forms, (s) => { Builder.project.forms = s; },
          () => { form.fields = form.fields.filter(f => f.id !== fid); });
        this.renderMain(); this.render();
      });
    });
  },
};
window.Forms = Forms;
