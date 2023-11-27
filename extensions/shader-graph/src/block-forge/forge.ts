'use strict';

import type {
    GraphElement,
    NodeChangedDetail,
    NodePositionChangedDetail,
    GraphNodeElement,
} from '@itharbors/ui-graph';

import type { DirtyDetail } from './pin';
import { graphMap } from './graph';
import { generateUUID, dispatch } from './utils';
import { GraphMouseEvent, BlockMouseEvent, BlockEvent, LineEvent, LineMouseEvent } from './event';

import {
    Action,
    ActionList,
    ActionQueue,
} from '@itharbors/structures';

import {
    AddBlockAction,
    RemoveBlockAction,
    AddLineAction,
    RemoveLineAction,
    BlockPositionAction,
} from './undo';

import type { GraphData, BlockData, LineData, IGraphDefineEvent } from './interface';

import yaml from 'js-yaml';
import { clearDynamicEnum } from './enum';

const STYLE = /*css*/`
:host { display: flex; flex-direction: column; }
:host > header { padding: 4px 10px; display: flex; }
:host > header > div { flex: 1; }
:host > header > div > span { cursor: pointer; }
:host > header > slot { display: block; }
:host > header > i { margin: 0 4px; }
:host > section { flex: 1; display: flex; }
:host > section > v-graph { flex: 1; }
`;

const HTML = /*html*/`
<style>${STYLE}</style>
<header>
    <div></div>
    <slot></slot>
</header>
<section>
    <v-graph type=""><v-graph>
</section>
`;

export class HTMLGraphForgeElement extends HTMLElement {

    private actionQueue = new ActionQueue({
        forge: this,
    });

    $graph: GraphElement;

    constructor() {
        super();
        this.attachShadow({
            mode: 'open',
        });

        this.shadowRoot!.innerHTML = HTML;

        this.$graph = this.shadowRoot!.querySelector('v-graph')! as GraphElement;

        this._initHeader();
        this._initSection();
    }

    rootGraph?: GraphData;
    paths: GraphData[] = [];

    private _initHeader() {
        this._updateHeader();
        this.shadowRoot!.querySelector('header > div')!.addEventListener('click', (event) => {
            const $span = event.target as HTMLElement;
            if (!$span.hasAttribute('path-index')) {
                return;
            }
            let index = parseInt($span.getAttribute('path-index') || '0');
            if (index < 0) {
                index = 0;
            }
            this.paths.splice(index + 1);
            this._updateGraph();
            const graph = this.paths[this.paths.length - 1];
            dispatch(this, 'enter-graph', {
                detail: {
                    id: graph.name,
                },
            });
        });
    }

    private _updateHeader() {
        const paths = this.paths.map((info, index) => `<span path-index="${index}">${info.name || info.type}</span>`).join('<i>/</i>');
        this.shadowRoot!.querySelector('header > div')!.innerHTML = paths;
    }

