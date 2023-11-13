import { Vec3 } from 'cc';
import { ShaderNode } from '../../../base';
import { ConcretePrecisionType, NormalSpace } from '../../../type';
import { getEnumDefine, prop, slot } from '../../../utils';

import { register } from '../../../../graph';

@register({
    menu: 'Input/Geometry/NormalVector',
    title: 'NormalVector',
})
export default class NormalVectorNode extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Fixed;
    fixedConcretePrecision = 3;

    data = {
        props: [
            prop('Space', NormalSpace.World, 'enum', { enum: NormalSpace }),
        ],
        outputs: [
            slot('Normal', Vec3.ZERO, 'vec3', 'vector'),
        ],
    };

    generateCode() {
        const prop = this.getPropWithName('Space');

        let name = 'normal';
        if (prop.value === NormalSpace.Local) {
            name = 'normal';
        }
        else if (prop.value === NormalSpace.View) {
            name = 'viewNormal';
        }
        // else if (prop.value === NormalSpace.Tangent) {
        //     // name = 'tangentNormal';
        //     name = 'worldNormal';
        // }
        else if (prop.value === NormalSpace.World) {
            name = 'worldNormal';
        }

        this.defines = [getEnumDefine(NormalSpace, prop.value)];

        return `${this.getOutputVarDefine(0)} = ${name};`;
    }
}

