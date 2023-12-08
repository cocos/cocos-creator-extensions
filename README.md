# Cocos Creator Public Extensions

[中文](./README.zh-CN.MD)

For storing publicly available extension plugin libraries

Extension Plugin List：

- [shader-graph](extensions/shader-graph/README.zh-CN.md)（Depends on the Cocos Creator editor version >= 3.8.2）
- [localization-editor](./extensions/localization-editor/README.zh-CN.md)（Depends on the Cocos Creator editor version >= 3.7.0）

## Download

Clone the code to your local computer

```bash
git clone https://github.com/cocos/cocos-creator-extensions.git
```

### Initialisation

```bash
// Run the install command for initializing cocos-creator-extensions and all plugins in the extensions directory
npm install
```

### Compilation

```bash
// Run the build command for all plugins in the extensions directory
npm run build
```

### Packaging

```bash
// Run the packaging command for all plugins in the extensions directory
npm run pack
```

### Unit Testing

```bash 
// Run the unit testing command for all plugins in the extensions directory
npm run test 
```

### Executing a Command for a Single Plugin

Specify **--extension="PluginName"** or **--ext="PluginName"** after each specific command to individually execute a command for a certain plugin.

## Applying Modified Plugins to the Project

1. After modifying a plugin, use npm run pack to package it into a zip file.
2. In the Cocos Creator editor, open the panel by clicking on Extensions/Extension Manager in the main menu. Click to import the zip plugin.

## License

This project is released under the MIT License, which typically allows you to freely modify and distribute the project, and use derivative works for commercial purposes. However, please note that whenever you distribute this project or any form of derivative works that include this project, you must also include and fully display [this license](/LICENSE.txt).
