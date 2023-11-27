# Cocos Creator 公开扩展插件库

[English](./README.MD)

用于存储公开扩展插件库

插件列表：

- [shader-graph](extensions/shader-graph/README.zh-CN.md)（依赖 Cocos Creator 编辑器版本 >= 3.8.2）
- [localization-editor](./extensions/localization-editor/README.zh-CN.md)（依赖 Cocos Creator 编辑器版本 >= 3.7.0）

## 安装

将代码克隆到本地计算机

```bash
git clone https://github.com/cocos/cocos-creator-extensions.git
```

### 初始化

```bash
// 初始化 cocos-creator-extensions 以及 extensions 目录下的所有插件 install 指令
npm install
```

### 编译

```bash
// 启动 extensions 目录下的所有插件 build 指令
npm run build
```

### 打包

```bash
// 启动 extensions 目录下所有插件的打包指令
npm run pack
```

### 单元测试

```bash 
// 启动 extensions 目录下的所有插件的单元测试指令
npm run test 
```

### 单独执行某个插件指令

```bash
在上面每个指定后面指定 --extension="插件名" 或者 --ext="插件名" 即可单独启动某个插件的指令
```

## 插件修改后，应用到项目中

1. 修改插件以后，使用 **npm run pack** 打包成 zip 包。 
2. 到 Creator Cocos 编辑器中主菜单点击 **扩展/扩展管理器** 打开面板，点击导入 zip 插件即可。
