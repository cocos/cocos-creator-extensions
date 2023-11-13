import { ShaderNode } from '../../../base';
import { ConcretePrecisionType } from '../../../type';

export default class TextureAsset extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Texture;
}