    private _initSection() {
        const $graph = this.shadowRoot!.querySelector('v-graph') as GraphElement;
        $graph.shadowRoot!.addEventListener('block-click', (event) => {
            const customEvent = event as CustomEvent<{
            }>;
            const type = this.paths[this.paths.length - 1].type;
            const info = graphMap.get(type);
            if (!info) {
                return;
            }
            const $node = customEvent.target as GraphNodeElement;
            if (info.graph.event && info.graph.event.onBlockClick) {
                const nodes = $graph.getProperty('nodes') as { [uuid: string]: BlockData; };
                const lines = $graph.getProperty('lines') as { [uuid: string]: LineData; };
                const uuid = $node.getAttribute('node-uuid') || '';
                const block = $graph.getProperty('nodes')[uuid] as BlockData;
                const blockEvent = new BlockMouseEvent(nodes, lines, $node, block);
                info.graph.event.onBlockClick(blockEvent);
            }
        });
        $graph.shadowRoot!.addEventListener('block-dblclick', (event) => {
            const customEvent = event as CustomEvent<{
                pageX: number;
                pageY: number;
                offsetX: number;
                offsetY: number;
            }>;
            const type = this.paths[this.paths.length - 1].type;
            const info = graphMap.get(type);
            if (!info) {
                return;
            }
            const $node = customEvent.target as GraphNodeElement;
            if ($node.tagName === 'V-GRAPH-NODE') {
                const details = $node.getProperty('details');
                if (details.subGraph) {
                    this.enterSubGraph(details.subGraph);
                    return;
                }
            }
            if (info.graph.event && info.graph.event.onBlockDblClick) {
                const nodes = $graph.getProperty('nodes') as { [uuid: string]: BlockData; };
                const lines = $graph.getProperty('lines') as { [uuid: string]: LineData; };
                const uuid = $node.getAttribute('node-uuid') || '';
                const block = $graph.getProperty('nodes')[uuid] as BlockData;
                const blockEvent = new BlockMouseEvent(nodes, lines, $node, block);
                blockEvent.initPagePosition(customEvent.detail.pageX, customEvent.detail.pageY);
                const graphPosition = $graph.convertCoordinate(customEvent.detail.offsetX, customEvent.detail.offsetY);
                blockEvent.initGraphPosition(graphPosition.x, graphPosition.y);
                info.graph.event.onBlockDblClick(blockEvent);
            }
        });
        $graph.shadowRoot!.addEventListener('block-right-click', (event) => {
            const customEvent = event as CustomEvent<{
            }>;
            const type = this.paths[this.paths.length - 1].type;
            const info = graphMap.get(type);
            if (!info) {
                return;
            }
            const $node = customEvent.target as GraphNodeElement;
            if (info.graph.event && info.graph.event.onBlockRightClick) {
                const nodes = $graph.getProperty('nodes') as { [uuid: string]: BlockData; };
                const lines = $graph.getProperty('lines') as { [uuid: string]: LineData; };
                const uuid = $node.getAttribute('node-uuid') || '';
                const block = $graph.getProperty('nodes')[uuid] as BlockData;
                const blockEvent = new BlockMouseEvent(nodes, lines, $node, block);
                info.graph.event.onBlockRightClick(blockEvent);
            }
        });

        $graph.addEventListener('node-selected', (event) => {
            const type = this.paths[this.paths.length - 1].type;
            const info = graphMap.get(type);
            if (!info) {
                return;
            }
            const $node = event.target as GraphNodeElement;
            if (info.graph.event && info.graph.event.onBlockSelected) {
                const nodes = $graph.getProperty('nodes') as { [uuid: string]: BlockData; };
                const lines = $graph.getProperty('lines') as { [uuid: string]: LineData; };
                const uuid = $node.getAttribute('node-uuid') || '';
                const block = $graph.getProperty('nodes')[uuid] as BlockData;
                const event = new BlockEvent(nodes, lines, $node, block);
                info.graph.event.onBlockSelected(event);
            }
        });
        $graph.addEventListener('node-unselected', (event) => {
            const type = this.paths[this.paths.length - 1].type;
            const info = graphMap.get(type);
            if (!info) {
                return;
            }
            const $node = event.target as GraphNodeElement;
            if (info.graph.event && info.graph.event.onBlockUnselected) {
                const nodes = $graph.getProperty('nodes') as { [uuid: string]: BlockData; };
                const lines = $graph.getProperty('lines') as { [uuid: string]: LineData; };
                const uuid = $node.getAttribute('node-uuid') || '';
                const block = $graph.getProperty('nodes')[uuid] as BlockData;
                const event = new BlockEvent(nodes, lines, $node, block);
                info.graph.event.onBlockUnselected(event);
            }
        });
        $graph.addEventListener('line-selected', (event) => {
            const type = this.paths[this.paths.length - 1].type;
            const info = graphMap.get(type);
            if (!info) {
                return;
            }
            const $g = event.target as SVGGElement;
            if (info.graph.event && info.graph.event.onLineSelected) {
                const nodes = $graph.getProperty('nodes') as { [uuid: string]: BlockData; };
                const lines = $graph.getProperty('lines') as { [uuid: string]: LineData; };
                const uuid = $g.getAttribute('line-uuid') || '';
                const line = lines[uuid] as LineData;
                const event = new LineEvent(nodes, lines, $g, line);
                info.graph.event.onLineSelected(event);
            }
        });
        $graph.addEventListener('line-unselected', (event) => {
            const type = this.paths[this.paths.length - 1].type;
            const info = graphMap.get(type);
            if (!info) {
                return;
            }
            const $g = event.target as SVGGElement;
            if (info.graph.event && info.graph.event.onLineUnselected) {
                const nodes = $graph.getProperty('nodes') as { [uuid: string]: BlockData; };
                const lines = $graph.getProperty('lines') as { [uuid: string]: LineData; };
                const uuid = $g.getAttribute('line-uuid') || '';
                const line = lines[uuid] as LineData;
                const event = new LineEvent(nodes, lines, $g, line);
                info.graph.event.onLineUnselected(event);
            }
        });
        $graph.addEventListener('node-added', (event) => {
            const cEvent = event as CustomEvent<NodeChangedDetail>;
            dispatch(this, 'node-added', {
                detail: cEvent.detail,
            });
            dispatch(this, 'dirty');
        });
        $graph.addEventListener('node-removed', (event) => {
            const cEvent = event as CustomEvent<NodeChangedDetail>;
            dispatch(this, 'node-removed', {
                detail: cEvent.detail,
            });
            dispatch(this, 'dirty');
        });
        $graph.addEventListener('node-changed', (event) => {
            const cEvent = event as CustomEvent<NodeChangedDetail>;
            dispatch(this, 'node-changed', {
                detail: cEvent.detail,
            });
            dispatch(this, 'dirty');
        });
        $graph.addEventListener('node-position-changed', (event) => {
            const cEvent = event as CustomEvent<NodePositionChangedDetail>;
            const queue = cEvent.detail.moveList.map((item) => {
                return new BlockPositionAction({
                    blockName: item.id,
                    target: item.target,
                    source: item.source,
                });
            });
            if (queue.length === 1) {
                this.actionQueue.exec(queue[0]);
            } else if (queue.length > 1) {
                this.actionQueue.exec(new ActionList({
                    queue,
                }));
            }
            dispatch(this, 'dirty', {
                detail: {
                    dirtyType: 'position-changed',
                },
            });
        });
        // //// ////
        $graph.shadowRoot.addEventListener('dirty', (event) => {
            const cEvent = event as CustomEvent<DirtyDetail>;
            if (cEvent.detail && cEvent.detail.action) {
                this.actionQueue.exec(cEvent.detail.action);
            }
            dispatch(this, 'dirty', {
                detail: cEvent.detail,
            });
        });

        $graph.addEventListener('mouseup', (event) => {
            const info = graphMap.get(this.rootGraph!.type);
            if (!info) {
                return;
            }
            if ((event as MouseEvent).button === 2 && info.graph.event?.onGraphRightClick) {
                const nodes = $graph.getProperty('nodes') as { [uuid: string]: BlockData; };
                const lines = $graph.getProperty('lines') as { [uuid: string]: LineData; };
                const graphPosition = $graph.convertCoordinate(event.offsetX, event.offsetY);
                const customEvent = new GraphMouseEvent(nodes, lines, $graph, this);
                customEvent.initPagePosition(event.pageX, event.pageY);
                customEvent.initGraphPosition(graphPosition.x, graphPosition.y);
                info.graph.event.onGraphRightClick(customEvent);
            }
        });

        $graph.addEventListener('line-added', (event) => {
            const customEment = event as CustomEvent<{line: LineData}>;
            const $node = $graph.queryNodeElement(customEment.detail.line.output.node);
            if ($node) {
                // @ts-ignore
                $node.onUpdate && $node.onUpdate();
            }
            dispatch(this, 'line-added', {
                detail: customEment.detail,
            });
            dispatch(this, 'dirty');
        });
        $graph.addEventListener('line-removed', (event) => {
            const customEment = event as CustomEvent<{line: LineData}>;
            const $node = $graph.queryNodeElement(customEment.detail.line.output.node);
            if ($node) {
                // @ts-ignore
                $node.onUpdate && $node.onUpdate();
            }
            dispatch(this, 'line-removed', {
                detail: customEment.detail,
            });
            dispatch(this, 'dirty');
        });
        $graph.addEventListener('line-changed', (event) => {
            const customElement = event as CustomEvent<{line: LineData}>;
            dispatch(this, 'line-changed', {
                detail: customElement.detail,
            });
            dispatch(this, 'dirty');
        });

        $graph.addEventListener('node-connected', (event) => {
            const customElement = event as CustomEvent<{line: LineData}>;
            this.startRecording();
            this.addLine(customElement.detail.line);
            setTimeout(() => {
                this.stopRecording();
            }, 200);
        });

        const $svg = $graph.shadowRoot.querySelector('#lines')!;
        function searchG(htmlArray: (HTMLElement | SVGGElement)[]) {
            const length = Math.min(htmlArray.length, 4);
            for (let i = 0; i < length; i++) {
                const $elem = htmlArray[i];
                // 如果找到顶部的 document 元素的话，是没有 tagName 的
                if ($elem.tagName && $elem.tagName.toLocaleLowerCase() === 'g') {
                    return $elem as SVGGElement;
                }
            }
        }
        $svg.addEventListener('dblclick', (event) => {
            // @ts-ignore
            const $g = searchG(event.path);
            if (!$g || !$g.hasAttribute('line-uuid')) {
                return;
            }
            const type = this.paths[this.paths.length - 1].type;
            const info = graphMap.get(type);
            if (!info) {
                return;
            }
            if (info.graph.event && info.graph.event.onLineDblClick) {
                const nodes = $graph.getProperty('nodes') as { [uuid: string]: BlockData; };
                const lines = $graph.getProperty('lines') as { [uuid: string]: LineData; };
                const uuid = $g.getAttribute('line-uuid') || '';
                const line = lines[uuid] as LineData;
                const event = new LineMouseEvent(nodes, lines, $g, line);
                info.graph.event.onLineDblClick(event);
            }
        });
        $svg.addEventListener('click', (event) => {
            // @ts-ignore
            const $g = searchG(event.path);
            if (!$g || !$g.hasAttribute('line-uuid')) {
                return;
            }
            const type = this.paths[this.paths.length - 1].type;
            const info = graphMap.get(type);
            if (!info) {
                return;
            }
            if (info.graph.event && info.graph.event.onLineClick) {
                const nodes = $graph.getProperty('nodes') as { [uuid: string]: BlockData; };
                const lines = $graph.getProperty('lines') as { [uuid: string]: LineData; };
                const uuid = $g.getAttribute('line-uuid') || '';
                const line = lines[uuid] as LineData;
                const event = new LineMouseEvent(nodes, lines, $g, line);
                info.graph.event.onLineClick(event);
            }
        });
        $svg.addEventListener('mouseup', (event) => {
            // @ts-ignore
            const $g = searchG(event.path);
            if (!$g || !$g.hasAttribute('line-uuid')) {
                return;
            }
            if ((event as MouseEvent).button !== 2) {
                return;
            }

            const type = this.paths[this.paths.length - 1].type;
            const info = graphMap.get(type);
            if (!info) {
                return;
            }
            if (info.graph.event && info.graph.event.onLineRightClick) {
                const nodes = $graph.getProperty('nodes') as { [uuid: string]: BlockData; };
                const lines = $graph.getProperty('lines') as { [uuid: string]: LineData; };
                const uuid = $g.getAttribute('line-uuid') || '';
                const line = lines[uuid] as LineData;
                const event = new LineMouseEvent(nodes, lines, $g, line);
                info.graph.event.onLineRightClick(event);
            }
        });
    }

