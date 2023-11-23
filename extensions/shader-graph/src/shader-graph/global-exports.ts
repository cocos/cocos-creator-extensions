import { join } from 'path';
// @ts-ignore
import PACKAGE_JSON from '../../package.json';

const PROJECT_PATH = join(Editor.Project.path, 'assets');

const PACKAGE_NAME = PACKAGE_JSON.name;

const PANEL_NAME = `${PACKAGE_NAME}.shader-graph`;

const DEFAULT_NAME = 'New Shader Graph';

const DEFAULT_ASSET_NAME = `${DEFAULT_NAME}.shadergraph`;

const SUB_GRAPH_NODE_TYPE = 'SubGraphNode';

export {
    PACKAGE_JSON,
    PROJECT_PATH,
    DEFAULT_NAME,
    DEFAULT_ASSET_NAME,
    SUB_GRAPH_NODE_TYPE,
    PANEL_NAME,
    PACKAGE_NAME,
};

