import InputNode from '../input-node';
import { NormalMapSpace, NormalSpace, ConcretePrecisionType, ViewDirSpace } from '../../../type';
import PropertyNode from '../property-node';

export default class SampleTexture2D extends InputNode {

    generateCode() {
        const cubeSlot = this.getSlotWithSlotName('Cube');
        const node = cubeSlot?.connectSlot && cubeSlot?.connectSlot.node as PropertyNode;
        if (!node) {
            return '';
        }

        let V = 'view';
        let N = 'normal';

        const viewSlot = this.getSlotWithSlotName('ViewDir');
        if (viewSlot?.connectSlot) {
            V = viewSlot?.connectSlot.varName;
        }
        const normalSlot = this.getSlotWithSlotName('Normal');
        if (normalSlot?.connectSlot) {
            N = normalSlot?.connectSlot.varName;
        }

        const R = `${this.getOutputVarName(0)}_R`;

        let code = '';
        code += `vec3 ${R} = reflect( -normalize( ${V} ), ${N} );\n`;
        code += `${this.getOutputVarDefine(0)} = texture(${node.property?.name}, ${R});\n`;
        return code;
    }
}

