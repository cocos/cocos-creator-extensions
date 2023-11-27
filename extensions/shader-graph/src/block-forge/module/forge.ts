'use strict';

import type { BlockData, GraphData, PinData, IPinDescription, IBlockDescription } from '../interface';

import { blockMap } from '../block';

const graphWeakMap: WeakMap<GraphData, Graph> = new WeakMap();
const blockWeakMap: WeakMap<BlockData, Block> = new WeakMap();
const pinWeakMap: WeakMap<PinData, Pin> = new WeakMap();

export class Forge {
    rootGraphData: GraphData;

    constructor(graph: GraphData) {
        this.rootGraphData = graph;
    }

    get details() {
        return this.rootGraphData.details;
    }

    getGraph() {
        const graphData = this.rootGraphData;
        if (!graphWeakMap.has(graphData)) {
            graphWeakMap.set(graphData, new Graph(graphData));
        }
        return graphWeakMap.get(graphData)!;
    }
}

export class Graph {
    graph: GraphData;

    constructor(graph: GraphData) {
        this.graph = graph;

        // 生成数据
        this.getBlockMap();

        // 整理 line 数据
        const nodeMap = this.graph.nodes;
        const lineMap = this.graph.lines;
        for (const uuid in lineMap) {
            const line = lineMap[uuid];

            const inputNode = nodeMap[line.input.node];
            const outputNode = nodeMap[line.output.node];

            const inputBlock = blockWeakMap.get(inputNode);
            const outputBlock = blockWeakMap.get(outputNode);

            inputBlock?.getOutputPinsList();
            outputBlock?.getInputPinsList();
            const inputPin = inputBlock?.getOutputPin(line.input.param);
            const outPin = outputBlock?.getInputPin(line.output.param);

            if (outPin) {
                inputPin!.connectPins.push(outPin);
            }
            if (inputPin) {
                outPin!.connectPins.push(inputPin);
            }
        }
    }

    get details() {
        return this.graph.details;
    }

    getSubGraphMap() {
        const data: { [uuid: string]: Graph } = {};
        for (const uuid in this.graph.graphs) {
            const graphData = this.graph.graphs[uuid];
            if (!graphWeakMap.has(graphData)) {
                graphWeakMap.set(graphData, new Graph(graphData));
            }
            const graph = graphWeakMap.get(graphData)!;
            data[uuid] = graph;
        }
        return data;
    }

    getBlockMap() {
        const data: { [uuid: string]: Block } = {};
        for (const uuid in this.graph.nodes) {
            const blockData = this.graph.nodes[uuid];
            if (!blockWeakMap.has(blockData)) {
                blockWeakMap.set(blockData, new Block(this, uuid, blockData));
            }
            const block = blockWeakMap.get(blockData)!;
            data[uuid] = block;
        }
        return data;
    }
}

export class Block {
    uuid: string;
    graph: Graph;
    block: BlockData;
    desc?: IBlockDescription;

    constructor(graph: Graph, uuid: string, block: BlockData) {
        this.graph = graph;
        this.uuid = uuid;
        this.block = block;
        this.desc = blockMap.get(this.block.type);

        this.getInputPinsList();
        this.getOutputPinsList();
    }

    get details() {
        return this.block.details;
    }

    getInputPin(tag: string) {
        const inputPins = this.desc?.inputPins || [];

        for (let index = 0; index < inputPins.length; index++) {
            const pinDesc = inputPins[index];
            if (pinDesc.tag === tag) {
                const pin = this.block.details.inputPins![index];
                return pinWeakMap.get(pin);
            }
        }
    }

    getOutputPin(tag: string) {
        const outputPins = this.desc?.outputPins || [];

        for (let index = 0; index < outputPins.length; index++) {
            const pin = outputPins[index];
            if (pin.tag === tag) {
                const pin = this.block.details.outputPins![index];
                return pinWeakMap.get(pin);
            }
        }
    }

    getInputPinsList() {
        const inputPins = this.block.details.inputPins || [];
        const blockDesc = this.desc || {inputPins: []};

        return inputPins.map((pinData, index) => {
            if (!pinWeakMap.has(pinData)) {
                pinWeakMap.set(pinData, new Pin(PinD.input, this, pinData, blockDesc.inputPins[index]));
            }
            return pinWeakMap.get(pinData)!;
        });
    }

    getOutputPinsList() {
        const outputPins = this.block.details.outputPins || [];
        const blockDesc = this.desc || {outputPins: []};
        return outputPins.map((pinData, index) => {
            if (!pinWeakMap.has(pinData)) {
                pinWeakMap.set(pinData, new Pin(PinD.output, this, pinData, blockDesc.outputPins[index]));
            }
            return pinWeakMap.get(pinData)!;
        });
    }
}

export enum PinD {
    'input',
    'output',
}

export class Pin {
    block: Block;
    value: PinData;
    desc: IPinDescription;

    type: PinD;

    connectPins: Pin[] = [];

    constructor(dir: PinD, block: Block, pin: PinData, desc: IPinDescription) {
        this.type = dir;
        this.block = block;
        this.desc = desc;
        this.value = pin;
    }
}

// setTimeout(() => {

//     const forge = new Forge(json);

//     const igraph = forge.getGraph();
//     const iblockMap = igraph.getBlockMap();
//     const iinputList = iblockMap[Object.keys(iblockMap)[0]].getInputPinsList();
//     iinputList;

//     const connectPin = iinputList[0].connectPin;

// }, 2000);
