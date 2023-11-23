
import { Vec2, Vec3, Vec4 } from 'cc';
import { register } from '../../../../graph/register';
import { ShaderNode } from '../../../base';
import { ConcretePrecisionType } from '../../../type';
import { slot } from '../../../utils';

@register({
    menu: 'Math/Advanced/Posterize',
    title: 'Posterize',
})
export default class Posterize extends ShaderNode {

    data = {
        inputs: [
            slot('In', Vec4.ZERO, 'vec4', 'vector'),
            slot('Steps', Vec4.ZERO, 'vec4', 'vector'),
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
            ${output0} = floor(${input0} / (1. / ${input1})) * (1. / ${input1});
        `;
    }
}
    