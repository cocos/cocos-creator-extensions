import { Vec4 } from 'cc';
import { register } from '../../../graph';
import { ShaderNode } from '../../base';
import { ConcretePrecisionType } from '../../type';
import { slot } from '../../utils';

@register({
    menu: 'Channel/Split',
    title: 'Split',
})
export default class SplitNode extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Fixed;

    data = {
        inputs: [
            slot('Vector', new Vec4, 'vec4', 'vector'),
        ],
        outputs: [
            slot('R', 0, 'float', 'vector'),
            slot('G', 0, 'float', 'vector'),
            slot('B', 0, 'float', 'vector'),
            slot('A', 0, 'float', 'vector'),
        ],
    };

    generateCode() {
        const Value = this.getInputValue(0);
        const codes: string[] = [];
        this.data.outputs.forEach(o => {
            const slot = this.getOutputSlotWithSlotName(o.display);
            if (slot && slot.connectSlot) {
                codes.push(`float ${slot?.varName} = ${Value}.${o.display.toLowerCase()};`);
            }
        });

        return codes.join('\n');
    }
}
