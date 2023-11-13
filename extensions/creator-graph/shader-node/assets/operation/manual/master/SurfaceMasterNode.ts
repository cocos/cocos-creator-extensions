import MasterNode, { MasterSlotDefine, MasterSlotType } from './MasterNode';
import { slot } from '../../utils';
import { NormalSpace, PositionSpace } from '../../type';

import { Vec3, Color, Vec4 } from 'cc';
import { path } from '../../utils';
import { register } from '../../../graph';
import { shaderContext } from '../../context';

@register({
    title: 'Surface',
    master: true,
})
export default class SurfaceMasterNode extends MasterNode {
    get templatePath() {
        return path.join(shaderContext.shaderTemplatesDir, 'master/SurfaceMasterNode.effect');
    }

    data = {
        inputs: [
            slot('Vertex Position', Vec3.ZERO, 'vec3', 'vector', { slotType: MasterSlotType.Vertex, codeChunk: 0 }),
            slot('Vertex Normal', Vec3.ZERO, 'vec3', 'vector', { slotType: MasterSlotType.Vertex, codeChunk: 0 }),
            slot('Vertex Tangent', Vec3.ZERO, 'vec3', 'vector', { slotType: MasterSlotType.Vertex, codeChunk: 0 }),

            slot('Albedo', new Vec4(0.5, 0.5, 0.5, 0.5), 'color', 'vector', { slotType: MasterSlotType.Fragment, codeChunk: 3 }),
            slot('Normal', Vec3.ZERO, 'vec3', 'vector', { slotType: MasterSlotType.Fragment, codeChunk: 3 }),
            slot('Emission', Vec3.ZERO, 'vec3', 'vector', { slotType: MasterSlotType.Fragment, codeChunk: 3 }),
            slot('Metallic', 0.6, 'float', 'vector', { slotType: MasterSlotType.Fragment, codeChunk: 3 }),
            slot('Roughness', 0.5, 'float', 'vector', { slotType: MasterSlotType.Fragment, codeChunk: 3 }),
            slot('Occlusion', 1, 'float', 'vector', { slotType: MasterSlotType.Fragment, codeChunk: 3 }),
            slot('SpecularIntensity', 0.5, 'float', 'vector', { slotType: MasterSlotType.Fragment, codeChunk: 3 }),
            slot('Alpha', 1, 'float', 'vector', { slotType: MasterSlotType.Fragment, codeChunk: 3 }),
            slot('AlphaClipThreshold', 0.5, 'float', 'vector', { slotType: MasterSlotType.Fragment, codeChunk: 3 }),

            slot('AnisotropyRotation', 0, 'float', 'vector', { slotType: MasterSlotType.Fragment, codeChunk: 3 }),
            slot('AnisotropyShape', 1, 'float', 'vector', { slotType: MasterSlotType.Fragment, codeChunk: 3 }),
        ],
    };

    generateCode() {
        const AnisotropyRotationConnected = this.getSlotWithSlotName('AnisotropyRotation')?.connectSlot;
        const AnisotropyShapeConnected = this.getSlotWithSlotName('AnisotropyShape')?.connectSlot;

        // if (AnisotropyRotationConnected || AnisotropyShapeConnected) {
        //     this.defines = [
        //         '#define CC_SURFACES_LIGHTING_ANISOTROPIC IS_ANISOTROPY',
        //         '#define CC_SURFACES_LIGHTING_ANISOTROPIC_ENVCONVOLUTION_COUNT 15',
        //     ];
        // }

        return super.generateCode();
    }

}
