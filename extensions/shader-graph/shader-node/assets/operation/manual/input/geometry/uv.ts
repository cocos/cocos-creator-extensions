import { Vec2 } from 'cc';
import { ShaderNode } from '../../../base';
import { ConcretePrecisionType } from '../../../type';
import { prop, slot } from '../../../utils';
import { register } from '../../../../graph';

@register({
    menu: 'Input/Geometry/UV',
    title: 'UV',
})
export default class UVNode extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Fixed;
    fixedConcretePrecision = 2;

    data = {
        props: [
            prop('Channel', 0, 'float'),
        ],
        outputs: [
            slot('UV', new Vec2, 'vec2', 'vector'),
        ],
    };

    generateCode() {
        const prop = this.getPropWithName('Channel');
        if (!prop) {
            console.warn('UV Node generate code undefined');
            return '';
        }
        const uvName = `v_uv${(prop.value as number) > 0 ? prop.value : ''}`;
        return `${this.getOutputVarDefine(0)} = ${uvName};`;
    }
}