    private _updateGraph() {
        clearDynamicEnum();
        const graph = this.paths[this.paths.length - 1];
        const $graph = this.shadowRoot!.querySelector('v-graph')! as GraphElement;
        $graph.clear();
        requestAnimationFrame(() => {
            $graph.setAttribute('type', graph.type);
            $graph.setProperty('lines', graph.lines);
            $graph.setProperty('nodes', graph.nodes);
            this._updateHeader();
        });
    }

    public undo() {
        this.actionQueue.undo();
        dispatch(this, 'undo');
    }

    public redo() {
        this.actionQueue.redo();
        dispatch(this, 'redo');
    }

    public startRecording() {
        this.actionQueue.startRecording();
    }

    public stopRecording() {
        this.actionQueue.stopRecording();
    }

    public getPinElement(blockName: string, type: 'input' | 'output', index: number) {
        const $block = this.$graph.shadowRoot.querySelector(`v-graph-node[node-uuid=${blockName}]`);
        if (!$block) {
            return;
        }
        const $pinList = $block.shadowRoot!.querySelectorAll(`.pin.in`);
        const $pin = $pinList[index];
        return $pin;
    }

    public getBlockElement(blockName: string) {
        return this.$graph.shadowRoot.querySelector(`v-graph-node[node-uuid=${blockName}]`) as GraphNodeElement;
    }

