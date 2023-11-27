/**
 * npm install 各个插件
 */
const { runCommandForExtensions } = require("./common");

(async () => {
  // --ext="名字" 或 --extension="名字" 单独执行一个插件
  // --legacy-peer-deps -> 跳过下载 peerDependencies 依赖
  await runCommandForExtensions([
    'npm install --legacy-peer-deps',
    'npm run build',
  ]);
})();
