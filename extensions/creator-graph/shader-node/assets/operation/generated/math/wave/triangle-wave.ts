
import { Vec2, Vec3, Vec4 } from 'cc';
import { register } from '../../../../graph/register';
import { ShaderNode } from '../../../base';
import { ConcretePrecisionType } from '../../../type';
import { slot } from '../../../utils';

@register({
    menu: 'Math/Wave/TriangleWave',
    title: 'TriangleWave',
})
export default class TriangleWave extends ShaderNode {

    data = {
        inputs: [
            slot('In', Vec4.ZERO, 'vec4', 'vector'),
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
        
        const output0 = this.getOutputVarDefine(0);
        return `
            ${output0} = 2.0 * abs( 2 * (${input0} - floor(0.5 + ${input0})) ) - 1.0;
        `;
    }
}
    