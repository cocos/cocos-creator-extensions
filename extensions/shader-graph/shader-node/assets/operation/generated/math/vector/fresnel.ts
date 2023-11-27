
import { Vec2, Vec3, Vec4 } from 'cc';
import { register } from '../../../../graph/register';
import { ShaderNode } from '../../../base';
import { ConcretePrecisionType } from '../../../type';
import { slot } from '../../../utils';

@register({
    menu: 'Math/Vector/Fresnel',
    title: 'Fresnel',
})
export default class Fresnel extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Fixed;

    data = {
        inputs: [
            slot('Normal', Vec3.ZERO, 'vec3', 'vector'),
            slot('ViewDir', Vec3.ZERO, 'vec3', 'vector'),
            slot('Power', 0, 'float', 'vector'),
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
        return `
            ${output0} = pow((1.0 - saturate(dot(normalize(${input0}), normalize(${input1})))), ${input2});
        `;
    }
}
    