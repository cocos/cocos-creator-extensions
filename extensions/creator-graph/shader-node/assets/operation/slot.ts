import { ValueType } from 'cc';
import { ShaderNode } from './base';
import { SlotDefine } from './type';
import { getFloatString, getPrecisionName, getValueConcretePrecision, getValueElementStr } from './utils';
import PropertyNode from './nodes/input/PropertyNode';
import { shaderContext } from './context';

let _GlobalShaderSlotID_ = 0;
export function resetGlobalShaderSlotID() {
    _GlobalShaderSlotID_ = 0;
}

export enum ShaderSlotType {
    Input,
    Output,
}

export class ShaderSlot {
    // typeInfo = {};
    data: SlotDefine;

    globalID = 0;

    // serialized
    id = 0;
    displayName = '';
    type = ShaderSlotType.Input;
    defaultValue: any;
    value: any;

    get connectSlot() {
        const slot = this.connectSlots[0];
        if (slot && shaderContext.getLocalVars.includes(slot.node)) {
            const v = shaderContext.localVars.find(v => {
                return v.name === (slot.node as any).name;
            });
            return v.inputs[0].connectSlot;
        }
        return this.connectSlots[0];
    }
    set connectSlot(v) {
        this.connectSlots.length = 0;
        if (v) {
            this.connectSlots[0] = v;
        }
    }
    connectSlots: ShaderSlot[] = [];

    node: ShaderNode | undefined = undefined;
    get connectNode() {
        return this.connectSlot && this.connectSlot.node;
    }
    // otherNode: ShaderNode | undefined = undefined;

    constructor(data: SlotDefine, node: ShaderNode) {
        this.displayName = data.display;
        this.defaultValue = data.default;

        if (data.default instanceof ValueType) {
            this.value = data.default.clone();
        }
        else {
            this.value = data.default;
        }

        this.data = data;
        this.node = node;

        // console.log(`Slot ID ${this.displayName} : ${_GlobalShaderSlotID_}`)

        this.globalID = _GlobalShaderSlotID_++;
    }

    // deserialize (obj: any, node: ShaderNode) {
    //     this.typeInfo = obj.typeInfo;
    //     this.data = getJsonObject(obj.JSONnodeData);

    //     this.type = this.data.m_SlotType as ShaderSlotType;

    //     this.node = node;

    //     this.id = this.data.m_Id;
    //     this.globalID = _GlobalShaderSlotID_++;
    //     this.displayName = this.data.m_DisplayName;
    //     this.defaultValue = this.data.m_DefaultValue;
    //     this.value = this.data.m_Value;
    // }

    get varName(): string {
        if (this.node?.isPropertyNode) {
            return (this.node as PropertyNode).name;
        }
        return 'var_' + this.globalID;
    }

    get varDefine(): string {
        let name = getPrecisionName(this.concretePrecision, this.data.type);
        if (name) {
            name += ' ';
        }
        return name + this.varName;
    }

    get precisionName(): string {
        return getPrecisionName(this.concretePrecision, this.data.type);
    }

    // get defaultValueStr () {
    //     let defaultValue = this.defaultValue;

    //     let x = getFloatString(defaultValue.x);
    //     let y = getFloatString(defaultValue.y);
    //     let z = getFloatString(defaultValue.z);
    //     let w = getFloatString(defaultValue.w);

    //     let result = getFloatString(defaultValue);
    //     if (typeof defaultValue === 'object') {
    //         if (defaultValue.w !== undefined) {
    //             result = `vec4(${x}, ${y}, ${z}, ${w})`;
    //         }
    //         else if (defaultValue.z !== undefined) {
    //             result = `vec3(${x}, ${y}, ${z})`;
    //         }
    //         else if (defaultValue.y !== undefined) {
    //             result = `vec2(${x}, ${y})`;
    //         }
    //     }

    //     return result;
    // }

    get isVector() {
        return this.data.connectType === 'vector';
    }

    get slotValue() {
        let valueConretePresition = this.defaultConcretePrecision;
        const selfConcretePresition = this.concretePrecision;

        let valueStr = '';
        if (!this.connectSlot) {
            const value = this.value;
            if (!this.isVector) {
                valueStr = value;
            }
            else {
                let x = getValueElementStr(value, 0);
                const y = getValueElementStr(value, 1);
                const z = getValueElementStr(value, 2);
                const w = getValueElementStr(value, 3);

                if (typeof value !== 'object') {
                    x = getFloatString(value);
                }

                valueConretePresition = getValueConcretePrecision(value);

                const values = [x, y, z, w];
                const concreteValues: any[] = [];
                for (let i = 0; i < selfConcretePresition; i++) {
                    concreteValues.push(values[i] === undefined ? 0 : values[i]);
                }
                valueStr = concreteValues.join(', ');
            }
        }
        else {
            valueConretePresition = this.connectSlot.concretePrecision;

            valueStr = this.connectSlot.varName;
            if (this.isVector && selfConcretePresition !== valueConretePresition) {
                if (selfConcretePresition < valueConretePresition) {
                    if (selfConcretePresition === 1) {
                        valueStr += '.x';
                    }
                    else if (selfConcretePresition === 2) {
                        valueStr += '.xy';
                    }
                    else if (selfConcretePresition === 3) {
                        valueStr += '.xyz';
                    }
                }
                else {
                    if (valueConretePresition !== 1) {
                        const dif = selfConcretePresition - valueConretePresition;
                        const difValues: any[] = [];
                        for (let i = 0; i < dif; i++) {
                            difValues.push('0.');
                        }
                        valueStr += ', ' + difValues.join(', ');
                    }
                }
            }
        }

        let result = `${valueStr}`;
        if (this.isVector) {
            if (selfConcretePresition === 2) {
                result = `vec2(${valueStr})`;
            }
            else if (selfConcretePresition === 3) {
                result = `vec3(${valueStr})`;
            }
            else if (selfConcretePresition === 4) {
                result = `vec4(${valueStr})`;
            }
        }
        
        return result;
    }

    get defaultConcretePrecision() {
        let concretePrecision = 1;

        const value = this.defaultValue;
        if (typeof value === 'object') {
            if (value.w !== undefined) {
                concretePrecision = 4;
            }
            else if (value.z !== undefined) {
                concretePrecision = 3;
            }
            else if (value.y !== undefined) {
                concretePrecision = 2;
            }
        }

        return concretePrecision;
    }

    _concretePrecision = -1;
    get concretePrecision() {
        if (this._concretePrecision === -1) {
            let value = this.defaultValue;
            if (value === undefined) {
                if (this.node?.isPropertyNode) {
                    value = (this.node as PropertyNode).property!.value;
                }
            }
            if (value === undefined) {
                console.error('Slot Value is undefined, concrete precision maybe wrong.');
            }
            this._concretePrecision = getValueConcretePrecision(value);
        }
        return this._concretePrecision;
    }
}

