
import { Vec2, Vec3, Vec4 } from 'cc';
import { register } from '../../../../graph/register';
import { ShaderNode } from '../../../base';
import { ConcretePrecisionType } from '../../../type';
import { slot } from '../../../utils';

@register({
    menu: 'Math/Vector/SphereMask',
    title: 'SphereMask',
})
export default class SphereMask extends ShaderNode {

    data = {
        inputs: [
            slot('Coords', Vec4.ZERO, 'vec4', 'vector'),
            slot('Center', Vec4.ZERO, 'vec4', 'vector'),
            slot('Radius', 0, 'float', 'vector'),
            slot('Hardness', 0, 'float', 'vector'),
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
        const input3 = this.getInputValue(3);
        
        const output0 = this.getOutputVarDefine(0);
        return `
            ${output0} = 1 - saturate((distance(${input0}, ${input1}) - ${input2}) / (1 - ${input3}));
        `;
    }
}
    