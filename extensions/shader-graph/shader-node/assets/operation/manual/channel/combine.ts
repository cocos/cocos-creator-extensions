import { Vec4, Vec3, Vec2 } from 'cc';
import { register } from '../../../graph';
import { ShaderNode } from '../../base';
import { ConcretePrecisionType } from '../../type';
import { slot } from '../../utils';

@register({
    menu: 'Channel/Combine',
    title: 'Combine',
})
export default class CombineNode extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Fixed;

    data = {
        inputs: [
            slot('R', 0, 'float', 'vector'),
            slot('G', 0, 'float', 'vector'),
            slot('B', 0, 'float', 'vector'),
            slot('A', 0, 'float', 'vector'),
        ],
        outputs: [
            slot('RGBA', Vec4.ZERO, 'vec4', 'vector'),
            slot('RGB', Vec3.ZERO, 'vec3', 'vector'),
            slot('RG', Vec2.ZERO, 'vec2', 'vector'),
        ],
    };

    generateCode() {

        const slotR = this.getSlotWithSlotName('R');
        const slotG = this.getSlotWithSlotName('G');
        const slotB = this.getSlotWithSlotName('B');
        const slotA = this.getSlotWithSlotName('A');

        const slotRGBA = this.getSlotWithSlotName('RGBA');
        const slotRGB = this.getSlotWithSlotName('RGB');
        const slotRG = this.getSlotWithSlotName('RG');

        let code = '';

        if (slotRGBA && slotRGBA.connectSlot) {
            code += `${slotRGBA?.varDefine} = vec4(${slotR?.slotValue}, ${slotG?.slotValue}, ${slotB?.slotValue}, ${slotA?.slotValue});\n`;
        }
        if (slotRGB && slotRGB.connectSlot) {
            code += `${slotRGB?.varDefine} = vec3(${slotR?.slotValue}, ${slotG?.slotValue}, ${slotB?.slotValue});\n`;
        }
        if (slotRG && slotRG.connectSlot) {
            code += `${slotRG?.varDefine} = vec2(${slotR?.slotValue}, ${slotG?.slotValue});\n`;
        }

        return code;
    }
}
