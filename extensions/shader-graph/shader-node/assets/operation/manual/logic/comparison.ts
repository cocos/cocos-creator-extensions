
import { Vec2, Vec3, Vec4 } from 'cc';
import { register } from '../../../graph/register';
import { ShaderNode } from '../../base';
import { ConcretePrecisionType } from '../../type';
import { prop, slot } from '../../utils';

enum ComparisonType {
    Equal,
    NotEqual,
    Less,
    LessOrEqual,
    Greater,
    GreaterOrEqual,
}

@register({
    menu: 'Logic/Comparison',
    title: 'Comparison',
})
export default class Comparison extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Fixed;
    fixedConcretePrecision = 1;

    data = {
        props: [
            prop('Type', ComparisonType.Equal, 'enum', { enum: ComparisonType }),
        ],
        inputs: [
            slot('A', 0, 'float', 'vector'),
            slot('B', 0, 'float', 'vector'),
        ],
        outputs: [
            slot('Out', 0, 'boolean', 'boolean'),
        ],
    };

    calcConcretePrecision() {
        super.calcConcretePrecision();
    }

    generateCode() {
        const A = this.getInputValue(0);
        const B = this.getInputValue(1);
        
        const output0 = this.getOutputVarDefine(0);

        let code = '';

        const type = this.getPropWithName('Type');
        switch (type.value) {
            case ComparisonType.Equal:
                code = `(${A} == ${B})`;
                break;
            case ComparisonType.NotEqual:
                code = `(${A} != ${B})`;
                break;
            case ComparisonType.Less:
                code = `(${A} < ${B})`;
                break;
            case ComparisonType.LessOrEqual:
                code = `(${A} <= ${B})`;
                break;
            case ComparisonType.Greater:
                code = `(${A} > ${B})`;
                break;
            case ComparisonType.GreaterOrEqual:
                code = `(${A} >= ${B})`;
                break;
        }

        return `
            ${output0} = ${code};
        `;
    }
}
    