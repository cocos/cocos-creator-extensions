import { EDITOR } from 'cc/env';
import { ShaderNode } from '../../base';
import {
    ConcretePrecisionType,
    TextureConcretePrecision,
    NormalSpace,
    NormalMapSpace,
    ViewDirSpace,
    PositionSpace,
    SlotDefine,
    INodeDataDefine,
} from '../../type';
import { ensureEnumDefines, fs, getEnumDefine, getEnumNames, path } from '../../utils';
import { ShaderSlot } from '../../slot';
import { ShaderProperty, ShaderPropertyType } from '../../property';
import { shaderContext } from '../../context';
import { Asset, Material, Texture2D, assetManager } from 'cc';

export enum MasterSlotType {
    Vertex,
    Fragment,
}

export declare class MasterSlotDefine extends SlotDefine {
    slotType: MasterSlotType;
    codeChunk: number;
}

function findConnectNodes(slot: ShaderSlot, nodes: ShaderNode[]) {
    if (!slot.connectSlot) return;

    const connectNode = slot.connectNode;
    if (connectNode) {
        if (nodes.includes(connectNode)) {
            return;
        }

        connectNode.inputs.forEach(slot => {
            findConnectNodes(slot, nodes);
        });

        nodes.push(connectNode);
    }
}

export default class MasterNode extends ShaderNode {

    // vsSlotIndices: string[] = [];
    // fsSlotIndices: string[] = [];

    get templatePath() {
        return '';
    }

    isMasterNode = true;
    concretePrecisionType = ConcretePrecisionType.Fixed;

    properties: ShaderProperty[] = [];

    data: INodeDataDefine = {
        inputs: [],
    };

    getConnectNodes(slots: ShaderSlot[]) {
        const nodes: ShaderNode[] = [];
        slots.forEach(slot => {
            findConnectNodes(slot, nodes);
        });

        nodes.sort((a, b) => b.priority - a.priority);
        return nodes;
    }

    generatePropertiesCode() {
        let uniform = '\n';
        let mtl = '\n';
        let uniformSampler = '';

        const properties = shaderContext.properties;
        properties.sort((a, b) => {
            return b.concretePrecision - a.concretePrecision;
        });

        let blockUniformCount = 0;

        properties.forEach(p => {
            let precision = '';
            let mtlValue = '';

            const value = p.value;
            const isColor = p.type === ShaderPropertyType.Color;
            const x = value.x;
            const y = value.y;
            const z = value.z;
            const w = value.w;

            if (p.type === ShaderPropertyType.Texture2D) {
                precision = 'sampler2D';
                mtlValue = 'white';
            }
            else if (p.type === ShaderPropertyType.TextureCube) {
                precision = 'samplerCube';
                mtlValue = 'white';
            }
            else {
                const concretePrecision = p.concretePrecision;
                if (concretePrecision === 1) {
                    precision = 'float';
                    mtlValue = `${value}`;
                }
                else if (concretePrecision === 2) {
                    precision = 'vec2';
                    mtlValue = `[${x}, ${y}]`;
                }
                else if (concretePrecision === 3) {
                    precision = 'vec4';
                    mtlValue = `[${x}, ${y}, ${z}, 0]`;
                }
                else if (concretePrecision === 4) {
                    precision = 'vec4';
                    mtlValue = `[${x}, ${y}, ${z},  ${w}]`;
                }
            }

            const editorStr = isColor ? `, editor: { type: color }` : '';

            if (!p.isTexture()) {
                uniform += `    ${precision} ${p.name};\n`;
                blockUniformCount++;
            }
            else {
                uniformSampler += `  uniform ${precision} ${p.name};\n`;
            }
            mtl += `        ${p.name}: { value: ${mtlValue} ${editorStr}}\n`;
        });

        if (blockUniformCount === 0) {
            uniform += '    vec4 empty_value;\n';
        }

        return {
            uniform,
            uniformSampler,
            mtl,
        };
    }

    replaceChunks(code: string) {
        const depChunks: string[] = ['common'];
        const allNodes = shaderContext.allNodes;
        allNodes.forEach(node => {
            for (let k = 0; k < node.depChunks.length; k++) {
                if (!depChunks.includes(node.depChunks[k])) {
                    depChunks.push(node.depChunks[k]);
                }
            }
        });

        let chunkIncludes = '\n';
        let chunks = '\n';
        depChunks.forEach(chunkName => {
            const chunkPath = path.join(shaderContext.shaderTemplatesDir, `chunks/${chunkName}.chunk`);
            const chunk = fs.readFileSync(chunkPath, 'utf-8');
            if (!chunk) {
                console.error(`Can not find chunk with path [${chunkPath}]`);
                return;
            }
            chunks += chunk + '\n';
            chunkIncludes += `  #include <shader_graph_${chunkName}>\n`;
        });

        code = code.replace('{{chunks}}', chunks);
        code = code.replace('{{vs_chunks}}', chunkIncludes);
        code = code.replace('{{fs_chunks}}', chunkIncludes);

        return code;
    }

