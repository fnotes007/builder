/**
 * media-library.js — Media mode: full grid view of Builder.project.assets.
 * Extends the existing asset shape {id,name,dataUrl} with optional folder / isExternal / url / sizeLabel,
 * so it stays backward-compatible with assets added via the Inspector "Assets" tab.
 */
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg)$/i;

const MediaLibrary = {
  folderFilter: '',
  pickerCallback: null,

  init() {
    document.getElementById('wb-media-upload-btn').addEventListener('click', () => {
      document.getElementById('wb-media-upload-input').click();
    });
    document.getElementById('wb-media-upload-input').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      e.target.value = '';
      if (!file) return;
      if (file.size > 4.5 * 1024 * 1024) { UI.toast('Keep uploads under ~4.5MB — this builder stores images as base64 in the project file.', true); return; }
      const dataUrl = await this.fileToDataUrl(file);
      const folder = (prompt('Which folder? (gallery / logos / videos / downloads)', 'gallery') || 'gallery').trim().toLowerCase();
      const asset = { id: uid('asset'), name: file.name.replace(/[^a-zA-Z0-9._-]+/g, '-'), dataUrl, folder, isExternal: false, sizeLabel: this.fmtBytes(file.size) };
      Builder.history.snapshotCommand('Upload Image', () => Builder.project.assets, (s) => { Builder.project.assets = s; },
        () => { Builder.project.assets.push(asset); });
      this.render();
      if (typeof Editor !== 'undefined' && Editor.renderAssetsPanel) Editor.renderAssetsPanel();
      UI.toast('Uploaded.', 'success');
    });
    document.getElementById('wb-media-url-btn').addEventListener('click', () => {
      const url = prompt('Image URL:');
      if (!url || !url.trim()) return;
      const folder = (prompt('Which folder? (gallery / logos / videos / downloads)', 'gallery') || 'gallery').trim().toLowerCase();
      const name = url.split('/').pop().split('?')[0] || 'image';
      const asset = { id: uid('asset'), name, dataUrl: url.trim(), folder, isExternal: true, sizeLabel: 'external' };
      Builder.history.snapshotCommand('Add Image URL', () => Builder.project.assets, (s) => { Builder.project.assets = s; },
        () => { Builder.project.assets.push(asset); });
      this.render();
      if (typeof Editor !== 'undefined' && Editor.renderAssetsPanel) Editor.renderAssetsPanel();
    });
    document.getElementById('wb-media-folder-filter').addEventListener('change', e => {
      this.folderFilter = e.target.value;
      this.render();
    });
  },

  fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(file);
    });
  },

  fmtBytes(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / 1024 / 1024).toFixed(1) + ' MB';
  },

  render() {
    const grid = document.getElementById('wb-media-grid');
    const assets = Builder.project.assets || [];
    const list = assets.filter(a => !this.folderFilter || (a.folder || 'gallery') === this.folderFilter);
    if (!list.length) {
      grid.innerHTML = `<div id="wb-media-empty">No media yet. Upload an image or add one by URL above.<br><br>Everything here is available to pick from when editing any image field across the whole builder — sections, Collections, Blog posts.</div>`;
      return;
    }
    grid.innerHTML = list.map(a => {
      const isImg = IMAGE_EXT.test(a.name) || (!a.isExternal && a.dataUrl && a.dataUrl.startsWith('data:image'));
      return `<div class="wb-media-card" data-id="${a.id}">
        <div class="thumb">${isImg ? `<img src="${a.dataUrl}" alt="">` : `<span class="filetype">${(a.name.split('.').pop() || 'file')}</span>`}</div>
        <div class="meta">
          <div class="fname" title="${escapeHtml(a.name)}">${escapeHtml(a.name)}</div>
          <div class="ftag">${escapeHtml(a.folder || 'gallery')} · ${a.sizeLabel || ''}</div>
        </div>
        <div class="mactions">
          <button class="mrename">Rename</button>
          <button class="mmove">Move</button>
          <button class="mcopy">Copy ref</button>
          <button class="mdel">Delete</button>
        </div>
      </div>`;
    }).join('');
    grid.querySelectorAll('.wb-media-card').forEach(card => {
      const id = card.dataset.id;
      const a = assets.find(x => x.id === id);
      card.querySelector('.mrename').addEventListener('click', (e) => {
        e.stopPropagation();
        const newName = prompt('Rename file:', a.name);
        if (!newName || !newName.trim() || newName.trim() === a.name) return;
        Builder.history.snapshotCommand('Rename Asset', () => Builder.project.assets, (s) => { Builder.project.assets = s; },
          () => { a.name = newName.trim().replace(/[^a-zA-Z0-9._-]+/g, '-'); });
        this.render();
        if (typeof Editor !== 'undefined' && Editor.renderAssetsPanel) Editor.renderAssetsPanel();
      });
      card.querySelector('.mmove').addEventListener('click', (e) => {
        e.stopPropagation();
        const folders = ['gallery', 'logos', 'videos', 'downloads'];
        const current = a.folder || 'gallery';
        const options = folders.map((f, i) => `${i + 1}) ${f}${f === current ? ' (current)' : ''}`).join('\n');
        const choice = prompt(`Move "${a.name}" to which folder?\n${options}\n\nEnter a number, or type a new folder name:`, current);
        if (!choice || !choice.trim()) return;
        const idx = parseInt(choice.trim(), 10);
        const target = (idx >= 1 && idx <= folders.length) ? folders[idx - 1] : choice.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');
        if (!target || target === current) return;
        Builder.history.snapshotCommand('Move Asset', () => Builder.project.assets, (s) => { Builder.project.assets = s; },
          () => { a.folder = target; });
        this.render();
        if (typeof Editor !== 'undefined' && Editor.renderAssetsPanel) Editor.renderAssetsPanel();
      });
      card.querySelector('.mcopy').addEventListener('click', () => {
        navigator.clipboard?.writeText(a.dataUrl).catch(() => {});
        UI.toast('Reference copied to clipboard.', 'success');
      });
      card.querySelector('.mdel').addEventListener('click', () => {
        if (!confirm(`Delete "${a.name}" from the media library?`)) return;
        Builder.history.snapshotCommand('Delete Asset', () => Builder.project.assets, (s) => { Builder.project.assets = s; },
          () => { Builder.project.assets = Builder.project.assets.filter(x => x.id !== id); });
        this.render();
        if (typeof Editor !== 'undefined' && Editor.renderAssetsPanel) Editor.renderAssetsPanel();
      });
      // Click the card itself to use it, when a picker is active
      card.addEventListener('click', (e) => {
        if (e.target.closest('.mactions')) return;
        if (this.pickerCallback) { this.pickerCallback(a.dataUrl); this.pickerCallback = null; UI.toast('Image selected.', 'success'); }
      });
    });
  },

  /** Lets other modules (Collections, Blog) reuse the Media grid to pick an image URL. */
  openPicker(callback) {
    const assets = Builder.project.assets || [];
    if (!assets.length) { UI.toast('No media in your library yet — upload something in the Media tab first.', true); return; }
    this.pickerCallback = callback;
    Modes.switchTo('media');
    UI.toast('Click an image below to select it.', 'success');
  },
};
window.MediaLibrary = MediaLibrary;
