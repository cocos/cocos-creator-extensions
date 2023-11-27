// import { ShaderNode } from '../base';
// import globby from 'globby';
// import path from 'fire-path';

// let nodePaths = globby.sync([
//     path.join(__dirname, './**').replace(/\\/g, '/'), 
//     path.join(__dirname, '!./index.*').replace(/\\/g, '/'), 
// ])
// let nodes = {};
// for (let i = 0; i < nodePaths.length; i++) {
//     let nodePath = nodePaths[i];
//     let nodeName = path.basenameNoExt(nodePath);
//     nodes[nodeName] = require(nodePath).default;
// }

// export function createNode (data: any) {
//     let type = data.typeInfo;
//     let name = type.fullName;
//     name = name.replace('UnityEditor.ShaderGraph.', '');

//     let ctor = nodes[name]; 
//     if (!ctor) {
//         console.warn(`Can not find Node with Name [${name}]`)
//         ctor = ShaderNode
//     }
//     return ctor && new ctor(data);
// }
