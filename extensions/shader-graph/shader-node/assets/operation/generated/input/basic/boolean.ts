
import { Vec2, Vec3, Vec4 } from 'cc';
import { register } from '../../../../graph/register';
import { ShaderNode } from '../../../base';
import { ConcretePrecisionType } from '../../../type';
import { slot } from '../../../utils';

@register({
    menu: 'Input/Basic/Boolean',
    title: 'Boolean',
})
export default class Boolean extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Fixed;

    data = {
        inputs: [
            slot('In', 0, 'float', 'vector'),
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
        
        const output0 = this.getOutputVarDefine(0);
        return `
            ${output0} = ${input0};
        `;
    }
}
    