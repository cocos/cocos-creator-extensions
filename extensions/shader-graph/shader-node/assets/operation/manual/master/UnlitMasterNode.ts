import MasterNode, { MasterSlotType } from './MasterNode';
import { slot, path } from '../../utils';
import { register } from '../../../graph';
import { Color, Vec3, Vec4 } from 'cc';
import { shaderContext } from '../../context';
import { ShaderNode } from '../../base';

@register({
    title: 'Unlit',
    master: true,
})
export default class UnlitMasterNode extends MasterNode {

    get templatePath() {
        return path.join(shaderContext.shaderTemplatesDir, 'master/UnlitMasterNode.effect');
    }

    data = {
        inputs: [
            slot('Vertex Position', Vec3.ZERO, 'vec3', 'vector', { slotType: MasterSlotType.Vertex, codeChunk: 0 }),
            slot('Vertex Normal', Vec3.ZERO, 'vec3', 'vector', { slotType: MasterSlotType.Vertex, codeChunk: 0 }),
            slot('Vertex Tangent', Vec3.ZERO, 'vec3', 'vector', { slotType: MasterSlotType.Vertex, codeChunk: 0 }),

            slot('BaseColor', new Vec4(0.5, 0.5, 0.5, 0.5), 'color', 'vector', { slotType: MasterSlotType.Fragment, codeChunk: 3 }),
            slot('Alpha', 1, 'float', 'vector', { slotType: MasterSlotType.Fragment, codeChunk: 3 }),
            slot('AlphaClipThreshold', 0, 'float', 'vector', { slotType: MasterSlotType.Fragment, codeChunk: 3 }),

        ],
    };

    static generatePreviewCode(node: ShaderNode) {
        const tempNode = new UnlitMasterNode();
        tempNode.init();
        
        const baseColor = tempNode.getSlotWithSlotName('BaseColor');
        if (baseColor) {
            baseColor.connectSlots[0] = node.outputs[0];
        }

        return tempNode.generateCode();
    }

}
