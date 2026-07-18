/**
 * image-editor.js — Canvas-based image crop/resize/optimize
 */
const ImageEditor = {
  canvas: null, ctx: null, img: null, cropBox: null, isDragging: false,
  dragStart: null, originalDataUrl: null, onSave: null,

  open(dataUrl, onSave) {
    this.originalDataUrl = dataUrl;
    this.onSave = onSave;
    const modal = document.getElementById('wb-image-editor-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    this.canvas = document.getElementById('wb-ie-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.img = new Image();
    this.img.onload = () => this.setup();
    this.img.src = dataUrl;
  },

  setup() {
    const maxW = 480, maxH = 340;
    const scale = Math.min(maxW / this.img.width, maxH / this.img.height, 1);
    this.canvas.width = Math.round(this.img.width * scale);
    this.canvas.height = Math.round(this.img.height * scale);
    this.cropBox = { x: 0, y: 0, w: this.canvas.width, h: this.canvas.height };
    this.draw();
    this.bindDrag();
  },

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    const b = this.cropBox;
    ctx.drawImage(this.img, (b.x / this.canvas.width) * this.img.width, (b.y / this.canvas.height) * this.img.height, (b.w / this.canvas.width) * this.img.width, (b.h / this.canvas.height) * this.img.height, b.x, b.y, b.w, b.h);
    ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 2;
    ctx.strokeRect(b.x, b.y, b.w, b.h);
  },

  bindDrag() {
    const b = this.cropBox;
    this.canvas.onmousedown = e => { const r = this.canvas.getBoundingClientRect(); this.isDragging = true; this.dragStart = { x: e.clientX - r.left - b.x, y: e.clientY - r.top - b.y }; };
    this.canvas.onmousemove = e => { if (!this.isDragging) return; const r = this.canvas.getBoundingClientRect(); b.x = Math.max(0, Math.min(e.clientX - r.left - this.dragStart.x, this.canvas.width - b.w)); b.y = Math.max(0, Math.min(e.clientY - r.top - this.dragStart.y, this.canvas.height - b.h)); this.draw(); };
    this.canvas.onmouseup = this.canvas.onmouseleave = () => { this.isDragging = false; };
  },

  applyCrop() {
    const b = this.cropBox;
    const out = document.createElement('canvas');
    out.width = Math.round((b.w / this.canvas.width) * this.img.width);
    out.height = Math.round((b.h / this.canvas.height) * this.img.height);
    out.getContext('2d').drawImage(this.img, (b.x / this.canvas.width) * this.img.width, (b.y / this.canvas.height) * this.img.height, (b.w / this.canvas.width) * this.img.width, (b.h / this.canvas.height) * this.img.height, 0, 0, out.width, out.height);
    const result = out.toDataURL('image/jpeg', 0.88);
    if (this.onSave) this.onSave(result);
    this.close();
    UI.toast('Image cropped', 'success');
  },

  optimize(quality) {
    const out = document.createElement('canvas');
    out.width = this.img.width; out.height = this.img.height;
    out.getContext('2d').drawImage(this.img, 0, 0);
    const result = out.toDataURL('image/jpeg', quality || 0.75);
    if (this.onSave) this.onSave(result);
    this.close();
    UI.toast('Image optimized', 'success');
  },

  close() {
    const modal = document.getElementById('wb-image-editor-modal');
    if (modal) modal.style.display = 'none';
  },
};
window.ImageEditor = ImageEditor;
