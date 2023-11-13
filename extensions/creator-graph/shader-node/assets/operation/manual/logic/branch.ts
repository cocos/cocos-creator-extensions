
import { Vec2, Vec3, Vec4 } from 'cc';
import { register } from '../../../graph/register';
import { ShaderNode } from '../../base';
import { ConcretePrecisionType } from '../../type';
import { prop, slot } from '../../utils';

@register({
    menu: 'Logic/Branch',
    title: 'Branch',
})
export default class Branch extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Max;

    data = {
        inputs: [
            slot('Predicate', false, 'boolean', 'boolean'),
            slot('True', Vec4.ZERO, 'vec4', 'vector'),
            slot('False', Vec4.ZERO, 'vec4', 'vector'),
        ],
        outputs: [
            slot('Out', Vec4.ZERO, 'vec4', 'vector'),
        ],
    };

    calcConcretePrecision() {
        super.calcConcretePrecision();
    }

    generateCode() {
        const i0 = this.getInputValue(0);
        const i1 = this.getInputValue(1);
        const i2 = this.getInputValue(2);
        
        const output0 = this.getOutputVarDefine(0);

        return `
            ${output0} = (${i0}) ? (${i1}) : (${i2});
        `;
    }
}
    