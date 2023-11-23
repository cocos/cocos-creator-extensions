// import { ShaderNode, ShaderSlot, ShaderPropery, ShaderEdgeSlot } from '../../base';
// import globby from 'globby';
// import path from 'path';
// import ShaderGraph from '../../shadergraph';
// import SubGraphOutputNode from './SubGraphOutputNode';
// import PropertyNode from '../input/PropertyNode';
// import { ConcretePrecisionType } from '../../type';

import { ShaderNode } from '../../base';
import { register } from '../../../graph';
import { slot } from '../../utils';

@register({
    style: {
        headerColor: '#757575',
    },
})
export default class SubGraphNode extends ShaderNode {
    data = {
        inputs: [
            slot('In', 0, 'any', 'any'),
        ],
        outputs: [
            slot('Out', 0, 'any', 'any'),
        ],
    };

    // nodes: ShaderNode[] = []
    // nodeMap: Map<string, ShaderNode> = new Map
    // properties: ShaderPropery[] = []
    //
    // subgraphOutNode: SubGraphOutputNode | null = null;
    //
    // concretePrecisionType = ConcretePrecisionType.Fixed;
    //
    // constructor (data) {
    //     super(data)
    //
    //     let name = this.data.m_Name;
    //     let subgraphPath = path.join(ShaderGraph.subgraphPath, `**/${name}.*`).replace(/\\/g, '/');
    //     let paths = globby.sync(subgraphPath)
    //     paths = paths.filter(p => path.extname(p).toLowerCase() === '.shadersubgraph')
    //     if (!paths[0]) {
    //         console.error(`Can not find sub graph with name [${name}]`)
    //         return;
    //     }
    //
    //     let res = ShaderGraph.searchNodes(paths[0]);
    //     if (!res) {
    //         return;
    //     }
    //
    //     let { properties, nodeMap, nodes, edges } = res;
    //
    //     this.nodes = nodes;
    //     this.nodeMap = nodeMap;
    //     this.properties = properties;
    //
    //     let subgraphOutNode = nodes.find(n => n instanceof SubGraphOutputNode)
    //     if (!subgraphOutNode) {
    //         console.error(`Can not find SubGraphOutputNode for [${name}]`)
    //         return;
    //     }
    //
    //     this.subgraphOutNode = subgraphOutNode;
    //
    // }
    //
    // excahngeSubGraphOutNode (outputEdgeSlot: ShaderEdgeSlot) {
    //     let outputNode = this as ShaderNode;
    //
    //     let outputSlot = this.slotsMap.get(outputEdgeSlot.id);
    //     let subgraphSlot = this.subgraphOutNode?.getSlotWithSlotName(outputSlot?.displayName);
    //
    //     if (subgraphSlot && subgraphSlot.connectSlot) {
    //         //@ts-ignore
    //         outputNode = subgraphSlot.connectSlot.node;
    //         outputEdgeSlot.id = subgraphSlot.connectSlot.id;
    //         //@ts-ignore
    //         outputEdgeSlot.nodeUuid = subgraphSlot.connectSlot.node?.uuid;
    //         if (outputNode && subgraphSlot) {
    //             subgraphSlot.connectSlots.length = 0;
    //         }
    //     }
    //
    //     return outputNode;
    // }
    //
    // exchangeSubGraphInputNodes () {
    //     let inputSlots = this.inputSlots;
    //
    //     let propertyNodes = this.nodes.filter(n => n instanceof PropertyNode);
    //     propertyNodes.forEach(node => {
    //         let propertySlot = node.outputSlots[0];
    //         let propertyName = propertySlot.displayName;
    //
    //         let inputSlot = inputSlots.find(slot => slot.displayName === propertyName);
    //
    //         if (inputSlot) {
    //             let outputSlot = inputSlot.connectSlot;
    //             if (outputSlot) {
    //                 propertySlot.connectSlots.forEach(inputSlotInSubGraph => {
    //                     inputSlotInSubGraph.connectSlot = outputSlot;
    //                     outputSlot.connectSlots = outputSlot.connectSlots.filter(slot => slot === inputSlot);
    //
    //                     if (outputSlot.node) {
    //                         inputSlotInSubGraph.node?.addDependency(outputSlot.node);
    //                         //@ts-ignore
    //                         outputSlot.node.setPriority(inputSlotInSubGraph.node.priority + 1);
    //                     }
    //                 })
    //
    //                 //@ts-ignore
    //                 inputSlot.connectSlot = null;
    //             }
    //             else {
    //                 propertySlot.connectSlots.forEach(inputSlotInSubGraph => {
    //                     inputSlotInSubGraph.connectSlot = inputSlot!;
    //                     // inputSlot.connectSlots.push(inputSlotInSubGraph);
    //
    //                     if (inputSlot!.node) {
    //                         inputSlotInSubGraph.node?.addDependency(this);
    //                         //@ts-ignore
    //                         this.setPriority(inputSlotInSubGraph.node.priority + 1);
    //                     }
    //                 });
    //             }
    //         }
    //
    //     })
    // }
    //
    // generateCode () {
    //     let code = '';
    //     let inputSlots = this.inputSlots;
    //     for (let i = 0; i < inputSlots.length; i++) {
    //         // if (!inputSlots[i].connectSlot) continue;
    //         code += `${inputSlots[i].varDefine} = ${inputSlots[i].defaultValueStr};\n`;
    //     }
    //     return code;
    // }
}
