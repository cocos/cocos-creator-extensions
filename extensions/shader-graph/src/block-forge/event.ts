'use strict';

import type { GraphNodeElement } from '@itharbors/ui-graph/dist/element/graph-node';
import type { GraphElement } from '@itharbors/ui-graph/dist/element/graph';
import type { HTMLGraphForgeElement } from './forge';
import type { GraphData, BlockData, LineData } from './interface';

type TNodeMap = {
    [key: string]: BlockData;
};

type TLineMap = {
    [key: string]: LineData;
};

class CustomEvent {

    blocks: TNodeMap;
    lines: TLineMap;

    constructor(blocks: TNodeMap, lines: TLineMap) {
        this.blocks = blocks;
        this.lines = lines;
    }
}

class MouseEvent extends CustomEvent {
    // 点击点在页面的坐标
    pageX = 0;
    pageY = 0;

    // 点击点在 Graph 里的坐标
    graphX = 0;
    graphY = 0;

    constructor(
        blocks: TNodeMap,
        lines: TLineMap,
    ) {
        super(blocks, lines);
    }

    initPagePosition(x: number, y: number) {
        this.pageX = x;
        this.pageY = y;
    }

    initGraphPosition(x: number, y: number) {
        this.graphX = x;
        this.graphY = y;
    }
}

export class GraphMouseEvent extends MouseEvent {
    target: GraphElement;
    forge: HTMLGraphForgeElement;

    constructor(
        blocks: TNodeMap,
        lines: TLineMap,
        target: GraphElement,
        forge: HTMLGraphForgeElement,
    ) {
        super(blocks, lines);
        this.target = target;
        this.forge = forge;
    }
}

export class BlockMouseEvent extends MouseEvent {
    block: BlockData;
    target: GraphNodeElement;
    constructor(
        blocks: TNodeMap,
        lines: TLineMap,
        target: GraphNodeElement,
        block: BlockData,
    ) {
        super(blocks, lines);
        this.block = block;
        this.target = target;
    }
}

export class LineMouseEvent extends MouseEvent {
    target: SVGGElement;
    line: LineData;
    constructor(
        blocks: TNodeMap,
        lines: TLineMap,
        target: SVGGElement,
        line: LineData,
    ) {
        super(blocks, lines);
        this.line = line;
        this.target = target;
    }
}

export class BlockEvent extends CustomEvent{
    block: BlockData;
    target: GraphNodeElement;
    constructor(
        blocks: TNodeMap,
        lines: TLineMap,
        target: GraphNodeElement,
        block: BlockData,
    ) {
        super(blocks, lines);
        this.block = block;
        this.target = target;
    }
}

export class LineEvent extends CustomEvent {
    line: LineData;
    target: SVGGElement;
    constructor(
        blocks: TNodeMap,
        lines: TLineMap,
        target: SVGGElement,
        line: LineData,
    ) {
        super(blocks, lines);
        this.line = line;
        this.target = target;
    }
}
