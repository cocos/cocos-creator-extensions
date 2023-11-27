import type { BlockData } from '../../../block-forge/interface';

import { BlockMouseEvent, GraphMouseEvent, LineMouseEvent } from '../../../block-forge/event';
import { GraphEditorMgr, GraphEditorOtherOptions } from '../../base';
import { SUB_GRAPH_NODE_TYPE } from '../../global-exports';

export function getBaseMenuItem(event: BlockMouseEvent | GraphMouseEvent | LineMouseEvent, popupCreateMenu: () => void): Editor.Menu.ContextMenuItem[] {
    let uuid = '';
    let data: BlockData;
    let isLine = false;
    const isMulti = false;
    let isGroup = false;

    const options: GraphEditorOtherOptions[] = [];
    if (event instanceof BlockMouseEvent) {
        isGroup = event.block.type === SUB_GRAPH_NODE_TYPE;
        uuid = event.target.getAttribute('node-uuid') || '';
        options.push({
            uuid: uuid,
            blockData: event.block,
        });
    } else if (event instanceof LineMouseEvent) {
        uuid = event.target.parentElement?.getAttribute('line-uuid') || '';
        options.push({
            uuid: uuid,
            lineData: event.line,
        });
        isLine = true;
    }

    return [
        {
            label: Editor.I18n.t('shader-graph.right_menu.create_node'),
            enabled: !uuid,
            visible: !isLine,
            accelerator: 'Space',
            click: () => {
                popupCreateMenu();
            },
        },
        { type: 'separator' },
        {
            label: Editor.I18n.t('shader-graph.right_menu.paste'),
            enabled: !GraphEditorMgr.Instance.clipboardIsNull && uuid === '' && !isLine,
            accelerator: 'CmdOrCtrl+V',
            visible: !isLine,
            click: () => {
                GraphEditorMgr.Instance.paste();
            },
        },
        {
            label: Editor.I18n.t('shader-graph.right_menu.delete'),
            accelerator: 'Delete',
            enabled: uuid !== '',
            click: () => {
                GraphEditorMgr.Instance.delete( options);
            },
        },
        {
            label: Editor.I18n.t('shader-graph.right_menu.copy'),
            accelerator: 'CmdOrCtrl+C',
            enabled: uuid !== '' && !isLine,
            visible: !isLine,
            click: () => {
                GraphEditorMgr.Instance.copy(options);
            },
        },
        {
            label: Editor.I18n.t('shader-graph.right_menu.duplicate'),
            accelerator: 'CmdOrCtrl+D',
            enabled: uuid !== '' && !isLine,
            visible: !isLine,
            click: () => {
                GraphEditorMgr.Instance.duplicate(options);
            },
        },
        { type: 'separator' },
        {
            label: Editor.I18n.t('shader-graph.right_menu.zoom_to_fit'),
            enabled: uuid === '',
            visible: !isLine,
            click: () => {
                GraphEditorMgr.Instance.zoomToFit();
            },
        },
        {
            label: Editor.I18n.t('shader-graph.right_menu.reset'),
            enabled: uuid === '',
            visible: !isLine,
            click: () => {
                GraphEditorMgr.Instance.reset();
            },
        },
    ];
}

