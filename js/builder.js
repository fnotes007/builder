/**
 * builder.js — Core app state, CRUD, drag/drop, canvas rendering
 */
const Builder = {
  project: null,
  history: null,
  draggedSectionId: null,

  newProject() {
    this.project = {
      meta: { title:'My Website', description:'A website built with Offline Website Builder Pro.', favicon:'', keywords:'', ogImage:'', robots:'index, follow', canonical:'' },
      theme: { primary:'#2563eb', secondary:'#0f172a', accent:'#f59e0b', background:'#ffffff', surface:'#f8fafc', text:'#0f172a', mode:'light', fontHeading:'Poppins', fontBody:'Inter', localFonts:[], radius:14, container:1140 },
      sections: ['hero','about','services','testimonials','cta','footer'].map(t=>{ const d=SectionRegistry[t].defaultData(); d.animation=Animations.defaultData(); return d; }),
      assets: [],
      collections: [],
      collectionItems: {},
      forms: [],
      posts: [],
      menu: { sticky:false, transparent:false, customized:false, items:[] },
      siteSettings: { siteUrl:'', backToTop:false, whatsappEnabled:false, whatsappNumber:'', callEnabled:false, callNumber:'', animQuality:'high', animAutoDetect:true, animAllowDisable:false, scrollAnimEnabled:true },
      selectedSectionId: null,
    };
    this.history.clear();
    this.renderAll();
  },

  init() {
    this.history = new HistoryManager(state => UI.updateHistoryButtons(state));
    this.newProject();
    this.bindToolbar();
    this.bindCanvasDnD();
    if (window.MobileUI) MobileUI.init();
    if (window.Collections) Collections.init();
    if (window.Forms) Forms.init();
    if (window.MediaLibrary) MediaLibrary.init();
    if (window.BlogEngine) BlogEngine.init();
    if (window.Modes) Modes.init();
  },

  getSection(id) { return this.project.sections.find(s=>s.id===id)||null; },
  getSectionIndex(id) { return this.project.sections.findIndex(s=>s.id===id); },

  addSection(type, index=null) {
    const def=SectionRegistry[type]; if(!def)return;
    const data=def.defaultData(); data.animation=Animations.defaultData();
    const at=index===null?this.project.sections.length:index;
    this.history.snapshotCommand(`Add ${def.meta.name}`,()=>this.project.sections,(s)=>{this.project.sections=s;},()=>{this.project.sections.splice(at,0,data);});
    this.selectSection(data.id);
    if(window.MobileUI)MobileUI.closeAll();
  },

  deleteSection(id) {
    const idx=this.getSectionIndex(id); if(idx===-1)return;
    this.history.snapshotCommand('Delete Section',()=>this.project.sections,(s)=>{this.project.sections=s;},()=>{this.project.sections.splice(idx,1);});
    if(this.project.selectedSectionId===id)this.selectSection(null);
    else this.renderAll();
  },

  duplicateSection(id) {
    const idx=this.getSectionIndex(id); if(idx===-1)return;
    const clone=deepClone(this.project.sections[idx]);
    clone.id=uid('sec');
    if(Array.isArray(clone.items))clone.items=clone.items.map(it=>({...it,id:uid('item')}));
    this.history.snapshotCommand('Duplicate',()=>this.project.sections,(s)=>{this.project.sections=s;},()=>{this.project.sections.splice(idx+1,0,clone);});
    this.selectSection(clone.id);
  },

  toggleVisibility(id) {
    const s=this.getSection(id); if(!s)return;
    this.history.snapshotCommand('Toggle Visibility',()=>this.project.sections,(sec)=>{this.project.sections=sec;},()=>{s.visible=!s.visible;});
    this.renderAll();
  },

  reorderSection(fromIdx, toIdx) {
    if(fromIdx===toIdx||fromIdx<0||toIdx<0)return;
    this.history.snapshotCommand('Reorder',()=>this.project.sections,(s)=>{this.project.sections=s;},()=>{const[m]=this.project.sections.splice(fromIdx,1);this.project.sections.splice(toIdx,0,m);});
    this.renderAll();
  },

  selectSection(id) {
    this.project.selectedSectionId=id;
    this.applyThemeVars();
    this.renderCanvas();
    this.renderSectionList();
    Editor.renderInspector(id?this.getSection(id):null);
    if(id&&document.querySelector){const el=document.querySelector(`.wb-layer-item[data-section-id="${id}"]`);if(el)el.scrollIntoView({block:'nearest',behavior:'smooth'});}
    if(window.MobileUI)MobileUI.onSelectSection(id);
  },

  updateSectionField(id, key, value) {
    const section=this.getSection(id); if(!section)return;
    const before=deepClone(section[key]);
    section[key]=value;
    const after=deepClone(section[key]);
    this.history.push(`Edit ${key}`,()=>{section[key]=deepClone(before);this.renderCanvasOnly();},()=>{section[key]=deepClone(after);this.renderCanvasOnly();});
    this.renderCanvasOnly();
  },

  updateSectionListItem(id, listKey, itemId, itemKey, value) {
    const section=this.getSection(id); if(!section||!Array.isArray(section[listKey]))return;
    const item=section[listKey].find(it=>it.id===itemId); if(!item)return;
    const before=deepClone(item[itemKey]);
    item[itemKey]=value;
    const after=deepClone(item[itemKey]);
    this.history.push(`Edit ${itemKey}`,()=>{item[itemKey]=deepClone(before);this.renderCanvasOnly();},()=>{item[itemKey]=deepClone(after);this.renderCanvasOnly();});
    this.renderCanvasOnly();
  },

  addListItem(id, listKey, itemFields) {
    const section=this.getSection(id); if(!section||!Array.isArray(section[listKey]))return;
    const newItem={id:uid('item')}; itemFields.forEach(f=>{newItem[f.key]='';});
    this.history.snapshotCommand('Add Item',()=>section,(snap)=>{Object.assign(section,snap);},()=>{section[listKey].push(newItem);});
    this.renderCanvasOnly(); Editor.renderInspector(section);
  },

  removeListItem(id, listKey, itemId) {
    const section=this.getSection(id); if(!section||!Array.isArray(section[listKey]))return;
    this.history.snapshotCommand('Remove Item',()=>section,(snap)=>{Object.assign(section,snap);},()=>{section[listKey]=section[listKey].filter(it=>it.id!==itemId);});
    this.renderCanvasOnly(); Editor.renderInspector(section);
  },

  addAsset(name, dataUrl) {
    const asset={id:uid('asset'),name,dataUrl};
    this.history.snapshotCommand('Upload Asset',()=>this.project.assets,(s)=>{this.project.assets=s;},()=>{this.project.assets.push(asset);});
    Editor.renderAssetsPanel();
  },

  deleteAsset(id) {
    this.history.snapshotCommand('Delete Asset',()=>this.project.assets,(s)=>{this.project.assets=s;},()=>{this.project.assets=this.project.assets.filter(a=>a.id!==id);});
    Editor.renderAssetsPanel();
  },

  renderAll() {
    this.applyThemeVars(); this.renderCanvas(); this.renderSectionList();
    document.title=(this.project.meta.title||'My Website')+' — Builder Pro';
    if(window.MobileUI)MobileUI.onRenderAll();
  },

  renderCanvasOnly() { this.applyThemeVars(); this.renderCanvas(); },

  applyThemeVars() {
    const root=document.getElementById('wb-preview-root'); if(!root)return;
    const t=this.project.theme;
    root.style.setProperty('--wb-primary',t.primary); root.style.setProperty('--wb-secondary',t.secondary);
    root.style.setProperty('--wb-accent',t.accent); root.style.setProperty('--wb-bg',t.background);
    root.style.setProperty('--wb-surface',t.surface); root.style.setProperty('--wb-text',t.text);
    root.style.setProperty('--wb-font-heading',`'${t.fontHeading}',sans-serif`);
    root.style.setProperty('--wb-font-body',`'${t.fontBody}',sans-serif`);
    root.style.setProperty('--wb-radius',(t.radius!==undefined?t.radius:14)+'px');
    root.style.setProperty('--wb-container',(t.container!==undefined?t.container:1140)+'px');
    this.syncCanvasLiveStyle();
    this.syncGoogleFontLink();
    this.syncBgEffectSettings();
  },

  /** Reflects project.siteSettings animation-quality settings onto <body> so BgEffects' runtime
   *  (shared between live canvas and exported site) can read them the same way in both places. */
  syncBgEffectSettings() {
    const ss=this.project.siteSettings||{};
    document.body.setAttribute('data-wb-quality-setting', ss.animQuality||'high');
    document.body.setAttribute('data-wb-auto-detect', ss.animAutoDetect===false?'0':'1');
  },

  /** Injects the exported site's real CSS (scoped to #wb-preview-root) so the canvas shows
   *  accurately styled sections while editing, not raw unstyled HTML. */
  syncCanvasLiveStyle() {
    let styleEl=document.getElementById('wb-canvas-live-style');
    if(!styleEl){ styleEl=document.createElement('style'); styleEl.id='wb-canvas-live-style'; document.head.appendChild(styleEl); }
    styleEl.textContent=Exporter.scopeCss(Exporter.buildBaseCss(this.project),'#wb-preview-root');
  },

  /** Loads the current theme's Google Fonts on the fly so canvas headings/body text preview correctly. */
  syncGoogleFontLink() {
    let linkEl=document.getElementById('wb-canvas-google-font');
    const url=Exporter.buildGoogleFontsUrl(this.project);
    if(!url){ if(linkEl)linkEl.remove(); return; }
    if(!linkEl){ linkEl=document.createElement('link'); linkEl.id='wb-canvas-google-font'; linkEl.rel='stylesheet'; document.head.appendChild(linkEl); }
    if(linkEl.href!==url) linkEl.href=url;
  },

  renderCanvas() {
    const root=document.getElementById('wb-preview-root'); if(!root)return;
    if(window.BgEffects) BgEffects.unmountAll();
    const html=this.project.sections.map(section=>{
      const def=SectionRegistry[section.type]; if(!def)return '';
      const hidden=section.visible===false;
      const selected=section.id===this.project.selectedSectionId;
      let sectionHtml=def.render(section,this.project);
      if(window.BgEffects) sectionHtml=BgEffects.injectIntoSectionHtml(sectionHtml,section);
      return `<div class="wb-section-wrap${hidden?' wb-hidden-section':''}${selected?' wb-selected':''}" data-section-id="${section.id}" draggable="true">
<div class="wb-section-toolbar"><span class="wb-drag-handle" title="Drag to reorder">⠿</span><span class="wb-section-label">${def.meta.icon} ${def.meta.name}</span>
<button class="wb-mini-btn" data-action="visibility" title="Toggle">${hidden?'🚫':'👁'}</button>
<button class="wb-mini-btn" data-action="duplicate" title="Duplicate">⧉</button>
<button class="wb-mini-btn wb-mini-btn-danger" data-action="delete" title="Delete">✕</button></div>
${sectionHtml}</div>`;
    }).join('');
    root.innerHTML=html||`<div class="wb-empty-canvas"><div class="ec-icon">✦</div><div class="ec-title">Canvas is empty</div><div class="ec-sub">Add a section from the left sidebar or load a template.</div></div>`;
    this.bindSectionWrapEvents();
    if(window.BgEffects) BgEffects.mountAll(root);
  },

  renderSectionList() {
    const list=document.getElementById('wb-section-list'); if(!list)return;
    list.innerHTML=this.project.sections.map((s,idx)=>{
      const def=SectionRegistry[s.type]; if(!def)return '';
      const sel=s.id===this.project.selectedSectionId?' wb-list-selected':'';
      const hidden=s.visible===false;
      return `<div class="wb-layer-item${sel}" data-section-id="${s.id}" data-layer-index="${idx}" draggable="true">
<span class="wb-layer-drag-handle">⠿</span><span class="wb-layer-icon">${def.meta.icon}</span>
<span class="wb-layer-name">${escapeHtml(s.heading||s.companyName||def.meta.name)}</span>
<button class="wb-layer-vis${hidden?' is-hidden':''}" data-action="visibility" title="${hidden?'Show':'Hide'}">${hidden?'🚫':'👁'}</button></div>`;
    }).join('');
    list.querySelectorAll('.wb-layer-item').forEach(el=>{
      el.addEventListener('click',(e)=>{if(e.target.closest('.wb-layer-vis'))return;this.selectSection(el.dataset.sectionId);});
      el.querySelector('.wb-layer-vis')?.addEventListener('click',(e)=>{e.stopPropagation();this.toggleVisibility(el.dataset.sectionId);});
    });
    this.bindLayerDnD(list);
  },

  bindLayerDnD(list) {
    let draggedId=null;
    list.querySelectorAll('.wb-layer-item').forEach(item=>{
      item.addEventListener('dragstart',(e)=>{draggedId=item.dataset.sectionId;item.classList.add('wb-layer-dragging');e.dataTransfer.effectAllowed='move';});
      item.addEventListener('dragend',()=>{item.classList.remove('wb-layer-dragging');list.querySelectorAll('.wb-layer-item').forEach(i=>i.classList.remove('wb-layer-drop-before','wb-layer-drop-after'));draggedId=null;});
      item.addEventListener('dragover',(e)=>{e.preventDefault();if(!draggedId||item.dataset.sectionId===draggedId)return;list.querySelectorAll('.wb-layer-item').forEach(i=>i.classList.remove('wb-layer-drop-before','wb-layer-drop-after'));const rect=item.getBoundingClientRect();item.classList.add((e.clientY-rect.top)<rect.height/2?'wb-layer-drop-before':'wb-layer-drop-after');});
      item.addEventListener('drop',(e)=>{e.preventDefault();if(!draggedId)return;const tid=item.dataset.sectionId;if(tid===draggedId)return;const rect=item.getBoundingClientRect();const before=(e.clientY-rect.top)<rect.height/2;let fi=this.getSectionIndex(draggedId),ti=this.getSectionIndex(tid);if(!before)ti+=1;if(fi<ti)ti-=1;this.reorderSection(fi,ti);});
    });
  },

  bindSectionWrapEvents() {
    const root=document.getElementById('wb-preview-root');
    root.querySelectorAll('.wb-section-wrap').forEach(wrap=>{
      const id=wrap.dataset.sectionId;
      wrap.addEventListener('click',(e)=>{if(e.target.closest('.wb-mini-btn'))return;this.selectSection(id);});
      wrap.querySelectorAll('.wb-mini-btn').forEach(btn=>{
        btn.addEventListener('click',(e)=>{
          e.stopPropagation();
          const a=btn.dataset.action;
          if(a==='delete')this.deleteSection(id);
          else if(a==='duplicate')this.duplicateSection(id);
          else if(a==='visibility')this.toggleVisibility(id);
        });
      });
    });
  },

  bindCanvasDnD() {
    const root=document.getElementById('wb-preview-root');
    root.addEventListener('dragstart',(e)=>{const w=e.target.closest('.wb-section-wrap');if(!w)return;this.draggedSectionId=w.dataset.sectionId;w.classList.add('wb-dragging');e.dataTransfer.effectAllowed='move';});
    root.addEventListener('dragend',(e)=>{const w=e.target.closest('.wb-section-wrap');if(w)w.classList.remove('wb-dragging');root.querySelectorAll('.wb-drop-before,.wb-drop-after').forEach(el=>el.classList.remove('wb-drop-before','wb-drop-after'));root.querySelector('.wb-empty-canvas')?.classList.remove('wb-drop-target');this.draggedSectionId=null;});
    root.addEventListener('dragover',(e)=>{
      if(!this.draggedSectionId&&!this.draggedPaletteType)return;
      e.preventDefault();
      e.dataTransfer.dropEffect=this.draggedPaletteType?'copy':'move';
      const w=e.target.closest('.wb-section-wrap');
      root.querySelectorAll('.wb-drop-before,.wb-drop-after').forEach(el=>el.classList.remove('wb-drop-before','wb-drop-after'));
      const emptyState=root.querySelector('.wb-empty-canvas');
      if(emptyState)emptyState.classList.toggle('wb-drop-target',!w&&!!this.draggedPaletteType);
      if(!w||w.dataset.sectionId===this.draggedSectionId)return;
      const rect=w.getBoundingClientRect();
      w.classList.add((e.clientY-rect.top)<rect.height/2?'wb-drop-before':'wb-drop-after');
    });
    root.addEventListener('drop',(e)=>{
      e.preventDefault();
      const w=e.target.closest('.wb-section-wrap');
      root.querySelectorAll('.wb-drop-before,.wb-drop-after').forEach(el=>el.classList.remove('wb-drop-before','wb-drop-after'));
      if(this.draggedPaletteType){
        const type=this.draggedPaletteType;
        let insertAt=this.project.sections.length;
        if(w){
          const idx=this.getSectionIndex(w.dataset.sectionId);
          const rect=w.getBoundingClientRect();
          const before=(e.clientY-rect.top)<rect.height/2;
          insertAt=before?idx:idx+1;
        }
        this.addSection(type,insertAt);
        this.draggedPaletteType=null;
        return;
      }
      if(!w||!this.draggedSectionId)return;
      const tid=w.dataset.sectionId;if(tid===this.draggedSectionId)return;
      const rect=w.getBoundingClientRect();const before=(e.clientY-rect.top)<rect.height/2;
      let fi=this.getSectionIndex(this.draggedSectionId),ti=this.getSectionIndex(tid);if(!before)ti+=1;if(fi<ti)ti-=1;this.reorderSection(fi,ti);
    });

    // Palette items (desktop sidebar "Add Section" list) become drag sources for inserting NEW
    // sections at a precise position, in addition to their existing click-to-append behavior.
    document.querySelectorAll('.wb-palette-item[data-section-type]').forEach(el=>{
      el.setAttribute('draggable','true');
      el.addEventListener('dragstart',(e)=>{
        this.draggedPaletteType=el.dataset.sectionType;
        e.dataTransfer.effectAllowed='copy';
        e.dataTransfer.setData('text/plain',el.dataset.sectionType);
        el.classList.add('wb-palette-dragging');
      });
      el.addEventListener('dragend',()=>{
        el.classList.remove('wb-palette-dragging');
        root.querySelectorAll('.wb-drop-before,.wb-drop-after').forEach(el2=>el2.classList.remove('wb-drop-before','wb-drop-after'));
        this.draggedPaletteType=null;
      });
    });
  },

  bindToolbar() {
    document.getElementById('btn-new')?.addEventListener('click',()=>{if(confirm('Start new project? Unsaved changes will be lost.'))this.newProject();});
    document.getElementById('btn-undo')?.addEventListener('click',()=>this.history.undo());
    document.getElementById('btn-redo')?.addEventListener('click',()=>this.history.redo());
    document.getElementById('btn-save')?.addEventListener('click',()=>Importer.saveProject(this.project));
    document.getElementById('btn-open')?.addEventListener('click',()=>Importer.openProjectDialog());
    document.getElementById('btn-export')?.addEventListener('click',()=>Exporter.exportZip(this.project));
    document.getElementById('btn-blogger')?.addEventListener('click',()=>Exporter.downloadBloggerXml(this.project));
    document.getElementById('btn-import-html')?.addEventListener('click',()=>Importer.openHtmlImportDialog());
    document.querySelectorAll('[data-viewport]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        document.querySelectorAll('[data-viewport]').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const canvas=document.getElementById('wb-canvas');
        canvas.dataset.viewport=btn.dataset.viewport;
        const badge=document.getElementById('wb-viewport-badge');
        const labels={desktop:'🖥  Desktop',tablet:'⬜  Tablet — 820px',mobile:'📱  Mobile — 430px'};
        if(badge)badge.textContent=labels[btn.dataset.viewport]||'';
      });
    });
    document.addEventListener('keydown',(e)=>{
      const ctrl=e.ctrlKey||e.metaKey;
      const inInput=['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName);
      if(ctrl&&e.key.toLowerCase()==='z'&&!e.shiftKey){e.preventDefault();this.history.undo();}
      else if(ctrl&&((e.key.toLowerCase()==='z'&&e.shiftKey)||e.key.toLowerCase()==='y')){e.preventDefault();this.history.redo();}
      else if(ctrl&&e.key.toLowerCase()==='s'){e.preventDefault();Importer.saveProject(this.project);}
      else if((e.key==='Delete'||e.key==='Backspace')&&!inInput){const id=this.project.selectedSectionId;if(id){e.preventDefault();this.deleteSection(id);}}
      else if(e.key==='Escape'&&!inInput){this.selectSection(null);}
    });
    document.querySelectorAll('.wb-palette-item').forEach(el=>{
      el.addEventListener('click',()=>{this.addSection(el.dataset.sectionType);if(window.MobileUI)MobileUI.closeAll();});
    });
  },
};
window.Builder=Builder;
document.addEventListener('DOMContentLoaded',()=>Builder.init());
