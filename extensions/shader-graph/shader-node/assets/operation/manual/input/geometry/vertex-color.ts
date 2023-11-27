import { Vec4 } from 'cc';
import { ShaderNode } from '../../../base';
import { ConcretePrecisionType } from '../../../type';
import { prop, slot } from '../../../utils';
import { register } from '../../../../graph';

@register({
    menu: 'Input/Geometry/VertexColor',
    title: 'VertexColor',
})
export default class VertexColorNode extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Fixed;
    fixedConcretePrecision = 4;

    data = {
        outputs: [
            slot('Out', new Vec4, 'vec4', 'vector'),
        ],
    };

    generateCode() {
        return `${this.getOutputVarDefine(0)} = FSInput_vertexColor;`;
    }
}

