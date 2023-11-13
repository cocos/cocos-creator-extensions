
import { Vec2, Vec3, Vec4 } from 'cc';
import { register } from '../../../graph/register';
import { ShaderNode } from '../../base';
import { ConcretePrecisionType } from '../../type';
import { slot } from '../../utils';

@register({
    menu: 'Uv/RotateCoordinates',
    title: 'RotateCoordinates',
})
export default class RotateCoordinates extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Fixed;
    depChunks = ['uv'];

    data = {
        inputs: [
            slot('uv', Vec2.ZERO, 'vec2', 'vector'),
            slot('center', Vec2.ZERO, 'vec2', 'vector'),
            slot('rotation', 0, 'float', 'vector'),
        ],
        outputs: [
            slot('Out', Vec2.ZERO, 'vec2', 'vector'),
        ],
    };

    calcConcretePrecision() {
        super.calcConcretePrecision();
    }

    generateCode() {
        
        let input0 = this.getInputValue(0);
        if (!this.inputs[0].connectSlot) {
            input0 = 'v_uv.xy';
        }
                    
        const input1 = this.getInputValue(1);
        const input2 = this.getInputValue(2);
        
        const output0 = this.getOutputVarDefine(0);
        return `${output0} = RotateCoordinates(${input0}, ${input1}, ${input2});`;
    }
}
    