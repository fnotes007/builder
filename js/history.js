/**
 * history.js — Unlimited undo/redo (command pattern + state snapshots)
 */
class HistoryManager {
  constructor(onChange) {
    this.undoStack = [];
    this.redoStack = [];
    this.onChange = typeof onChange === 'function' ? onChange : () => {};
  }
  push(label, undoFn, redoFn) {
    this.undoStack.push({ label, undo: undoFn, redo: redoFn });
    this.redoStack = [];
    this._emit();
  }
  canUndo() { return this.undoStack.length > 0; }
  canRedo() { return this.redoStack.length > 0; }
  undo() { if (!this.canUndo()) return false; const cmd = this.undoStack.pop(); cmd.undo(); this.redoStack.push(cmd); this._emit(); return true; }
  redo() { if (!this.canRedo()) return false; const cmd = this.redoStack.pop(); cmd.redo(); this.undoStack.push(cmd); this._emit(); return true; }
  clear() { this.undoStack = []; this.redoStack = []; this._emit(); }
  snapshotCommand(label, getState, setState, mutate) {
    const before = deepClone(getState());
    mutate();
    const after = deepClone(getState());
    this.push(label, () => setState(deepClone(before)), () => setState(deepClone(after)));
  }
  _emit() {
    this.onChange({
      canUndo: this.canUndo(), canRedo: this.canRedo(),
      undoLabel: this.undoStack.length ? this.undoStack[this.undoStack.length-1].label : null,
      redoLabel: this.redoStack.length ? this.redoStack[this.redoStack.length-1].label : null,
    });
  }
}
function deepClone(obj) { if (obj === undefined) return undefined; return JSON.parse(JSON.stringify(obj)); }
window.HistoryManager = HistoryManager;
window.deepClone = deepClone;
