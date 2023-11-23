'use strict';

/**
 * 打包的时候删除源码
 * 如果不填，会默认过滤一些可能需要删除的代码
 * @returns {string[]}
 */
exports.clearSource = function() {
    return [];
};

/**
 * 加密源码
 * 返回一个字符串数组，glob 搜索语法
 * 如果不填或者返回空数组，会加密所有扫描到的 js 文件（ts 编译后的 js）
 * @returns {string[]}
 */
exports.xxtea = function() {
    return [];
};

/**
 * 打包的时候不需要打到 asar 的文件夹
 * 如果不填，则所有的代码都会进入 asar
 * @returns {string[]}
 */
exports.unpacked = function() {
    return [];
};

/**
 * 打包的时候的预处理方法
 * 可以在 generate 里做一些需要在打包的时候处理的特殊逻辑
 */
exports.generate = async function() {

};
