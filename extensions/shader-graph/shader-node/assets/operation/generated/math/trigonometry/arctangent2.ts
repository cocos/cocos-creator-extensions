
import { Vec2, Vec3, Vec4 } from 'cc';
import { register } from '../../../../graph/register';
import { ShaderNode } from '../../../base';
import { ConcretePrecisionType } from '../../../type';
import { slot } from '../../../utils';

@register({
    menu: 'Math/Trigonometry/Arctangent2',
    title: 'Arctangent2',
})
export default class Arctangent2 extends ShaderNode {

    data = {
        inputs: [
            slot('A', Vec4.ZERO, 'vec4', 'vector'),
            slot('B', Vec4.ZERO, 'vec4', 'vector'),
        ],
        outputs: [
            slot('Out', Vec4.ZERO, 'vec4', 'vector'),
        ],
    };

    calcConcretePrecision() {
        super.calcConcretePrecision();
    }

    generateCode() {
        
        const input0 = this.getInputValue(0);
        const input1 = this.getInputValue(1);
        
        const output0 = this.getOutputVarDefine(0);
        return `
            ${output0} = atan2(${input0}, ${input1});
        `;
    }
}
    