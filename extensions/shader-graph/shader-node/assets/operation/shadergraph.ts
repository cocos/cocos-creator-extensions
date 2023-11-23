// import { ShaderPropery, ShaderNode, ShaderEdge, resetGlobalShaderSlotID } from "./base";
// import { getJsonObject } from "./utils";
// import { createNode } from "./nodes";
// import MasterNode from "./nodes/master/MasterNode";
// import SubGraphNode from "./nodes/subgraph/SubGraphNode";

// import fs from 'fs'
// import PropertyNode from "./nodes/input/PropertyNode";

// export default class ShaderGraph {
//     static subgraphPath = ''

//     static allNodes: ShaderNode[][] = [];

//     static searchNodes (graphPath: string) {
//         let contentStr = fs.readFileSync(graphPath, 'utf-8');
//         let content = getJsonObject(contentStr);
//         if (!content) return;

//         let properties: ShaderPropery[] = content.m_SerializedProperties.map(d => new ShaderPropery(d));
//         let nodeMap: Map<string, ShaderNode> = new Map;

//         let propertyNodeMap: Map<ShaderPropery, PropertyNode> = new Map;

//         let nodes: ShaderNode[] = content.m_SerializableNodes.map(d => {
//             let node = createNode(d);

//             if (node instanceof PropertyNode) {
//                 node.searchProperties(properties);
                
//                 let propertyNode = propertyNodeMap.get(node.property!);
//                 if (propertyNode) {
//                     nodeMap.set(node.uuid, propertyNode);
//                     return propertyNode;
//                 }

//                 propertyNodeMap.set(node.property!, node);

//             }

//             nodeMap.set(node.uuid, node);
//             return node;
//         });

//         let edges: ShaderEdge[] = content.m_SerializableEdges.map(d => {
//             return new ShaderEdge(d)
//         })

//         for (let i = 0; i < edges.length; i++) {
//             let edge = edges[i];
//             let inputSlot = edge.input;
//             let outputSlot = edge.output;

//             let inputNode = nodeMap.get(inputSlot.nodeUuid);
//             let outputNode = nodeMap.get(outputSlot.nodeUuid);

//             if (outputNode instanceof SubGraphNode) {
//                 outputNode = outputNode.excahngeSubGraphOutNode(outputSlot);
//             }

//             if (!inputNode) {
//                 console.warn(`Can not find input [${inputSlot.nodeUuid}] for edge.`)
//                 continue;
//             }
//             if (!outputNode) {
//                 console.warn(`Can not find input [${outputSlot.nodeUuid}] for edge.`)
//                 continue;
//             }

//             inputNode.addDependency(outputNode);
//             outputNode.setPriority(inputNode.priority + 1);

//             let inputNodeSlot = inputNode.slotsMap.get(inputSlot.id);
//             let outputNodeSlot = outputNode.slotsMap.get(outputSlot.id);

//             if (inputNodeSlot && outputNodeSlot) {
//                 inputNodeSlot.connectSlots.push(outputNodeSlot);
//                 outputNodeSlot.connectSlots.push(inputNodeSlot);
//             }
//         }

//         nodes.sort((a, b) => b.priority - a.priority);

//         nodes.forEach(node => {
//             if (node instanceof SubGraphNode) {
//                 node.exchangeSubGraphInputNodes();
//             }

//             node.calcConcretePrecision();
//         })

//         this.allNodes.push(nodes);

//         return {
//             properties,
//             nodeMap,
//             nodes,
//             edges
//         }
//     }

//     static decode (path: string) {
        
//         resetGlobalShaderSlotID();

//         this.allNodes.length = 0;

//         let res = this.searchNodes(path);
//         if (!res) {
//             return;
//         }

//         let { properties, nodeMap, nodes, edges } = res;

//         let masterNode = nodes.find(n => n instanceof MasterNode);
//         if (!masterNode) {
//             console.error('Can not find master node.');
//             return;
//         }

//         (masterNode as MasterNode).properties = properties;

//         this.allNodes.forEach(nodes => {
//             nodes.forEach(node => {
//                 node.beforeGenreateCode()
//             });
//         })

//         let code = masterNode.generateCode();
//         return code;
//     }
// }
