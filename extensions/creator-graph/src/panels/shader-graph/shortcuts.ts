import { GraphAssetMgr, GraphEditorMgr, MaskMgr } from '../../shader-graph';

export function onSave() {
    if (!MaskMgr.Instance.ready) return;

    GraphAssetMgr.Instance.save();
}
export function onDelete() {
    if (!MaskMgr.Instance.ready) return;

    GraphEditorMgr.Instance.delete();
}
export function onCopy() {
    if (!MaskMgr.Instance.ready) return;

    GraphEditorMgr.Instance.copy();
}
export function onCut() {
    if (!MaskMgr.Instance.ready) return;

    GraphEditorMgr.Instance.cut();
}
export function onPaste() {
    if (!MaskMgr.Instance.ready) return;

    GraphEditorMgr.Instance.paste();
}
export function onDuplicate() {
    if (!MaskMgr.Instance.ready) return;

    GraphEditorMgr.Instance.duplicate();
}

export function onUndo() {
    if (!MaskMgr.Instance.ready) return;
    GraphEditorMgr.Instance.undo();
}

export function onRedo() {
    if (!MaskMgr.Instance.ready) return;
    GraphEditorMgr.Instance.redo();
}