    /// ---- 操作整个图

    /**
     * 将屏幕坐标转换成 Graph 内的坐标
     * @param point
     * @returns
     */
    convertCoordinate(point: { x: number, y: number }) {
        point = this.$graph.convertCoordinate(point.x, point.y);
        return point;
    }

    /**
     * 设置编辑的根图
     * @param graph
     */
    setRootGraph(graph: GraphData) {
        this.rootGraph = graph;
        this.paths = [graph];
        this._updateGraph();
    }

    /**
     * 获取正在编辑的根图
     * @returns
     */
    getRootGraph(): GraphData {
        return this.paths[0];
    }

    /**
     * 传入一个字符串，反序列化成图数据
     * @param content
     * @returns
     */
    deserialize(content: string): GraphData {
        const graphData = yaml.load(content) as GraphData;
        return graphData;
    }

    /**
     * 传入一个图数据，序列化成 yaml 字符串
     * @param data
     * @returns
     */
    serialize(data?: GraphData): string {
        const str = yaml.dump(data || this.paths[0]);
        // return JSON.stringify(this.paths[0]);
        // outputFileSync('/Users/wangsijie/Project/Creator/cocos-editor/extension-repos/shader-graph/test.yaml', str);
        return str;
    }

    /**
     * 获取整个图现在的一些基础数据
     * @returns
     */
    getGraphInfo() {
        const offset = this.$graph.getProperty('offset');
        const scale = this.$graph.getProperty('scale');
        return {
            offset, scale,
        };
    }

