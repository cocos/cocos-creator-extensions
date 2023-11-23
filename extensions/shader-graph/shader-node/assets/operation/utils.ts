import { EDITOR } from 'cc/env';
import {
    SlotConnectType,
    SlotDefaultValueType,
    SlotDefine,
    SlotOrPropType, SlotPropDetail,
    TextureConcretePrecision,
} from './type';
import { Vec2, Vec3, Vec4, Color } from 'cc';

const useNpm = (EDITOR || globalThis.electron);

export const Editor = useNpm && globalThis.Editor;
export const projectPath = EDITOR && Editor.Project.path;
export const fs = useNpm && globalThis.require('fs-extra');
export const path = useNpm && globalThis.require('path');

// export const shaderTemplatesDir = path.join(__dirname, '../../compile-shader/shader-templates');

export function getJsonObject(str: string) {
    let content;
    try {
        content = JSON.parse(str);
    }
    catch (err) {
        console.error(err);
    }
    return content;
}

export function getFloatString(value: number) {
    if (typeof value !== 'number') {
        return value;
    }

    let str = value + '';
    if (!str.includes('.')) {
        str += '.';
    }
    return str;
}

const ValueElements = {
    vector: ['x', 'y', 'z', 'w'],
    color: ['r', 'g', 'b', 'a'],
    mat4: ['e00', 'e01', 'e02', 'e03'],
};

export function getValueElement(value: any | number, index: number): number {
    if (typeof value === 'number') {
        return value;
    }

    let elements;

    if (value.x !== undefined) {
        elements = ValueElements.vector;
    }
    else if (value.r !== undefined) {
        elements = ValueElements.color;
    }
    else if (value.e00 !== undefined) {
        elements = ValueElements.mat4;
    }

    return value[elements[index]] || 0;
}

export function getValueElementStr(value: object | number, index: number): string {
    return getFloatString(getValueElement(value, index));
}

export function getValueConcretePrecision(value: any) {
    let valueConretePresition = 1;
    if (typeof value === 'object') {
        if (value.w !== undefined || value.a !== undefined) {
            valueConretePresition = 4;
        }
        else if (value.z !== undefined || value.b !== undefined) {
            valueConretePresition = 3;
        }
        else if (value.y !== undefined || value.g !== undefined) {
            valueConretePresition = 2;
        }
        else if (value.m_SerializedTexture !== undefined) {
            valueConretePresition = TextureConcretePrecision.Texture2D;
        }
        else if (value.m_SerializedCubemap !== undefined) {
            valueConretePresition = TextureConcretePrecision.TextureCube;
        }
    }
    return valueConretePresition;
}

export function getPrecisionName(precision: number, type: SlotOrPropType) {
    let name = '';
    if (type === 'boolean') {
        name = 'bool';
    }
    else if (precision === 1) {
        name = 'float';
    }
    else if (precision === 2) {
        name = 'vec2';
    }
    else if (precision === 3) {
        name = 'vec3';
    }
    else if (precision === 4) {
        name = 'vec4';
    }
    else if (precision === TextureConcretePrecision.Texture2D) {
        name = 'sampler2D';
    }
    else if (precision === TextureConcretePrecision.TextureCube) {
        name = 'samplerCube';
    }
    return name;
}

export function getEnumNames(type) {
    let names = Object.getOwnPropertyNames(type);
    names = names.filter(name => Number.isNaN(Number.parseFloat(name)) && name !== '_name');
    return names;
}

export function slot(display: string,
    defaultValue: SlotDefaultValueType,
    type: SlotOrPropType,
    connectType: SlotConnectType,
    opts: { [key: string]: any } = {}
): SlotDefine {
    const data = { display, default: defaultValue, type, connectType };

    Object.assign(data, opts);
    return data;
}

export function prop(
    display: string,
    defaultValue: Vec4 | Vec3 | Vec2 | Number | Color | String | null,
    type: SlotOrPropType,
    details: SlotPropDetail = {}
) {
    const data = { display, default: defaultValue, type };
    Object.assign(data, details);
    return data as any;
}

export function getEnumDefineName(enumObj, value) {
    return `CC_${enumObj._name.replace('Space', '')}_${enumObj[value]}`.toUpperCase();
}

export function getEnumDefine(enumObj, value) {
    const name = getEnumDefineName(enumObj, value);
    return `#define ${name} 1`;
}

export function ensureEnumDefines(enumObj, define: string) {
    getEnumNames(enumObj).forEach(name => {
        const def = getEnumDefineName(enumObj, enumObj[name]);

        if (!define.includes(def)) {
            define += `#define ${def} 0\n`;
        }
    });

    return define;
}
