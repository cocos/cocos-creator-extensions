/**
 * 执行一次，然后构建出 zip 包
 */

const { runCommandForExtensions } = require("./common");
const { join } = require("path");

(async () => {
  // --ext="名字" 或 --extension="名字" 单独执行一个插件
  // --legacy-peer-deps -> 跳过下载 peerDependencies 依赖
  await runCommandForExtensions([
    'npm install --legacy-peer-deps',
    'npm run build',
    {
      command: `npm run pack`,
      args: [
        join(__dirname, '../../dist'),
      ]
    },
  ]);
})();
