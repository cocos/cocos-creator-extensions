import { MenuAssetInfo } from '@cocos/creator-types/editor/packages/package-asset/@types/public';
import { PACKAGE_NAME, DEFAULT_ASSET_NAME, GraphDataMgr, getName } from '../shader-graph';

function getMenu(assetInfo: MenuAssetInfo) {
    const AssetsURL = assetInfo ? assetInfo.url : 'db://assets';
    return {
        label: `i18n:${PACKAGE_NAME}.menu.import`,
        submenu: [
            {
                label: 'Surface',
                async click() {
                    const url = await Editor.Message.request('asset-db', 'generate-available-url', `${AssetsURL}/${DEFAULT_ASSET_NAME}`);
                    const shaderGraph = await GraphDataMgr.createDefaultShaderGraph('SurfaceMasterNode', 'Graph', getName(url));
                    const asset = await Editor.Message.request('asset-db', 'create-asset', url, shaderGraph);
                },
            },
            {
                label: 'Unlit',
                async click() {
                    const url = await Editor.Message.request('asset-db', 'generate-available-url', `${AssetsURL}/${DEFAULT_ASSET_NAME}`);
                    const shaderGraph = await GraphDataMgr.createDefaultShaderGraph('UnlitMasterNode', 'Graph', getName(url));
                    await Editor.Message.request('asset-db', 'create-asset', url, shaderGraph);
                },
            },
        ],

    };
}

/**
 * assets 扩展普通资源节点的右键菜单，能够拿到右键资源节点的信息 assetInfo 作为参数
 * @param assetInfo
 */
export function createMenu(assetInfo: MenuAssetInfo) {
    return [
        getMenu(assetInfo),
    ];
}

