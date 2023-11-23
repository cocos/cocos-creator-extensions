import { Color, Vec4 } from 'cc';
import InputNode from '../input-node';
import { prop, slot } from '../../../utils';
import { register } from '../../../../graph';

@register({
    menu: 'Input/Basic/Color',
    title: 'Color',
})
export default class ColorNode extends InputNode {
    fixedConcretePrecision = 4;

    data = {
        props: [
            prop('Color', new Vec4, 'color'),
        ],
        outputs: [
            slot('Out', new Vec4, 'vec4', 'vector'),
        ],
    };

    generateCode() {
        const prop = this.getPropWithName('Color');
        const c = prop.value as Color;
        return `vec4 ${this.getOutputVarName(0)} = vec4(${c.x}, ${c.y}, ${c.z}, ${c.w});`;
    }
}

