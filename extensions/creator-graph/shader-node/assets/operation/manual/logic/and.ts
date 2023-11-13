
import { Vec2, Vec3, Vec4 } from 'cc';
import { register } from '../../../graph/register';
import { ShaderNode } from '../../base';
import { ConcretePrecisionType } from '../../type';
import { prop, slot } from '../../utils';

@register({
    menu: 'Logic/And',
    title: 'And',
})
export default class And extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Max;

    data = {
        inputs: [
            slot('A', false, 'boolean', 'boolean'),
            slot('B', false, 'boolean', 'boolean'),
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
        const i1 = this.getInputValue(1);
        
        const output0 = this.getOutputVarDefine(0);

        return `
            ${output0} = (${i0} && ${i1});
        `;
    }
}
    