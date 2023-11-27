
import { Vec2, Vec3, Vec4 } from 'cc';
import { register } from '../../../../graph/register';
import { ShaderNode } from '../../../base';
import { ConcretePrecisionType } from '../../../type';
import { slot } from '../../../utils';

@register({
    menu: 'Input/Basic/Vector2',
    title: 'Vector2',
})
export default class Vector2 extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Fixed;

    data = {
        inputs: [
            slot('X', 0, 'float', 'vector'),
            slot('Y', 0, 'float', 'vector'),
        ],
        outputs: [
            slot('Out', Vec2.ZERO, 'vec2', 'vector'),
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
            ${output0} = vec2(${input0}, ${input1});
        `;
    }
}
    