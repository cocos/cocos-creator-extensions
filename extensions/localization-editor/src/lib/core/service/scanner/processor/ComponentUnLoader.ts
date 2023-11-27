import { Scene, Prefab, Asset, SceneAsset, CCObject, Node } from 'cc';
import { autoInjectable } from 'tsyringe';
import AssetSerializeService from '../serialize/AssetSerializeService';
import { AssetInfo } from '@cocos/creator-types/editor/packages/asset-db/@types/public';
import SceneProcessor from './SceneProcessor';

@autoInjectable()
export default class ComponentUnLoader {
    constructor(
        public assetSerializeService: AssetSerializeService,
    ) {
    }

    process(assetInfo: AssetInfo) {
        let baseNode: Scene | any | null = null;
        let asset!: Asset;
        if (assetInfo.type.includes('Scene')) {
            const sceneAsset = this.assetSerializeService.deserializeFile<SceneAsset>(assetInfo.file);
            asset = sceneAsset;
            baseNode = sceneAsset.scene;
        } else if (assetInfo.type.includes('Prefab')) {
            const prefabAsset = this.assetSerializeService.deserializeFile<Prefab>(assetInfo.file);
            asset = prefabAsset;
            baseNode = prefabAsset.data;
        }
        if (!baseNode) return;
        const destroyCount = this.unloadComponent(baseNode);
        if (destroyCount > 0) {
            this.assetSerializeService.serialize(assetInfo.file, asset);
        }
    }

    unloadComponent(node: Node): number {
        const components = node.getComponentsInChildren(SceneProcessor.L10nLabelComponentName).concat(
                           node.getComponentsInChildren(SceneProcessor.ICUComponentName));

        components.forEach(component => component.destroy());
        CCObject._deferredDestroy();
        return components.length;
    }
}
