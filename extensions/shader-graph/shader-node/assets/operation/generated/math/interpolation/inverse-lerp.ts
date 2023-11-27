
import { Vec2, Vec3, Vec4 } from 'cc';
import { register } from '../../../../graph/register';
import { ShaderNode } from '../../../base';
import { ConcretePrecisionType } from '../../../type';
import { slot } from '../../../utils';

@register({
    menu: 'Math/Interpolation/InverseLerp',
    title: 'InverseLerp',
})
export default class InverseLerp extends ShaderNode {

    data = {
        inputs: [
            slot('A', Vec4.ZERO, 'vec4', 'vector'),
            slot('B', Vec4.ZERO, 'vec4', 'vector'),
            slot('T', Vec4.ZERO, 'vec4', 'vector'),
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
        const input2 = this.getInputValue(2);
        
        const output0 = this.getOutputVarDefine(0);
        return `
            ${output0} = (${input2} - ${input0}) / (${input1} - ${input0});
        `;
    }
}
    