/**
 * editor.js — Property Inspector + Theme/SEO/Assets panels
 */
const Editor = {
  renderInspector(section) {
    const panel = document.getElementById('wb-inspector-body');
    if (!panel) return;
    if (!section) {
      panel.innerHTML = '<div class="wb-inspector-empty"><div class="ie-icon">🎯</div>Click any section on the canvas to edit its properties.</div>';
      return;
    }
    const def = SectionRegistry[section.type];
    if (!def) return;
    const fieldsHtml = def.fields.map(f => this.renderField(section, f)).join('');
    const navHtml = this.renderNavFields(section);
    const bgEffectHtml = this.renderBgEffectFields(section);
    const animHtml = this.renderAnimationFields(section);
    panel.innerHTML = `<div class="wb-inspector-header"><span class="ih-icon">${def.meta.icon}</span><strong>${def.meta.name}</strong></div>
<div class="wb-inspector-section-title">Properties</div>
<div class="wb-inspector-fields">${fieldsHtml}</div>
${navHtml ? `<div class="wb-inspector-section-title">Navigation</div>
<div class="wb-inspector-fields">${navHtml}</div>` : ''}
<div class="wb-inspector-section-title">Background Animation</div>
<div class="wb-inspector-fields">${bgEffectHtml}</div>
<div class="wb-inspector-section-title">Scroll Animation</div>
<div class="wb-inspector-fields">${animHtml}</div>`;
    this.bindFieldEvents(panel, section);
    this.bindAnimationFieldEvents(panel, section);
  },

  /** Background Animation controls — available on every section. Reuses BgEffects.fields so the
   *  catalog of effects, ranges, and defaults live in one place (bg-effects.js). */
  renderBgEffectFields(section) {
    if (typeof BgEffects === 'undefined') return '';
    const html = BgEffects.fields.map(f => this.renderField(section, f)).join('');
    const active = BgEffects.isActive(section);
    const note = active
      ? `<div class="wb-inspector-note">Speed/opacity/colors/particle count/intensity only apply once an effect other than "None" is selected above. Heavier effects (Aurora, Mesh Gradient, Floating Blobs, Interactive Particle Attraction) automatically simplify or turn off on low-end devices and when a visitor has "reduce motion" enabled.</div>`
      : `<div class="wb-inspector-note">Pick an effect to add an animated background behind this section's content — gradients, particles, stars, and more. Fully GPU/CSS-driven where possible; automatically respects low-end devices and accessibility settings.</div>`;
    return html + note;
  },

  /** Menu Label override — lets a section's nav-menu text differ from its on-page heading,
   *  without needing to leave auto-sync mode in Menu Builder. Only shown for sections that
   *  actually appear in the auto-generated navbar (i.e. not footer/alert/etc). */
  renderNavFields(section) {
    if (typeof NAV_EXCLUDE !== 'undefined' && NAV_EXCLUDE.has(section.type)) return '';
    const def = SectionRegistry[section.type];
    const placeholder = escapeHtml(section.heading || section.companyName || (def ? def.meta.name : ''));
    const value = section.navLabel || '';
    return this.wrapField('Menu Label (optional)',
      `<input type="text" id="f_${section.id}_navLabel" data-key="navLabel" value="${escapeHtml(value)}" placeholder="${placeholder}">`)
      + `<div class="wb-inspector-note">Leave blank to use the section heading in the menu. Set this to show different text there — handy when the heading is long or you want a shorter menu label.</div>`;
  },

  renderField(section, field) {
    const value = section[field.key];
    const id = `f_${section.id}_${field.key}`;
    switch (field.type) {
      case 'text': return this.wrapField(field.label,`<input type="text" id="${id}" data-key="${field.key}" value="${escapeHtml(value)}">`);
      case 'textarea': return this.wrapField(field.label,`<textarea id="${id}" data-key="${field.key}" rows="3">${escapeHtml(value)}</textarea>`);
      case 'code': return this.wrapField(field.label,`<textarea id="${id}" data-key="${field.key}" rows="10" style="font-family:'SF Mono',Consolas,Menlo,monospace;font-size:.78rem;white-space:pre;">${escapeHtml(value)}</textarea>`);
      case 'note': return `<div class="wb-inspector-note">${field.text}</div>`;
      case 'color': return this.wrapField(field.label,`<div class="wb-color-input"><input type="color" id="${id}" data-key="${field.key}" value="${escapeHtml(value)}"><input type="text" data-key="${field.key}" data-pair="${id}" class="wb-color-hex" value="${escapeHtml(value)}"></div>`);
      case 'number': return this.wrapField(field.label,`<input type="number" id="${id}" data-key="${field.key}" value="${value}" min="${field.min??''}" max="${field.max??''}" step="${field.step??'1'}">`);
      case 'select': return this.wrapField(field.label,`<select id="${id}" data-key="${field.key}">${field.options.map(o=>`<option value="${o}"${o===value?' selected':''}>${o.charAt(0).toUpperCase()+o.slice(1)}</option>`).join('')}</select>`);
      case 'toggle': return this.wrapField(field.label,`<label class="wb-switch"><input type="checkbox" id="${id}" data-key="${field.key}"${value?' checked':''}><span class="wb-switch-slider"></span></label>`);
      case 'image': return this.wrapField(field.label,`<div class="wb-image-field">${value?`<img src="${escapeHtml(value)}" class="wb-image-preview">`:'<div class="wb-image-preview wb-image-empty">No image</div>'}<input type="text" id="${id}" data-key="${field.key}" placeholder="Image URL" value="${escapeHtml(value)}"><input type="file" accept="image/*" class="wb-image-upload" data-key="${field.key}"></div>`);
      case 'list': return this.renderListField(section, field);
      case 'dynamic-select': {
        const src = field.source === 'forms' ? (Builder.project.forms || []) : (Builder.project.collections || []);
        if (!src.length) return this.wrapField(field.label, `<div class="wb-inspector-empty" style="padding:8px 0;">No ${field.source === 'forms' ? 'forms' : 'collections'} yet — create one in the ${field.source === 'forms' ? 'Forms' : 'Collections'} mode first.</div>`);
        return this.wrapField(field.label, `<select id="${id}" data-key="${field.key}">${src.map(o => `<option value="${o.id}"${o.id === value ? ' selected' : ''}>${escapeHtml(o.name)}</option>`).join('')}</select>`);
      }
      default: return '';
    }
  },

  renderListField(section, field) {
    const items = section[field.key] || [];
    const itemsHtml = items.map((item, idx) => `<div class="wb-list-item" data-item-id="${item.id}">
<div class="wb-list-item-header"><span>${field.label} #${idx+1}</span><button class="wb-mini-btn wb-mini-btn-danger" data-remove-item="${item.id}">✕</button></div>
${field.itemFields.map(f2 => {
  const iid = `li_${item.id}_${f2.key}`;
  const iv = item[f2.key];
  if (f2.type==='textarea') return this.wrapField(f2.label,`<textarea id="${iid}" data-item-id="${item.id}" data-item-key="${f2.key}" rows="2">${escapeHtml(iv)}</textarea>`);
  if (f2.type==='color') return this.wrapField(f2.label,`<div class="wb-color-input"><input type="color" id="${iid}" data-item-id="${item.id}" data-item-key="${f2.key}" value="${escapeHtml(iv||'#000000')}"><input type="text" class="wb-color-hex" data-item-id="${item.id}" data-item-key="${f2.key}" value="${escapeHtml(iv||'')}"></div>`);
  return this.wrapField(f2.label,`<input type="text" id="${iid}" data-item-id="${item.id}" data-item-key="${f2.key}" value="${escapeHtml(iv)}">`);
}).join('')}</div>`).join('');
    return `<div class="wb-field wb-field-list"><label>${field.label}</label><div class="wb-list-items" data-list-key="${field.key}">${itemsHtml}</div><button class="wb-btn-add-item" data-add-list="${field.key}" data-item-fields='${JSON.stringify(field.itemFields)}'>+ Add ${field.label.replace(/s$/,'')}</button></div>`;
  },

  wrapField(label, inputHtml) { return `<div class="wb-field"><label>${label}</label>${inputHtml}</div>`; },

  renderAnimationFields(section) {
    if (!section.animation) section.animation = Animations.defaultData();
    const a = section.animation;
    return Animations.fields.map(field => {
      const id = `anim_${section.id}_${field.key}`;
      if (field.type==='select') return this.wrapField(field.label,`<select id="${id}" data-anim-key="${field.key}">${field.options.map(o=>`<option value="${o}"${o===a[field.key]?' selected':''}>${o}</option>`).join('')}</select>`);
      const dis = a.type==='none'?' disabled':'';
      return this.wrapField(field.label,`<input type="number" id="${id}" data-anim-key="${field.key}" value="${a[field.key]}" min="${field.min}" max="${field.max}"${dis}>`);
    }).join('');
  },

  bindFieldEvents(panel, section) {
    const timers = {};
    const debounce = (key, value, immediate) => {
      if (immediate) { Builder.updateSectionField(section.id, key, value); }
      else { clearTimeout(timers[key]); timers[key] = setTimeout(() => Builder.updateSectionField(section.id, key, value), 150); }
    };
    panel.querySelectorAll('[data-key]:not(.wb-color-hex)').forEach(input => {
      const key = input.dataset.key;
      const immediate = input.type==='checkbox'||input.tagName==='SELECT'||input.type==='color';
      input.addEventListener('input', () => {
        let value = input.type==='checkbox' ? input.checked : input.type==='number' ? Number(input.value) : input.value;
        debounce(key, value, immediate);
        if (input.type==='color') { const p=panel.querySelector(`.wb-color-hex[data-key="${key}"]`); if(p)p.value=value; }
      });
      if (input.type==='color') input.addEventListener('change', () => { debounce(key,input.value,true); const p=panel.querySelector(`.wb-color-hex[data-key="${key}"]`); if(p)p.value=input.value; });
    });
    panel.querySelectorAll('.wb-color-hex[data-key]').forEach(input => {
      input.addEventListener('input', () => {
        if(!/^#[0-9a-fA-F]{3,6}$/.test(input.value))return;
        Builder.updateSectionField(section.id, input.dataset.key, input.value);
        const cp=panel.querySelector(`input[type="color"][data-key="${input.dataset.key}"]`); if(cp)cp.value=input.value;
      });
    });
    panel.querySelectorAll('.wb-image-upload').forEach(input => {
      input.addEventListener('change', () => {
        const file=input.files[0]; if(!file)return;
        const reader=new FileReader();
        reader.onload=()=>{ Builder.updateSectionField(section.id,input.dataset.key,reader.result); this.renderInspector(Builder.getSection(section.id)); };
        reader.readAsDataURL(file);
      });
    });
    const it={};
    panel.querySelectorAll('[data-item-id][data-item-key]').forEach(input => {
      input.addEventListener('input', () => {
        const lk=input.closest('.wb-list-items')?.dataset.listKey||input.closest('[data-list-key]')?.dataset.listKey;
        if(!lk)return;
        const k2=input.dataset.itemId+'_'+input.dataset.itemKey;
        clearTimeout(it[k2]); it[k2]=setTimeout(()=>Builder.updateSectionListItem(section.id,lk,input.dataset.itemId,input.dataset.itemKey,input.value),150);
      });
    });
    panel.querySelectorAll('[data-remove-item]').forEach(btn => {
      btn.addEventListener('click', () => {
        const lk=btn.closest('.wb-list-items')?.dataset.listKey;
        if(lk)Builder.removeListItem(section.id,lk,btn.dataset.removeItem);
      });
    });
    panel.querySelectorAll('[data-add-list]').forEach(btn => {
      btn.addEventListener('click', () => Builder.addListItem(section.id,btn.dataset.addList,JSON.parse(btn.dataset.itemFields)));
    });
  },

  bindAnimationFieldEvents(panel, section) {
    panel.querySelectorAll('[data-anim-key]').forEach(input => {
      input.addEventListener('input', () => {
        const key=input.dataset.animKey;
        const value=input.type==='number'?Number(input.value):input.value;
        Builder.history.snapshotCommand('Edit Animation',()=>section.animation,(snap)=>{section.animation=snap;},()=>{section.animation[key]=value;});
        if(key==='type')this.renderInspector(section);
        Builder.renderCanvasOnly();
      });
    });
  },

  renderThemePanel() {
    const panel=document.getElementById('wb-theme-body');
    if(!panel||!Builder.project)return;
    const t=Builder.project.theme;
    if(!Array.isArray(t.localFonts))t.localFonts=[];
    const gFonts=['Poppins','Montserrat','Playfair Display','Raleway','Oswald','Inter','Roboto','Open Sans','Lato','Nunito'];
    const fontOpts=(sel)=>`<optgroup label="Google Fonts">${gFonts.map(f=>`<option value="${f}"${f===sel?' selected':''}>${f}</option>`).join('')}</optgroup>${t.localFonts.length?`<optgroup label="Uploaded Fonts">${t.localFonts.map(f=>`<option value="${escapeHtml(f.name)}"${f.name===sel?' selected':''}>${escapeHtml(f.name)} (local)</option>`).join('')}</optgroup>`:''}`;
    const cols=[['primary','Primary'],['secondary','Secondary'],['accent','Accent'],['background','Background'],['surface','Surface'],['text','Text']];
    panel.innerHTML=`<div class="wb-panel-heading" style="padding-top:2px;">Theme Editor</div>
<div class="wb-theme-mode-toggle"><button class="wb-mode-btn${t.mode==='light'?' active':''}" data-mode="light">☀️ Light</button><button class="wb-mode-btn${t.mode==='dark'?' active':''}" data-mode="dark">🌙 Dark</button></div>
${cols.map(([k,l])=>`<div class="wb-field"><label>${l}</label><div class="wb-color-input"><input type="color" data-theme-key="${k}" value="${t[k]}"><input type="text" class="wb-color-hex" data-theme-key="${k}" value="${t[k]}"></div></div>`).join('')}
<div class="wb-field"><label>Heading Font</label><select data-theme-key="fontHeading">${fontOpts(t.fontHeading)}</select></div>
<div class="wb-field"><label>Body Font</label><select data-theme-key="fontBody">${fontOpts(t.fontBody)}</select></div>
<div class="wb-field"><label>Upload Local Font (.woff2,.woff,.ttf)</label><input type="file" id="wb-local-font-input" accept=".woff,.woff2,.ttf,.otf" multiple>${t.localFonts.length?`<div class="wb-local-fonts-list">${t.localFonts.map(f=>`<span class="wb-badge">${escapeHtml(f.name)} <button class="wb-local-font-remove" data-font-name="${escapeHtml(f.name)}">✕</button></span>`).join('')}</div>`:''}</div>`;
    panel.querySelectorAll('[data-theme-key]').forEach(input=>{
      input.addEventListener('input',()=>{
        const key=input.dataset.themeKey;
        Builder.history.snapshotCommand('Edit Theme',()=>Builder.project.theme,(snap)=>{Builder.project.theme=snap;},()=>{t[key]=input.value;});
        Builder.applyThemeVars();
        panel.querySelectorAll(`[data-theme-key="${key}"]`).forEach(el=>{if(el!==input)el.value=input.value;});
      });
    });
    panel.querySelectorAll('.wb-mode-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        Builder.history.snapshotCommand('Toggle Mode',()=>Builder.project.theme,(snap)=>{Builder.project.theme=snap;},()=>{t.mode=btn.dataset.mode;});
        this.renderThemePanel();
      });
    });
    const fi=panel.querySelector('#wb-local-font-input');
    if(fi)fi.addEventListener('change',()=>{
      Array.from(fi.files).forEach(file=>{
        const reader=new FileReader();
        reader.onload=()=>{
          const name=file.name.replace(/\.(woff2?|ttf|otf)$/i,'');
          const fmt=file.name.match(/\.woff2$/i)?'woff2':file.name.match(/\.woff$/i)?'woff':file.name.match(/\.otf$/i)?'opentype':'truetype';
          Builder.history.snapshotCommand('Upload Font',()=>t.localFonts,(snap)=>{t.localFonts=snap;},()=>{t.localFonts.push({name,dataUrl:reader.result,format:fmt});});
          this.renderThemePanel();
          UI.toast(`Font "${name}" uploaded`,'success');
        };
        reader.readAsDataURL(file);
      });
    });
    panel.querySelectorAll('.wb-local-font-remove').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const name=btn.dataset.fontName;
        Builder.history.snapshotCommand('Remove Font',()=>t.localFonts,(snap)=>{t.localFonts=snap;},()=>{t.localFonts=t.localFonts.filter(f=>f.name!==name);});
        this.renderThemePanel();
      });
    });
  },

  renderSeoPanel(){
    const panel=document.getElementById('wb-seo-body');
    if(!panel||!Builder.project)return;
    const m=Builder.project.meta;
    panel.innerHTML=`<div class="wb-panel-heading" style="padding-top:2px;">SEO &amp; Metadata</div>
<div class="wb-inspector-fields" style="padding:0;">
<div class="wb-field"><label>Page Title</label><input type="text" data-seo-key="title" value="${escapeHtml(m.title)}"></div>
<div class="wb-field"><label>Meta Description</label><textarea data-seo-key="description" rows="3">${escapeHtml(m.description)}</textarea></div>
<div class="wb-field"><label>Keywords</label><input type="text" data-seo-key="keywords" value="${escapeHtml(m.keywords)}" placeholder="word1, word2"></div>
<div class="wb-field"><label>Favicon URL</label><input type="text" data-seo-key="favicon" value="${escapeHtml(m.favicon)}"></div>
<div class="wb-field"><label>OG Image URL</label><input type="text" data-seo-key="ogImage" value="${escapeHtml(m.ogImage)}"></div>
<div class="wb-field"><label>Canonical URL</label><input type="text" data-seo-key="canonical" value="${escapeHtml(m.canonical)}"></div>
<div class="wb-field"><label>Robots</label><select data-seo-key="robots">${['index, follow','noindex, follow','index, nofollow','noindex, nofollow'].map(o=>`<option value="${o}"${o===m.robots?' selected':''}>${o}</option>`).join('')}</select></div>
</div>`;
    panel.querySelectorAll('[data-seo-key]').forEach(input=>{
      input.addEventListener('input',()=>{
        const key=input.dataset.seoKey;
        Builder.history.snapshotCommand('Edit SEO',()=>Builder.project.meta,(snap)=>{Builder.project.meta=snap;},()=>{m[key]=input.value;});
      });
    });
  },

  renderAssetsPanel(){
    const panel=document.getElementById('wb-assets-body');
    if(!panel||!Builder.project)return;
    const assets=Builder.project.assets||[];
    panel.innerHTML=`<div class="wb-panel-heading" style="padding-top:2px;">Asset Library</div>
<div class="wb-asset-upload-bar"><input type="file" id="wb-asset-upload-input" accept="image/*" multiple style="display:none;"><button id="wb-asset-upload-btn">⬆ Upload Images</button></div>
<div class="wb-asset-grid">${assets.map(a=>`<div class="wb-asset-thumb" data-asset-id="${a.id}" title="${escapeHtml(a.name)}"><img src="${a.dataUrl}" alt="${escapeHtml(a.name)}"><div class="wb-asset-thumb-actions"><button class="wb-mini-btn wb-asset-delete" data-asset-id="${a.id}" title="Delete">✕</button></div></div>`).join('')}${!assets.length?'<div class="wb-asset-empty">Upload images here to reuse across sections.</div>':''}</div>`;
    const fi=panel.querySelector('#wb-asset-upload-input');
    panel.querySelector('#wb-asset-upload-btn').addEventListener('click',()=>fi.click());
    fi.addEventListener('change',()=>Array.from(fi.files).forEach(file=>{const r=new FileReader();r.onload=()=>Builder.addAsset(file.name,r.result);r.readAsDataURL(file);}));
    panel.querySelectorAll('.wb-asset-thumb').forEach(thumb=>{
      thumb.addEventListener('click',(e)=>{
        if(e.target.closest('.wb-asset-delete'))return;
        const asset=assets.find(a=>a.id===thumb.dataset.assetId);
        if(asset){navigator.clipboard?.writeText(asset.dataUrl).catch(()=>{});UI.toast(`Copied "${asset.name}" — paste into any Image URL field.`);}
      });
    });
    panel.querySelectorAll('.wb-asset-delete').forEach(btn=>{btn.addEventListener('click',(e)=>{e.stopPropagation();Builder.deleteAsset(btn.dataset.assetId);});});
  },

  renderTemplatesPanel(){
    const panel=document.getElementById('wb-templates-body');
    if(!panel)return;
    const templates=window.IndustryTemplates||[];
    panel.innerHTML=templates.map(t=>`<div class="wb-template-card"><img src="${t.thumbnail}" alt="${escapeHtml(t.name)}" class="wb-template-thumb" loading="lazy"><div class="wb-template-info"><strong>${t.icon} ${escapeHtml(t.name)}</strong><p>${escapeHtml(t.description)}</p><button class="wb-tool-btn wb-tool-btn-primary wb-template-load" data-template-id="${t.id}">Use Template</button></div></div>`).join('');
    panel.querySelectorAll('.wb-template-load').forEach(btn=>{
      btn.addEventListener('click',()=>{
        if(!confirm(`Load "${btn.dataset.templateId}"? Current project will be replaced.`))return;
        const tmpl=templates.find(t=>t.id===btn.dataset.templateId);
        if(!tmpl)return;
        const project=tmpl.project();
        Importer.backfillProjectDefaults(project);
        Builder.project=project;
        Builder.history.clear();
        Builder.renderAll();
        Builder.selectSection(null);
        this.renderThemePanel();
        UI.toast(`Loaded "${tmpl.name}" template`,'success');
      });
    });
  },
};
window.Editor=Editor;
