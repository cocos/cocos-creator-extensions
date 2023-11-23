import InputNode from '../input-node';
import { NormalMapSpace, NormalSpace } from '../../../type';
import { Vec2, Vec4, Texture2D } from 'cc';
import { prop, slot } from '../../../utils';
import { register } from '../../../../graph';

enum TextureType {
    Default,
    Normal,
}

enum TextureNormalSpace {
    Tangent,
    Object,
}

@register({
    menu: 'Input/Texture/SampleTexture2D',
    title: 'SampleTexture2D',
})
export default class SampleTexture2D extends InputNode {

    data = {
        props: [
            prop('TextureType', TextureType.Default, 'enum', { enum: TextureType }),
            prop('NormalSpace', TextureNormalSpace.Tangent, 'enum', { enum: TextureNormalSpace }),
        ],
        inputs: [
            slot('Texture', new Texture2D, 'texture2D', 'texture2D'),
            slot('UV', Vec2.ZERO, 'vec2', 'vector'),
        ],
        outputs: [
            slot('RGBA', Vec4.ZERO, 'vec4', 'vector'),
            slot('R', 0, 'float', 'vector'),
            slot('G', 0, 'float', 'vector'),
            slot('B', 0, 'float', 'vector'),
            slot('A', 0, 'float', 'vector'),
        ],
    };

    generateCode() {
        const textureSlot = this.getSlotWithSlotName('Texture');
        const uvSlot = this.getSlotWithSlotName('UV');

        const rgbaSlot = this.getSlotWithSlotName('RGBA');

        const rgbaVarName = rgbaSlot?.varName;
        let code;
        if (!textureSlot?.connectSlot) {
            code = `vec4 ${rgbaVarName} = vec4(1.);\n`;
        }
        else {
            let uv;
            if (!uvSlot.connectSlot) {
                uv = 'v_uv';
            }
            else {
                uv = uvSlot.slotValue;
            }
            code = `vec4 ${rgbaVarName} = texture(${textureSlot?.connectSlot.varName}, ${uv});\n`;
        }

        const textureType = this.getPropWithName('TextureType');
        const normalSpace = this.getPropWithName('NormalSpace');

        if (textureType.value === TextureType.Normal && normalSpace.value === TextureNormalSpace.Tangent) {
            code += `${rgbaVarName}.xyz -= vec3(0.5);\n`;
            code += `${rgbaVarName}.xyz = \n`;
            code += `  ${rgbaVarName}.x * normalize(worldTangent) +\n`;
            code += `  ${rgbaVarName}.y * normalize(worldBinormal) +\n`;
            code += `  ${rgbaVarName}.z * normalize(worldNormal);\n`;

            this.defines.push('CC_SURFACES_USE_TANGENT_SPACE');
        }

        const r = this.getSlotWithSlotName('R');
        if (r && r.connectSlot) {
            code += `float ${r.varName} = ${rgbaVarName}.r;\n`;
        }
        const g = this.getSlotWithSlotName('G');
        if (g && g.connectSlot) {
            code += `float ${g.varName} = ${rgbaVarName}.g;\n`;
        }
        const b = this.getSlotWithSlotName('B');
        if (b && b.connectSlot) {
            code += `float ${b.varName} = ${rgbaVarName}.b;\n`;
        }
        const a = this.getSlotWithSlotName('A');
        if (a && a.connectSlot) {
            code += `float ${a.varName} = ${rgbaVarName}.a;\n`;
        }

        return code;
    }
}

