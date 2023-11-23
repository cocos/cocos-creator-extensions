'use strict';

import type { HTMLGraphForgeElement } from './forge';
import type { GraphData, BlockData, LineData, IGraphDefineEvent } from './interface';

import {
    Action,
    ActionQueue,
} from '@itharbors/structures';

// ---------
export function setRootGraph() {

}

export function setGraphInfo() {

}

export function zoomToFit() {

}

export function setCurrentGraph() {

}

// ---------
export class BlockPositionAction extends Action<{
    blockName: string;
    source: { x: number, y: number },
    target: { x: number, y: number },
}> {
    exec(params: {
        forge: HTMLGraphForgeElement
    }) {
        const $node = params.forge.getBlockElement(this.detail.blockName);
        if ($node) {
            $node.setProperty('position', this.detail.target);
        }
    }
    revertAction() {
        return new BlockPositionAction({
            blockName: this.detail.blockName,
            source: this.detail.target,
            target: this.detail.source,
        });
    }
}

export class AddBlockAction extends Action<{
    block: BlockData;
    id?: string;
}> {
    exec(params: {
        forge: HTMLGraphForgeElement
    }) {
        this.detail.id = params.forge.$graph.addNode(this.detail.block, this.detail.id);
    }
    revertAction(): RemoveBlockAction {
        return new RemoveBlockAction({
            id: this.detail.id!,
        }, this);
    }
}

export class RemoveBlockAction extends Action<{
    id: string;
}> {
    private blockData?: BlockData;
    exec(params: {
        forge: HTMLGraphForgeElement
    }) {
        this.blockData = params.forge.$graph.removeNode(this.detail.id);
    }
    revertAction(): AddBlockAction {
        return new AddBlockAction({
            block: this.blockData!,
            id: this.detail.id,
        }, this);
    }
}

export class AddLineAction extends Action<{
    line: LineData;
    id?: string;
}> {
    exec(params: {
        forge: HTMLGraphForgeElement
    }) {
        this.detail.id = params.forge.$graph.addLine(this.detail.line, this.detail.id);
    }
    revertAction(): RemoveLineAction {
        return new RemoveLineAction({
            id: this.detail.id!,
        }, this);
    }
}

export class RemoveLineAction extends Action<{
    id: string;
}> {
    private lineData?: LineData;
    exec(params: {
        forge: HTMLGraphForgeElement
    }) {
        this.lineData = params.forge.$graph.removeLine(this.detail.id) as LineData;
    }
    revertAction(): AddLineAction {
        return new AddLineAction({
            line: this.lineData!,
            id: this.detail.id,
        }, this);
    }
}

export function enterSubGraph() {

}
export function exitSubGraph() {

}
export function addSubGraph() {

}
export function removeSubGraph() {

}
