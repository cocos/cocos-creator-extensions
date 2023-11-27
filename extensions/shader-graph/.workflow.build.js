'use strict';

/**
 * 需要编译的 ts 文件夹
 * @returns {string[]}
 */
exports.tsc = function() {
    return [
        './',
    ];
};

/**
 * 需要编译的 less 文件夹
 * @returns {{source: string, dist: string}[]}
 */
exports.lessc = function() {
    return [
        {
            source: './static/shader-graph/style.less',
            dist: './static/shader-graph/style.css',
        },
    ];
};

/**
 * 需要复制的静态文件夹
 * @returns {string[]}
 */
exports.file = function() {
    return [];
};

/**
 * 需要执行的 npm 命令
 * 所有命令串行执行
 * @returns {{message: string, params: string[], path: string, detail: string}[]}
 */
exports.npm = function() {
    return [];
};
