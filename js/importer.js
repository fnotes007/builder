/**
 * importer.js — Save/open .builder projects + re-import exported HTML
 */
const Importer = {
  FORMAT_VERSION: 1,

  saveProject(project) {
    const payload = { __format:'offline-website-builder-pro', __version:this.FORMAT_VERSION, savedAt:new Date().toISOString(), project };
    const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    Exporter.downloadBlob(blob, `${Exporter.slugify(project.meta.title)}.builder`);
    UI.toast('Project saved.','success');
  },

  openProjectDialog() {
    const input = document.createElement('input');
    input.type='file'; input.accept='.builder,application/json';
    input.addEventListener('change',()=>{
      const file=input.files[0]; if(!file)return;
      const reader=new FileReader();
      reader.onload=()=>this.loadProjectFromJson(reader.result);
      reader.onerror=()=>UI.toast('Could not read file.',true);
      reader.readAsText(file);
    });
    input.click();
  },

  loadProjectFromJson(jsonText) {
    let payload;
    try { payload=JSON.parse(jsonText); } catch { UI.toast('Invalid .builder file.',true); return; }
    const project=payload&&payload.project?payload.project:payload;
    if(!this.validateProjectShape(project)){UI.toast('Not a recognized project format.',true);return;}
    this.backfillProjectDefaults(project);
    Builder.project=project;
    Builder.history.clear();
    Builder.renderAll();
    Builder.selectSection(null);
    Editor.renderThemePanel(); Editor.renderAssetsPanel(); Editor.renderSeoPanel();
    UI.toast('Project loaded.','success');
  },

  validateProjectShape(project){return !!(project&&typeof project==='object'&&project.meta&&project.theme&&Array.isArray(project.sections));},

  backfillProjectDefaults(project){
    if(!Array.isArray(project.assets))project.assets=[];
    const metaDef={favicon:'',keywords:'',ogImage:'',robots:'index, follow',canonical:'',description:''};
    Object.keys(metaDef).forEach(k=>{if(project.meta[k]===undefined)project.meta[k]=metaDef[k];});
    const themeDef={fontHeading:'Poppins',fontBody:'Inter',mode:'light',localFonts:[],radius:14,container:1140};
    Object.keys(themeDef).forEach(k=>{if(project.theme[k]===undefined)project.theme[k]=themeDef[k];});
    if(!Array.isArray(project.collections))project.collections=[];
    if(!project.collectionItems||typeof project.collectionItems!=='object')project.collectionItems={};
    if(!Array.isArray(project.forms))project.forms=[];
    if(!Array.isArray(project.posts))project.posts=[];
    if(!project.menu||typeof project.menu!=='object')project.menu={sticky:false,transparent:false,customized:false,items:[]};
    if(!project.siteSettings||typeof project.siteSettings!=='object')project.siteSettings={siteUrl:'',backToTop:false,whatsappEnabled:false,whatsappNumber:'',callEnabled:false,callNumber:'',animQuality:'high',animAutoDetect:true,animAllowDisable:false};
    const siteSettingsDef={animQuality:'high',animAutoDetect:true,animAllowDisable:false,scrollAnimEnabled:true};
    Object.keys(siteSettingsDef).forEach(k=>{if(project.siteSettings[k]===undefined)project.siteSettings[k]=siteSettingsDef[k];});
    project.sections.forEach(section=>{
      const def=window.SectionRegistry&&window.SectionRegistry[section.type];
      if(!def)return;
      const fresh=def.defaultData();
      Object.keys(fresh).forEach(k=>{if(section[k]===undefined)section[k]=fresh[k];});
      if(window.Animations)section.animation=window.Animations.migrate(section.animation);
    });
  },

  openHtmlImportDialog(){
    const input=document.createElement('input');
    input.type='file';input.accept='.html,.htm,text/html';
    input.addEventListener('change',()=>{
      const file=input.files[0];if(!file)return;
      const reader=new FileReader();
      reader.onload=()=>this.importExportedHtml(reader.result);
      reader.readAsText(file);
    });
    input.click();
  },

  importExportedHtml(htmlText){
    const match=htmlText.match(/<!--\s*WBP-DATA:([A-Za-z0-9+/=]+)\s*-->/);
    if(!match){UI.toast('No builder metadata found in this file.',true);return;}
    try{
      const decoded=decodeURIComponent(atob(match[1]).split('').map(c=>'%'+c.charCodeAt(0).toString(16).padStart(2,'0')).join(''));
      const project=JSON.parse(decoded);
      if(!this.validateProjectShape(project))throw new Error('shape mismatch');
      this.backfillProjectDefaults(project);
      Builder.project=project;
      Builder.history.clear();
      Builder.renderAll();
      Builder.selectSection(null);
      Editor.renderThemePanel(); Editor.renderAssetsPanel(); Editor.renderSeoPanel();
      UI.toast('Website re-imported — you can edit it again.','success');
    }catch(err){UI.toast('Could not parse builder metadata.',true);}
  },
};
window.Importer=Importer;
