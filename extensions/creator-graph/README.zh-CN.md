# Creator Graph

## 介绍

该插件支持可视化编辑器着色器

<img src="readme/效果图.png" width="800px">


### 基本结构

<img src="readme/整体结构.png" width="800px">

---

## 准备阶段

1. 下载 Cocos Creator 3.8.2 编辑器 与 create-graph.zip 插件。
2. 打开 Cocos Creator 3.8.2 编辑器，在主菜单中选择 **扩展/扩展管理器** 打开扩展面板。
3. 点击 <img src="readme/导入扩展文件.png" width="200px">，选择 **creator-graph.zip** 扩展文件，进行导入。、
4. 需重启编辑器（**目前 3.8.2 需重启编辑器（为了确保 **.shadergraph** 资源注册生效），后续 >= 3.8.3 版本会完善该流程，可无需重启**）

---

## 创建资源

1. 到 **Assets** 面板右键选择 **创建/Shader Graph** 菜单进行创建 **.shadergraph** 资源
   - Surface (表面着色器)
   - Unlit (无光照着色器)
2. 双击资源，进入到编辑面板
3. <img src="readme/创建后的资源.png" width="200px">

---

## 面板内容介绍

初始面板：

<img src="readme/初始面板.png" width="800px">

#### 属性窗口

<img src="readme/创建属性窗口.png" width="300px">

1. 关闭窗口
2. 创建属性入口

属性窗口可创建 8 种基础类型的属性节点分别是：

- Float
- Boolean
- Vector2
- Vector3
- Vector4
- Color
- Texture2D
- TextureCube

#### 预览窗口

<img src="readme/预览窗口.png" width="250px">

1. 关闭窗口
2. 切换灯光（如果是 Unlit 无效果）
3. 强制刷新
   - 当遇到无法渲染或无法旋转模式可尝试刷新
4. 按住鼠标左键滑动，可旋转模型
5. 可切换内置或者自定义模型

#### 创建节点菜单

<img src="readme/创建节点菜单.png" width="400px">

1. 关闭窗口
2. 输入需要创建的节点名
3. 回车可以直接创建节点（创建节点的初始位置是鼠标所指向的位置）

---

使用普通节点：

<img src="readme/使用普通节点.png" width="800px">

使用属性节点：

<img src="readme/使用属性节点.png" width="800px">

---

#### 节点库

详细内容可查看 [传送门](shader-node/README.md)

---

### 快捷键

1. space                     - 打开创建节点菜单
2. cmd+s/ctrl+s              - 保存
3. backspace/delete          - 删除
4. cmd+c/ctrl+c              - 拷贝
5. cmd+x/ctrl+x              - 剪切
6. cmd+v/ctrl+v              - 粘贴
7. cmd+d/ctrl+d              - 复制
8. cmd+z/ctrl+z              - 撤销
9. cmd+shift+z/ctrl+shift+z  - 重做

----

### 命令行编译与发布

```
npm install - 初始化
npm run build - 编译
npm pack - 打包成 zip 包
```

### 已知问题

- 预览面板不支持动态预览
