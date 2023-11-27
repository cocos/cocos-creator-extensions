import TextureAsset from './texture-asset';

export default class CubemapAsset extends TextureAsset {
    generateCode() {
        return `samplerCube ${this.getOutputVarName(0)} = ${this.getInputValue(0)};`;
    }
}
