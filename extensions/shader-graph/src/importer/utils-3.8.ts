import { basename, extname, join, resolve } from 'path';

module.paths.push(join(Editor.App.path, 'node_modules'));

const { AssetDB, forEach, Asset } = require('@editor/asset-db');

// @ts-ignore
import { CCON } from 'cc/editor/serialization';
import { buildEffect } from '../effect-utils';

declare const EditorExtends: any;
declare const cc: any;

async function loadTexture(assetId: string): Promise<any | null> {
    return new Promise((resolve) => {
        cc.assetManager.loadAny(assetId, (error: any, asset: any) => {
            if (!error) {
                resolve(asset);
            } else {
                resolve(null);
            }
        });
    });
}

/**
 * 在 library 里生成对应的 effectAsset 对象
 * @param asset 资源数据
 * @param code
 */
// @ts-expect-error
export async function generateEffectAsset(asset: Asset, code: string){
    const name = basename(asset.source, extname(asset.source));

    const effect = await buildEffect(name, code);

    // 记录 effect 的头文件依赖
    // @ts-expect-error
    forEach((db: AssetDB) => {
        for (const header of effect.dependencies) {
            asset.depend(resolve(db.options.target, 'chunks', header + '.chunk'));
        }
    });

    const result = new cc.EffectAsset();
    Object.assign(result, effect);

    // 引擎数据结构不变，保留 hideInEditor 属性
    if (effect.editor && effect.editor.hide) {
        result.hideInEditor = true;
    }

    for (let n = 0; n < result.techniques.length; n++) {
        const technique = result.techniques[n];
        for (let i = 0; i < technique.passes.length; i++) {
            const pass = technique.passes[i];
            for (const key in pass.properties) {
                const propInfo = pass.properties[key];
                if (typeof propInfo.value === 'string') {
                    const assetId = propInfo.value as string;
                    if (Editor.Utils.UUID.isUUID(assetId)) {
                        const asset = await loadTexture(assetId);
                        if (asset) {
                            propInfo.value = asset;
                        }
                    }
                }
            }
        }
    }

    // 添加 meta 文件中的 combinations
    if (asset.userData) {
        if (asset.userData.combinations) {
            result.combinations = asset.userData.combinations;
        }

        if (effect.editor) {
            asset.userData.editor = effect.editor;
        } else {
            // 已存在的需要清空
            asset.userData.editor = undefined;
        }
    }

    const serializeJSON = EditorExtends.serialize(result);
    await asset.saveToLibrary('.json', serializeJSON);

    const depends = getDependUUIDList(serializeJSON);
    asset.setData('depends', depends);
}

export function getDependUUIDList(content: string | CCON | Object, uuid?: string) {
    if (typeof content === 'string') {
        // 注意：此方法无法匹配出脚本引用的 uuid
        let arr = content.match(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}(@[a-z0-9]+){0,}/g);
        if (arr) {
            // https://stackoverflow.com/questions/32813720/nodejs-profiling-parent-in-sliced-string
            arr = JSON.parse(JSON.stringify(Array.from(new Set(arr)).filter((id) => id !== uuid)));
        }
        // const arr = content.match(/"__uuid__":( )?"[^"]+/g);
        return arr || [];
    }
    // console.warn('Unable to extract dependencies properly');

    return getDeserializeResult(content).uuids;
}

export function getDeserializeResult(json: CCON | Object) {
    const deserializeDetails = new cc.deserialize.Details();
    deserializeDetails.reset();
    const MissingClass = EditorExtends.MissingReporter.classInstance;
    MissingClass.reset();
    MissingClass.hasMissingClass = false;
    const dependScriptID = new Set();
    function classFinder(classId: string) {
        if (Editor.Utils.UUID.isUUID(classId)) {
            dependScriptID.add(Editor.Utils.UUID.decompressUUID(classId));
        }
        return MissingClass.classFinder(classId);
    }
    const deserializedAsset = cc.deserialize(json, deserializeDetails, {
        classFinder,
    });
    deserializeDetails.assignAssetsBy(function(uuid: string, options: { owner: object; prop: string; type: Function }) {
        return EditorExtends.serialize.asAsset(uuid);
    });
    return {
        instance: deserializedAsset,
        uuids: deserializeDetails.uuidList,
        dependScriptUuids: Array.from(dependScriptID),
        classFinder: MissingClass.classFinder,
    };
}
