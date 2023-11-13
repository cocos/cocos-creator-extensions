import { Scene, Prefab, Asset, SceneAsset, Node, Label, instantiate } from 'cc';
import { autoInjectable } from 'tsyringe';
import IProcessor from './IProcessor';
import { AssetInfo } from '@cocos/creator-types/editor/packages/asset-db/@types/public';
import AssetSerializeService from '../serialize/AssetSerializeService';
import TranslateItem from '../../../entity/translate/TranslateItem';
import Association from '../../../entity/translate/Association';
import TranslateItemType from '../../../entity/translate/TranslateItemType';
import UUIDService from '../../util/UUIDService';
import { TranslateItemArray, TranslateItemKey, TranslateItemValue } from '../../../type/type';

type AddComponentResult = { key: string, added: boolean }

@autoInjectable()
export default class SceneProcessor implements IProcessor {
    started = true;

    static readonly L10nLabelComponentName = 'L10nLabel';

    static readonly ICUComponentName = 'ICUComponent';

    static readonly L10nComponentName = 'L10nComponent';

    constructor(
        public assetSerializeService: AssetSerializeService,
        public uuidService: UUIDService,

    ) { }

    private translateItemValueMap!: Map<TranslateItemValue, TranslateItem>;

    async process(assetInfo: AssetInfo, translateItemValueMap: Map<TranslateItemValue, TranslateItem>): Promise<TranslateItemArray> {
        this.translateItemValueMap = translateItemValueMap;
        let baseNode: Scene | any | null = null;
        let asset!: Asset;
        if (assetInfo.type.includes('Scene')) {
            const sceneAsset = this.assetSerializeService.deserializeFile<SceneAsset>(assetInfo.file);
            baseNode = sceneAsset.scene;
            asset = sceneAsset;
        } else if (assetInfo.type.includes('Prefab')) {
            const prefabAsset: Prefab = this.assetSerializeService.deserializeFile<Prefab>(assetInfo.file);
            baseNode = prefabAsset.data;
            asset = prefabAsset;
        }
        if (!baseNode) return [];
        const result = this.scan(baseNode, assetInfo);
        if (result.length > 0) {
            this.assetSerializeService.serialize(assetInfo.file, asset);
        }
        return Promise.resolve(Array.from(result.values()));
    }

    scan(baseNode: Node, assetInfo: AssetInfo): TranslateItem[] {
        const result: TranslateItem[] = [];
        const labels = baseNode.getComponentsInChildren(Label);
        labels.forEach((label: Label) => {
            if (label.node.getComponent(SceneProcessor.ICUComponentName) ||
                label.node.getComponent(SceneProcessor.L10nLabelComponentName)
            ) {
                return;
            }
            const sameValueItem = this.translateItemValueMap.get(label.string);
            const addComponentResult = this.addComponent(label.node, sameValueItem?.key);

            const association = Association.create({
                sceneUuid: assetInfo.uuid,
                nodeUuid: label.node.uuid,
                reference: assetInfo.uuid,
            });

            let translateItem!: TranslateItem;
            if (!sameValueItem) {
                translateItem = new TranslateItem(
                    addComponentResult.key,
                    label.string,
                    TranslateItemType.Text,
                );
                this.translateItemValueMap.set(label.string, translateItem);
                result.push(translateItem);
                translateItem.associations.push(association);
            } else {
                sameValueItem.associations.push(association);
                translateItem = sameValueItem;
            }
            if (addComponentResult.added) {
                result.push(translateItem);
            }
        });
        return result;
    }

    private addComponent(node: Node, key?: TranslateItemKey): AddComponentResult {
        let component = node.getComponent(SceneProcessor.L10nComponentName);
        let added = false;
        if (!component) {
            component = node.addComponent(SceneProcessor.L10nLabelComponentName);
            added = true;
            if (key) {
                // @ts-ignore
                component.key = key;
            } else {
                // @ts-ignore
                component.key = this.uuidService.v4();
            }
        }
        return {
            // @ts-ignore
            key: component.key as string,
            added,
        };
    }

    cancel(): void {
        this.started = false;
    }
}
