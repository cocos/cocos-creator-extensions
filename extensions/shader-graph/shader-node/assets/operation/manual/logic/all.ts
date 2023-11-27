
import { Vec2, Vec3, Vec4 } from 'cc';
import { register } from '../../../graph/register';
import { ShaderNode } from '../../base';
import { ConcretePrecisionType } from '../../type';
import { prop, slot } from '../../utils';

@register({
    menu: 'Logic/All',
    title: 'All',
})
export default class All extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Min;

    data = {
        inputs: [
            slot('In', Vec4.ZERO, 'vec4', 'vector'),
        ],
        outputs: [
            slot('Out', false, 'boolean', 'boolean'),
        ],
    };

    calcConcretePrecision() {
        super.calcConcretePrecision();
    }

    generateCode() {
        const i0 = this.getInputValue(0);
        const output0 = this.getOutputVarDefine(0);

        const elements = ['x', 'y', 'z', 'w'];

        const conditions: string[] = [];
        const precision = this.slots[0].concretePrecision;
        for (let i = 0; i < precision; i++) {
            conditions.push(`(${i0}.${elements[i]} > 0.)`);
        }

        return `
            ${output0} = (${conditions.join(' && ')});
        `;
    }
}
    