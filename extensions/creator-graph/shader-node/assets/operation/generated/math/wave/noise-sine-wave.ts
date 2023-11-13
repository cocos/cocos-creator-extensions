
import { Vec2, Vec3, Vec4 } from 'cc';
import { register } from '../../../../graph/register';
import { ShaderNode } from '../../../base';
import { ConcretePrecisionType } from '../../../type';
import { slot } from '../../../utils';

@register({
    menu: 'Math/Wave/NoiseSineWave',
    title: 'NoiseSineWave',
})
export default class NoiseSineWave extends ShaderNode {

    data = {
        inputs: [
            slot('In', Vec4.ZERO, 'vec4', 'vector'),
            slot('MinMax', Vec2.ZERO, 'vec2', 'vector'),
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
            float sinIn = sin(${input0});
            float sinInOffset = sin(${input0} + 1.0);
            float randomno =  frac(sin((sinIn - sinInOffset) * (12.9898 + 78.233))*43758.5453);
            float noise = lerp(${input1}.x, ${input1}.y, randomno);
            ${output0} = sinIn + noise;
        `;
    }
}
    