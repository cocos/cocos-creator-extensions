/**
 * npm run build 各个插件
 */
const { runCommandForExtensions } = require("./common");

(async () => {
  await runCommandForExtensions([
    'npm run build'
  ]);
})();
