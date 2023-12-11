import { writeFileSync } from 'fs-extra';
import { join } from 'path';

import shaderGraph from './shader-graph';
import { PACKAGE_NAME, GraphDataMgr, getName } from '../shader-graph';

module.paths.push(join(Editor.App.path, 'node_modules'));

const { Asset } = require('@editor/asset-db');

const ShaderGraphHandler = {

    name: shaderGraph.name,

    extends: 'effect',

    assetType: shaderGraph.assetType,

    iconInfo: {
        default: {
            type: 'image',
            value: 'packages://shader-graph/static/asset-icon.png',
        },
    },

    createInfo: {
        generateMenuInfo() {
            return [
                {
                    label: `i18n:${PACKAGE_NAME}.menu.import`,
                    fullFileName: 'New Shader Graph.shadergraph',
                    template: 'db://test.shadergraph', // 无用
                    submenu: [
                        {
                            label: 'Surface',
                            fullFileName: 'New Shader Graph.shadergraph',
                            template: 'Surface', // 无用
                        },
                        {
                            label: 'Unlit',
                            fullFileName: 'New Shader Graph.shadergraph',
                            template: 'Unlit', // 无用
                        },
                    ],
                },
            ];
        },
        async create(options: { target: string, template: string }): Promise<string | null> {
            try {
                let shaderGraph = '';
                const name = getName(options.target);
                switch (options.template) {
                    case 'Surface':
                        shaderGraph = await GraphDataMgr.createDefaultShaderGraph('SurfaceMasterNode', 'Graph', name);
                        break;
                    case 'Unlit':
                        shaderGraph = await GraphDataMgr.createDefaultShaderGraph('UnlitMasterNode', 'Graph', name);
                        break;
                }
                writeFileSync(options.target, shaderGraph);
            } catch (e) {
                console.error(e);
            }
            return options.target;
        },
    },

    // @ts-expect-error
    async open(asset: Asset): Promise<boolean> {
        Editor.Message.send('shader-graph', 'open', asset.uuid);
        return true;
    },

    importer: {
        version: shaderGraph.version,

        migrations: [],

        // @ts-expect-error
        async before(asset: Asset) {
            if (!shaderGraph.existsCacheEffect(asset)) {
                await shaderGraph.generateEffectByAsset(asset);
            }
            shaderGraph.cacheSourceMap.set(asset.uuid, asset._source);
            // @ts-ignore
            asset._source = shaderGraph.getTempEffectCodePath(asset);
            return true;
        },

        // @ts-expect-error
        async after(asset: Asset) {
            const source = shaderGraph.cacheSourceMap.get(asset.uuid);
            if (source) {
                // @ts-ignore
                asset._source = source;
                shaderGraph.cacheSourceMap.delete(asset.uuid);
            }
            return true;
        },
    },
};

export default ShaderGraphHandler;
