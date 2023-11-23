/**
 * 依次对插件目录下的所有插件执行 npm 命令
 */
const chalk = require("chalk");

/**
 * 跳过的文件夹
 * @type {string[]}
 */
let SKIPS = ['.DS_Store'];

/**
 * 运行命令行，如果传入的是 --extension='插件名' 或者 --ext='插件名'
 * process.env.npm_config_extension || process.env.npm_config_ext
 * @param commands - string[] | { command: string, arg: string[] }
 * @param skipExtensions - string[] // 跳过插件列表
 * @returns {Promise<void>}
 */
exports.runCommandForExtensions = async function(commands, skipExtensions) {
  const chalk = require('chalk');
  const util = require('util');
  const exec = util.promisify(require('child_process').exec);
  const { readdirSync, existsSync } = require('fs');
  const { join } = require('path');

  const rootDir = join(__dirname, '../../');
  const extensionRootDir = join(rootDir, 'extensions');
  let extensions = (process.env.npm_config_extension || process.env.npm_config_ext) || readdirSync(extensionRootDir);
  if (typeof extensions === 'string') {
    extensions = [extensions];
  }

  console.log(chalk.yellow(`============================================================`));

  let baseCommand = '', command = '';
  for (let i = 0; i < extensions.length; i++) {
    const name = extensions[i];

    if (SKIPS.includes(name)) continue;

    if (skipExtensions && skipExtensions.includes(name)) {
      console.log(chalk.yellow(`> ${name} [skip]`));
      console.log(chalk.yellow(`============================================================`));
      break;
    }

    console.log(chalk.yellow(`> ${name}`));

    const extensionDir = join(extensionRootDir, name);
    const packageJSONPath = join(extensionDir, 'package.json');

    if (existsSync(packageJSONPath)) {

      for (let item of commands) {
        try {
          baseCommand = item.command || item;

          if (typeof item === 'object' && 'command' in item && 'args' in item && Array.isArray(item.args)) {
            command = [item.command].concat(item.args).join(' ');
          } else {
            command = item;
          }

          if (command.startsWith('npm')) {
            command = `${process.platform === 'win32' ? 'npm.cmd' : 'npm'}` + command.slice('npm'.length);
          }

          process.stdout.write(`    [?] ${baseCommand}`);
          await exec(command, {
            stdio: [0, 1, 2],
            cwd: extensionDir
          });

          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          console.log(chalk.greenBright(`    [√] ${baseCommand}`));
        } catch (err) {
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          console.log(chalk.redBright(`    [x] ${baseCommand}`));
          if (process.env.npm_config_log) {
            console.error(err);
          }
          break;
        }
      }
    } else {
      console.log(chalk.redBright(`     can't find package.json, skip.`));
    }
    console.log(chalk.yellow(`============================================================`));
  }
}

