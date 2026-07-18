/**
 * ui.js — Toast notifications + toolbar button state
 */
const UI = {
  toast(message, type) {
    const container = document.getElementById('wb-toast-container');
    if (!container) { console.log('[Toast]', message); return; }
    const el = document.createElement('div');
    el.className = 'wb-toast';
    if (type === true || type === 'error') el.classList.add('wb-toast-error');
    if (type === 'success') el.classList.add('wb-toast-success');
    el.textContent = message;
    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add('wb-toast-show'));
    setTimeout(() => { el.classList.remove('wb-toast-show'); setTimeout(() => el.remove(), 260); }, 3000);
  },
  updateHistoryButtons(state) {
    const u = document.getElementById('btn-undo');
    const r = document.getElementById('btn-redo');
    if (u) { u.disabled = !state.canUndo; u.title = state.canUndo ? 'Undo: ' + state.undoLabel : 'Nothing to undo'; }
    if (r) { r.disabled = !state.canRedo; r.title = state.canRedo ? 'Redo: ' + state.redoLabel : 'Nothing to redo'; }
  },
};
window.UI = UI;
