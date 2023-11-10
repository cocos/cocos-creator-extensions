/**
 * 对vue文件的前置处理
 * 当vue-loader解析出<script>标签内容后会调用ts的相关loader
 * 在本项目中若直接把xxx.vue传递给swc-loader，将会导致swc无法识别
 * 因此仿照ts-loader的appendTsSuffixTo将xxx.vue变为xxx.vue.ts
 * @see https://github.com/TypeStrong/ts-loader#appendtssuffixto
 * 这样的好处在于可以使用到swc的极速编译，已经decorate
 * @param content
 * @param sourceMap
 * @param meta
 * @return {*}
 */
module.exports = function(content, sourceMap, meta) {
    // const logger = this.getLogger('custom-loader');
    // logger.info(content)
    // logger.info(sourceMap)
    // logger.info(meta)
    if (sourceMap && this.resourcePath && this.resourcePath.endsWith('.vue')) {
        this.resourcePath += '.ts';
    }
    return content;
};
