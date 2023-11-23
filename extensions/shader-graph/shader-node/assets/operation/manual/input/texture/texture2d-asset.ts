import TextureAssetNode from './texture-asset';

export default class Texture2DAsset extends TextureAssetNode {
    generateCode() {
        return `sampler2D ${this.getOutputVarName(0)} = ${this.getInputValue(0)};`;
    }
}
