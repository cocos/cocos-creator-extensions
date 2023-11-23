import { getJsonObject, getFloatString, getValueElement, getValueElementStr, getValueConcretePrecision, getPrecisionName } from './utils';
// import { relative } from "path";
import { ConcretePrecisionType, INodeDataDefine, PropDefine, SlotDefine, TextureConcretePrecision } from './type';
import { Vec2, Vec3, Vec4 } from 'cc';
import { ValueType } from 'cc';
import { ShaderSlot } from './slot';

export class ShaderNodeProp {
    value: Vec4 | Vec3 | Vec2 | Number | String;
    data: PropDefine;

    constructor(defValue: Vec4 | Vec3 | Vec2 | Number | String, data: PropDefine) {
        if (defValue instanceof ValueType) {
            this.value = defValue.clone();
        }
        else {
            this.value = defValue;
        }

        this.data = data;
    }
}

export class ShaderNode {
    priority = 0;
    uuid = '';
    slots: ShaderSlot[] = [];

    depChunks: string[] = [];
    defines: any[] = [];

    isMasterNode = false;
    isPropertyNode = false;
    concretePrecisionType = ConcretePrecisionType.Min;
    fixedConcretePrecision = 0;

    // subgraphNode: SubGraphNode | null = null;

    inputs: ShaderSlot[] = [];
    outputs: ShaderSlot[] = [];
    props: Map<string, ShaderNodeProp> = new Map;

    data: INodeDataDefine = { };

    get type() {
        return this.constructor.name;
    }

    init() {
        this.slots.length = 0;
        this.inputs.length = 0;
        this.outputs.length = 0;

        if (this.data.inputs) {
            this.data.inputs.forEach(s => {
                const slot = new ShaderSlot(s, this);
                this.inputs.push(slot);
                this.slots.push(slot);
            });
        }

        if (this.data.outputs) {
            this.data.outputs.forEach(s => {
                const slot = new ShaderSlot(s, this);
                this.outputs.push(slot);
                this.slots.push(slot);
            });
        }

        if (this.data.props) {
            this.data.props.forEach(prop => {
                const p = new ShaderNodeProp(prop.default, prop);
                this.props.set(prop.display, p);
            });
        }
    }

    get deps() {
        const deps: ShaderNode[] = [];
        this.inputs.forEach(i => {
            if (i.connectSlot) {
                deps.push(i.connectSlot.node);
            }
        });
        return deps;
    }

    beforeGenreateCode() {
    }

    addDependency(dep: ShaderNode) {
        if (dep === this) {
            return;
        }
        if (!this.deps.includes(dep)) {
            this.deps.push(dep);
        }
    }

    calcConcretePrecision() {
        if (this.fixedConcretePrecision > 0) {
            this.slots.forEach(slot => {
                slot._concretePrecision = this.fixedConcretePrecision;
            });
        }
        if (this.concretePrecisionType !== ConcretePrecisionType.Fixed) {
            let finalPrecision = 1;
            if (this.concretePrecisionType === ConcretePrecisionType.Min) {
                finalPrecision = 999;
                this.inputs.forEach(slot => {
                    let concretePrecision = slot.concretePrecision;
                    if (slot.connectSlot) {
                        concretePrecision = slot.connectSlot.concretePrecision;
                    }
                    finalPrecision = Math.min(finalPrecision, concretePrecision);
                });
            }
            else if (this.concretePrecisionType === ConcretePrecisionType.Max) {
                finalPrecision = -999;
                this.inputs.forEach(slot => {
                    let concretePrecision = slot.concretePrecision;
                    if (slot.connectSlot) {
                        concretePrecision = slot.connectSlot.concretePrecision;
                    }
                    finalPrecision = Math.max(finalPrecision, concretePrecision);
                });
            }
            else if (this.concretePrecisionType === ConcretePrecisionType.Texture) {
                finalPrecision = TextureConcretePrecision.Texture2D;
            }
            else {
                console.error('Not supported ConcretePrecisionType : ' + this.concretePrecisionType);
            }

            this.slots.forEach(slot => {
                slot._concretePrecision = finalPrecision;
            });
        }
    }

    setPriority(priority: number) {
        this.priority = Math.max(priority, this.priority);
        for (let i = 0; i < this.deps.length; i++) {
            this.deps[i].setPriority(this.priority + 1);
        }
    }

    getPropWithName(name: string) {
        let p;
        if (this.props) {
            p = this.props.get(name);
        }
        return p || new ShaderNodeProp(null, null);
    }
    getSlotWithSlotName(name: string) {
        return this.slots.find(s => s.displayName === name);
    }
    getOutputSlotWithSlotName(name: string) {
        return this.outputs.find(s => s.displayName === name);
    }
    getOutputVarName(idx: number) {
        return this.outputs[idx].varName;
    }
    getOutputVarDefine(idx: number) {
        return this.outputs[idx].varDefine;
    }
    getInputValue(idx: number): any {
        return this.inputs[idx].slotValue;
    }

    generateCode() {
        return '';
    }
}

// export class ShaderEdgeSlot {
//     id = 0;
//     nodeUuid = '';

//     set (data: any) {
//         this.id = data.m_SlotId;
//         this.nodeUuid = data.m_NodeGUIDSerialized;
//     }
// }

// export class ShaderEdge {
//     type = {};
//     data: any = {}

//     input: ShaderEdgeSlot = new ShaderEdgeSlot;
//     output: ShaderEdgeSlot = new ShaderEdgeSlot;

//     constructor (data: any) {
//         this.type = data.typeInfo;
//         this.data = getJsonObject(data.JSONnodeData);

//         this.input.set(this.data.m_InputSlot);
//         this.output.set(this.data.m_OutputSlot);
//     }
// }
