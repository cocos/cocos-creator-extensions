
import { Vec2, Vec3, Vec4 } from 'cc';
import { register } from '../../../../graph/register';
import { ShaderNode } from '../../../base';
import { ConcretePrecisionType } from '../../../type';
import { slot } from '../../../utils';

@register({
    menu: 'Math/Range/RandomRange',
    title: 'RandomRange',
})
export default class RandomRange extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Fixed;
    depChunks = ['range'];

    data = {
        inputs: [
            slot('seed', Vec2.ZERO, 'vec2', 'vector'),
            slot('minv', 0, 'float', 'vector'),
            slot('maxv', 0, 'float', 'vector'),
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
        const input2 = this.getInputValue(2);
        
        const output0 = this.getOutputVarDefine(0);
        return `${output0} = RandomRange(${input0}, ${input1}, ${input2});`;
    }
}
    