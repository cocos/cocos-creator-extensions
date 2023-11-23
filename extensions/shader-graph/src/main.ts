import { PACKAGE_NAME, PANEL_NAME } from './shader-graph/global-exports';

/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    openPanel() {
        Editor.Panel.open(PACKAGE_NAME);
    },

    async openShaderGraph(assetUuid: string) {
        const lastAssetUuid = await Editor.Profile.getConfig(PACKAGE_NAME, 'asset-uuid', 'local');
        await Editor.Profile.setConfig(PACKAGE_NAME, 'asset-uuid', assetUuid, 'local');

        if (await Editor.Panel.has(PANEL_NAME)) {
            Editor.Message.send(PACKAGE_NAME, 'open-asset', assetUuid, lastAssetUuid);
            return;
        }

        await Editor.Panel.open(PANEL_NAME);
    },
};

/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
export function load() {

}

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export function unload() { }

