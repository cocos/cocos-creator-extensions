
import { join } from 'path';
module.paths.push(join(Editor.App.path, 'node_modules'));

const { Asset, Importer } = require('@editor/asset-db');

import shaderGraph from './shader-graph';
import { generateEffectAsset } from './utils-3.8';

export class ShaderGraph380 extends Importer {

    // 引擎内对应的类型
    get assetType() {
        return shaderGraph.assetType;
    }

    get version() {
        return shaderGraph.version;
    }

    get name() {
        return shaderGraph.name;
    }

    get migrations() {
        return shaderGraph.migrations;
    }

    /**
     * 返回是否导入成功的标记
     * 如果返回 false，则 imported 标记不会变成 true
     * 后续的一系列操作都不会执行
     * @param asset
     */
    // @ts-expect-error
    public async import(asset: Asset) {
        try {
            await generateEffectAsset(asset, await shaderGraph.generateEffectByAsset(asset));
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}
