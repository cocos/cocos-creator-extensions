import { Vec3 } from 'cc';
import { ShaderNode } from '../../../base';
import { ConcretePrecisionType, PositionSpace } from '../../../type';
import { getEnumDefine, prop, slot } from '../../../utils';
import { register } from '../../../../graph';

@register({
    menu: 'Input/Geometry/Position',
    title: 'Position',
})
export default class PositionNode extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Fixed;
    fixedConcretePrecision = 3;

    data = {
        props: [
            prop('Space', PositionSpace.World, 'enum', { enum: PositionSpace }),
        ],
        outputs: [
            slot('Position', new Vec3, 'vec3', 'vector'),
        ],
    };

    generateCode() {
        const prop = this.getPropWithName('Space');

        let name = 'position';
        if (prop.value === PositionSpace.Local) {
            name = 'position';
        }
        else if (prop.value === PositionSpace.View) {
            name = 'viewPos';
        }
        // else if (prop.value === PositionSpace.Tangent) {
        //     // name = 'v_tangentPos';
        //     name = 'worldPos';
        // }
        else if (prop.value === PositionSpace.World) {
            name = 'worldPos';
        }
        // else if (prop.value === PositionSpace.AbsoluteWorld) {
        //     name = 'worldPos';
        // }

        this.defines = [getEnumDefine(PositionSpace, prop.value)];

        return `${this.getOutputVarDefine(0)} = ${name}.xyz;`;
    }
}

