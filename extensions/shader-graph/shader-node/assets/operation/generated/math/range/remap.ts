
import { Vec2, Vec3, Vec4 } from 'cc';
import { register } from '../../../../graph/register';
import { ShaderNode } from '../../../base';
import { ConcretePrecisionType } from '../../../type';
import { slot } from '../../../utils';

@register({
    menu: 'Math/Range/Remap',
    title: 'Remap',
})
export default class Remap extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Max;

    data = {
        inputs: [
            slot('In', Vec4.ZERO, 'vec4', 'vector'),
            slot('InMinMax', Vec2.ZERO, 'vec2', 'vector'),
            slot('OutMinMax', Vec2.ZERO, 'vec2', 'vector'),
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
            ${output0} = ${input2}.x + (${input0} - ${input1}.x) * (${input2}.y - ${input2}.x) / (${input1}.y - ${input1}.x);
        `;
    }
}
    