    /**
     * 设置整个图的一些基础数据
     * @param info
     */
    setGraphInfo(info: { offset: { x: number, y: number, }, scale: number}) {
        this.$graph.setProperty('offset', info.offset);
        this.$graph.setProperty('scale', info.scale);
    }

    /**
     * 恢复缩放比例
     */
    zoomToFit() {
        this.$graph.data.setProperty('scale', 1);
    }

    /// ---- 操作当前图

    /**
     * 获取选中的 Block 列表
     * @returns
     */
    getSelectedBlockList() {
        return this.$graph.getSelectedNodeList();
    }

    /**
     * 获取选中的 Line 列表
     * @returns
     */
    getSelectedLineList() {
        return this.$graph.getSelectedLineList();
    }

    /**
     * 设置当前正在编辑的图数据
     * @param graph
     * @returns
     */
    setCurrentGraph(graph: GraphData) {
        if (this.paths.length <= 1) {
            this.setRootGraph(graph);
            return;
        }
        this.paths[this.paths.length - 1] = graph;
        this._updateGraph();
    }

    /**
     * 获取正在编辑的图数据
     * @returns
     */
    getCurrentGraph() {
        return this.paths[this.paths.length - 1];
    }

    /**
     * 在当前正在操作的图数据里增加一个 Block
     * @param block
     * @param id
     */
    addBlock(block: BlockData, id?: string) {
        this.actionQueue.exec(new AddBlockAction({ block, id }));
    }

    /**
     * 在当前正在操作的图数据里删除一个节点
     * @param id
     */
    removeBlock(id: string) {
        const queue: Action[] = [];
        // remove line
        const lines = this.$graph.getProperty('lines') as { [uuid: string]: LineData; };
        for (const key in lines) {
            const line = lines[key] as LineData;
            if (line.input.node === id || line.output.node === id) {
                queue.push(new RemoveLineAction({ id: key }));
            }
        }
        queue.push(new RemoveBlockAction({ id }));
        this.actionQueue.exec(new ActionList({
            queue,
        }));
    }

    /**
     * 在当前正在操作的图数据里增加一个连线
     * @param line
     * @param id
     */
    addLine(line: LineData, id?: string) {
        this.actionQueue.exec(new AddLineAction({ line, id }));
    }

    /**
     * 在当前正在操作的图数据里删除一个连线
     * @param id
     */
    removeLine(id: string) {
        this.actionQueue.exec(new RemoveLineAction({ id }));
    }

    /**
     * 进入当前图的子图
     * @param id
     */
    enterSubGraph(id: string) {
        const graph = this.paths[this.paths.length - 1];
        const subGraph = graph.graphs[id];
        if (subGraph) {
            this.paths.push(subGraph);
            this._updateGraph();
        }
        dispatch(this, 'enter-graph', {
            detail: {
                id: id,
            },
        });
    }

    /**
     * 在当前编辑的图里增加一个子图
     * @param type
     * @param id
     * @returns
     */
    addSubGraph(type: string, id: string) {
        const info = this.paths[this.paths.length - 1];
        // const uuid = generateUUID();
        info.graphs[id] = {
            type,
            name: type,
            nodes: {},
            lines: {},
            graphs: {},
        } as GraphData;

        return info.graphs[id];
    }

    /**
     * 在当前编辑的图里，删除一个子图
     * @param id
     */
    removeSubGraph(id: string) {
        const info = this.paths[this.paths.length - 1];
        delete info.graphs[id];
    }
}

if (!window.customElements.get('ui-graph-forge')) {
    window.customElements.define('ui-graph-forge', HTMLGraphForgeElement);
}
