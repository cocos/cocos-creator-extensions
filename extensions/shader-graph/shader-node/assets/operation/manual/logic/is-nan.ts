
import { Vec2, Vec3, Vec4 } from 'cc';
import { register } from '../../../graph/register';
import { ShaderNode } from '../../base';
import { ConcretePrecisionType } from '../../type';
import { prop, slot } from '../../utils';

@register({
    menu: 'Logic/IsNan',
    title: 'IsNan',
})
export default class IsNan extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Fixed;
    fixedConcretePrecision = 1;

    data = {
        inputs: [
            slot('In', 0, 'float', 'vector'),
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
            ${output0} = isnan(${i0});
        `;
    }
}
    