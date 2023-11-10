'use strict';

/**
 * 打包的时候不需要打到 asar 的文件夹
 * 如果不填，则所有的代码都会进入 asar
 * @returns {{files: string[], folders: string[]}}
 */
exports.unpacked = function() {
    return {
        folders: [
            './static/assets',
            './node_modules'
        ]
    };
};

exports.xxtea = function() {
    return [
        [
            'panel-dist/**/*.js',
        ],
        [
            'dist/**/*.js',
        ],
    ];
};

exports.clearSource = function() {
    return [
        './src',
        './panel',
    ];
}