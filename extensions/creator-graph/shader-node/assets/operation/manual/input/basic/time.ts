import { slot } from '../../../utils';
import InputNode from '../input-node';

import { register } from '../../../../graph';

@register({
    menu: 'Input/Basic/Time',
    title: 'Time',
})
export default class TimeNode extends InputNode {
    data = {
        outputs: [
            slot('Time', 0, 'float', 'vector'),
            slot('Sine Time', 0, 'float', 'vector'),
            slot('Cosine Time', 0, 'float', 'vector'),
            slot('Delta Time', 0, 'float', 'vector'),
            slot('Smooth Delta', 0, 'float', 'vector'),
        ],
    };

    generateCode() {
        const Time = this.getOutputSlotWithSlotName('Time');
        const SineTime = this.getOutputSlotWithSlotName('Sine Time');
        const CosineTime = this.getOutputSlotWithSlotName('Cosine Time');
        const DeltaTime = this.getOutputSlotWithSlotName('Delta Time');
        const SmoothDelta = this.getOutputSlotWithSlotName('Smooth Delta');

        let code = '';
        if (Time?.connectSlot) {
            code += `float ${Time.varName} = cc_time.x;`;
        }
        if (SineTime?.connectSlot) {
            code += `float ${SineTime.varName} = sin(cc_time.x);`;
        }
        if (CosineTime?.connectSlot) {
            code += `float ${CosineTime.varName} = cos(cc_time.x);`;
        }
        if (DeltaTime?.connectSlot) {
            code += `float ${DeltaTime.varName} = cc_time.y;`;
        }
        if (SmoothDelta?.connectSlot) {
            console.warn('Not support smooth delta time');
            code += `float ${SmoothDelta.varName} = cc_time.y;`;
        }

        return code;
    }
}

