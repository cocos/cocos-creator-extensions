
import { Vec2, Vec3, Vec4 } from 'cc';
import { register } from '../../../graph/register';
import { ShaderNode } from '../../base';
import { ConcretePrecisionType } from '../../type';
import { prop, slot } from '../../utils';

@register({
    menu: 'Logic/Not',
    title: 'Not',
})
export default class Not extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Max;

    data = {
        inputs: [
            slot('In', false, 'boolean', 'boolean'),
        ],
        outputs: [
            slot('Out', false, 'boolean', 'boolean'),
        ],
    };

    calcConcretePrecision() {
        super.calcConcretePrecision();
    }

    generateCode() {
        const i0 = this.getInputValue(0);
        
        const output0 = this.getOutputVarDefine(0);

        return `
            ${output0} = (!${i0});
        `;
    }
}
    