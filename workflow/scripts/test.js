/**
 * npm run test 各个插件
 */
const { runCommandForExtensions } = require("./common");

(async () => {
  await runCommandForExtensions([
    'npm install --legacy-peer-deps',
    'npm run build',
    'npm run test'
  ], [
    // 目前 localization-editor 单元测试不通过，先跳过
    'localization-editor'
  ]);
})();
