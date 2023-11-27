
import { Vec2, Vec3, Vec4 } from 'cc';
import { register } from '../../../../graph/register';
import { ShaderNode } from '../../../base';
import { ConcretePrecisionType } from '../../../type';
import { slot } from '../../../utils';

@register({
    menu: 'Math/Vector/DotProduct',
    title: 'DotProduct',
})
export default class DotProduct extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Fixed;

    data = {
        inputs: [
            slot('A', Vec4.ZERO, 'vec4', 'vector'),
            slot('B', Vec4.ZERO, 'vec4', 'vector'),
        ],
        outputs: [
            slot('Out', 0, 'float', 'vector'),
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
            ${output0} = dot(${input0}, ${input1});
        `;
    }
}
    