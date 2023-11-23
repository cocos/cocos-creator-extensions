import { Vec3 } from 'cc';
import { ShaderNode } from '../../../base';
import { ConcretePrecisionType, ViewDirSpace, PositionSpace } from '../../../type';
import { getEnumDefine, prop, slot } from '../../../utils';
import { register } from '../../../../graph';

@register({
    menu: 'Input/Geometry/ViewDirection',
    title: 'ViewDirection',
})
export default class ViewDirection extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Fixed;
    fixedConcretePrecision = 3;

    get type() {
        return 'ViewDirection';
    }

    data = {
        props: [
            prop('Space', ViewDirSpace.World, 'enum', { enum: ViewDirSpace }),
        ],
        outputs: [
            slot('ViewDirection', new Vec3, 'vec3', 'vector'),
        ],
    };

    generateCode() {
        const space = this.getPropWithName('Space');

        let name = 'view';
        if (space.value === ViewDirSpace.Local) {
            name = 'view';
        }
        else if (space.value === ViewDirSpace.View) {
            name = 'viewView';
        }
        // else if (space.value === ViewDirSpace.Tangent) {
        //     // name = 'tangentView';
        //     name = 'worldView';
        // }
        else if (space.value === ViewDirSpace.World) {
            name = 'worldView';
        }

        this.defines = [getEnumDefine(ViewDirSpace, space.value)];

        return `${this.getOutputVarDefine(0)} = ${name};`;
    }
}