    generateDefines(code: string) {
        const defines: string[] = [];
        const allNodes = shaderContext.allNodes;
        allNodes.forEach(node => {
            node.defines.forEach(def => {
                if (!defines.includes(def)) {
                    defines.push(def);
                }
            });
        });

        let define = '';
        defines.forEach(df => {
            define += `${df}\n`;
        });

        define = ensureEnumDefines(NormalSpace, define);
        define = ensureEnumDefines(PositionSpace, define);
        define = ensureEnumDefines(ViewDirSpace, define);

        // add spaces
        let lines = define.split('\n');
        lines = lines.map(l => '  ' + l);
        define = lines.join('\n');

        return code.replace(/{{defines}}/g, define);
    }

    generateSlotsCode(slots: ShaderSlot[]) {
        const code: string[] = ['\n'];

        const nodes = this.getConnectNodes(slots);
        nodes.forEach(node => {
            node.calcConcretePrecision();
            node.generateCode().split('\n').forEach(c => {
                if (c) {
                    c += ` // ${node.constructor.name}`;
                    code.push('    ' + c);
                }
            });
        });

        return code.join('\n');
    }

    generateCodeChunk(code) {
        const codeChunkSlots: any[] = [];
        this.inputs.forEach(input => {
            const data = input.data as MasterSlotDefine;
            if (!codeChunkSlots[data.codeChunk]) {
                codeChunkSlots[data.codeChunk] = [];
            }

            codeChunkSlots[data.codeChunk].push(input);
        });

        codeChunkSlots.forEach((slots, chunkIdx) => {
            const codeChunk = this.generateSlotsCode(slots);
            code = code.replace(`{{code_chunk_${chunkIdx}}}`, codeChunk);

            // console.log(`{{code_chunk_${chunkIdx}}} : \n ` + codeChunk);
        });

        return code;
    }

    generateCode() {
        let code = fs.readFileSync(this.templatePath, 'utf-8');

        code = this.generateCodeChunk(code);
        code = this.generateDefines(code);
        code = this.replaceChunks(code);

        if (!shaderContext.properties || shaderContext.properties.length === 0) {
            code = code.replace(/properties: &props/g, '');
            code = code.replace(/properties: \*props/g, '');
        }

        const props = this.generatePropertiesCode();
        code = code.replace('{{properties}}', props.uniform);
        code = code.replace('{{properties_sampler}}', props.uniformSampler);
        code = code.replace('{{properties_mtl}}', props.mtl);

        // 如果 slot 没有连接，使用 template 中定义的默认值
        const slotsToUseTemplateDefault = ['Vertex Position', 'Vertex Normal', 'Vertex Tangent', 'Position'];

        this.inputs.forEach(slot => {
            const tempName = `slot_${slot.displayName.replace(/ /g, '_')}`;
            let value;
            if (slotsToUseTemplateDefault.includes(slot.displayName) || slot.displayName === 'Normal') {
                if (slot.connectSlot) {
                    value = slot.slotValue;
                }
            }
            else {
                value = slot.slotValue;
            }

            const reg = new RegExp(`{{${tempName} *= *(.*)}}`, 'g');
            if (value === undefined) {
                const res = reg.exec(code);
                if (res) {
                    value = res[1];
                }
            }
            code = code.replace(reg, value);
        });

        // vertexSlotNames.forEach(name => {
        //     const tempName = `slot_${name.replace(/ /g, '_')}`;
        //     let value = '';
        //     const reg = new RegExp(`{{${tempName} *= *(.*)}}`, 'g');
        //     const res = reg.exec(code);
        //     if (res) {
        //         value = res[1];
        //     }
        //     code = code.replace(reg, value);
        // });

        return code;
    }

    async createMaterial(buildEffect: (name: string, code: string) => Promise<any/*IEffectInfo*/>) {
        const code = this.generateCode();

        const material = new Material();
        const name = 'shader-graph-preview.effect';
        const effect = await buildEffect(name, code);
        const result = new cc.EffectAsset();
        Object.assign(result, effect);
        result.onLoaded();
        material.initialize({ effectAsset: effect });

        await Promise.all(shaderContext.properties.map(async p => {
            if (p.type === ShaderPropertyType.Texture2D || p.type === ShaderPropertyType.TextureCube) {
                const uuid = (p.value as Texture2D).uuid;
                return new Promise(resolve => {
                    assetManager.loadAny(uuid, (err: any, asset: Texture2D) => {
                        if (err) {
                            console.error(err);
                            return resolve(null);
                        }
                        material.setProperty(p.name, asset);
                        resolve(null);
                    });
                });
            }
        }));
        
        return material;
    }
}
