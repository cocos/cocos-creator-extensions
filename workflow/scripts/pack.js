/**
 * 打包成各个插件 zip 包到根目录下的 dist 目录下
 */
const { join } = require('path');
const { runCommandForExtensions } = require("./common");

(async () => {
  await runCommandForExtensions([
    {
      command: `npm run pack`,
      args: [
        join(__dirname, '../../dist'),
      ]
    },
  ]);
})();
