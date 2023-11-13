'use strict';

import { gte } from 'semver';

/**
 * 插件 register 的时候，触发这个钩子
 * 钩子内可以动态更改 package.json 内定义的数据
 *
 * @param info
 */
exports.register = async function(info: { [key: string]: any}) {
    const version = Editor.App.version;
    // 3.9.0 使用新版本的添加菜单方式，移除旧的方式
    if (gte(version, '3.9.0')) {
        delete info.contributions.assets.menu;
    }
};
