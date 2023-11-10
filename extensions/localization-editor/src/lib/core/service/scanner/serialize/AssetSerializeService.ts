import * as cc from 'cc';
import { singleton } from 'tsyringe';
import { readFileSync } from 'fs';
import { writeFileSync } from 'fs-extra';

@singleton()
export default class AssetSerializeService {
    deserializeFile <T = cc.SceneAsset | cc.Prefab>(file: string): T {
        const content = readFileSync(file, 'utf-8');
        const missingClass = EditorExtends.MissingReporter.classInstance;
        const classFinder = (type: any, data: any, owner: any, propName: string): Constructor => {
            const result = missingClass.classFinder(type, data, owner, propName);
            if (result) {
                return result as Constructor;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return cc.MissingScript;
        };
        classFinder.onDereferenced = missingClass.classFinder.onDereferenced;
        const deserializeDetails = new cc.deserialize.Details();
        deserializeDetails.reset();
        return cc.deserialize(content, deserializeDetails, { createAssetRefs: true, classFinder }) as T;
    }

    serialize(file: string, asset: cc.Asset, withWrite = true): string {
        let content!: string;
        if (asset instanceof cc.Prefab) {
            const obj = cce.Prefab.generatePrefabDataFromNode(asset.data)!;
            if (typeof obj === 'string') {
                content = obj;
            } else {
                content = obj!.prefabData;
            }
        } else {
            content = EditorExtends.serialize(asset) as string;
        }
        if (withWrite) {
            writeFileSync(file, content, 'utf-8');
        }
        return content;
    }
}
