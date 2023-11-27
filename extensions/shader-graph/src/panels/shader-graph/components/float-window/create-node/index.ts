import { merge } from 'lodash';

import { defineComponent, ref, nextTick, onMounted, onUnmounted } from 'vue/dist/vue.js';

import { FloatWindowConfig, FloatWindowDragTarget } from '../internal';
import { HTMLGraphForgeElement } from '../../../../../block-forge';
import BaseFloatWindow from '../base';
import { commonEmits, commonLogic, commonTemplate } from '../common';

import { GraphConfigMgr, GraphEditorMgr, Menu, GraphEditorAddOptions, MessageMgr } from '../../../../../shader-graph';
import { convertMenuData, filterMenuByKeyword, getBoundingClientRect, getTitleBarHeight } from '../utils';

import { contains, MessageType } from '../../../../../shader-graph';

export const DefaultConfig: FloatWindowConfig = {
    key: 'create-node',
    tab: {
        name: 'i18n:shader-graph.create_node.menu_name',
        show: false,
    },
    dontSave: true,
    base: {
        title: 'i18n:shader-graph.create_node.title',
        width: '380px',
        height: '250px',
        minWidth: '200px',
        minHeight: '200px',
        defaultShow: false,
    },
    position: {
        top: '200px',
        left: '200px',
    },
    events: {
        limitless: true,
        resizer: true,
        drag: true,
        target: FloatWindowDragTarget.header,
    },
};

export function getConfig() {
    const newConfig = JSON.parse(JSON.stringify(DefaultConfig));
    const config = GraphConfigMgr.Instance.getFloatingWindowConfigByName(DefaultConfig.key);
    if (config) {
        newConfig.details = merge({}, newConfig.details, config);
    }
    return newConfig;
}

export const component = defineComponent({
    components: {
        BaseFloatWindow,
    },

    props: {
        forge: {
            type: HTMLGraphForgeElement,
            required: true,
            default: null,
        },
        config: {
            type: Object as () => FloatWindowConfig,
            required: true,
            default: null,
        },
    },

    emits: [...commonEmits],

    setup(props, ctx) {
        const commonObject = commonLogic(props, ctx);
        const searchValue = ref('');
        const searchInputRef = ref();
        const menuRef = ref();
        const foldValue = ref(true);

        const onCreateMenuChange = () => {
            updateMenuTreeTemplate();
        };

        const onShowCreateNodeWindow = () => {
            const floatWindowRef = commonObject.floatWindowRef.value;
            const floatWindowConfig = floatWindowRef?.$options.propsData.config;
            if (floatWindowRef && floatWindowConfig) {
                if (commonObject.isShow()) {
                    return;
                }
                const $shaderGraph = floatWindowRef.$parent.$parent.$el;
                const shaderGraphRect = getBoundingClientRect($shaderGraph);

                const inPanel = contains(GraphEditorMgr.Instance.mousePoint, {
                    x: shaderGraphRect.left,
                    y: shaderGraphRect.top,
                    width: shaderGraphRect.width,
                    height: shaderGraphRect.height,
                });
                // 如果鼠标不在面板中就不弹窗
                if (!inPanel) return;

                const floatWindowRect = commonObject.getRect();
                const width = floatWindowRect.width || floatWindowConfig.base.width;
                const height = floatWindowRect.height || floatWindowConfig.base.height;
                const offsetX = 300,
                    offsetY = 0;
                let x = GraphEditorMgr.Instance.mousePointInPanel.x - offsetX;
                const titleBarHeight = getTitleBarHeight(); // 系统 titleBar 的高度
                let y = GraphEditorMgr.Instance.mousePointInPanel.y - titleBarHeight - offsetY;

                if (x < 0) {
                    x = 0;
                } else if (x + floatWindowRect.width > shaderGraphRect.width - 28) {
                    x = shaderGraphRect.width - floatWindowRect.width - 28;
                }
                if (y < 0) {
                    y = 0;
                } else if (y + floatWindowRect.height > shaderGraphRect.bottom - 40) {
                    y = shaderGraphRect.bottom - floatWindowRect.height - 40;
                }

                foldValue.value = true;
                updateMenuTreeTemplate();
                commonObject.show({
                    left: x + 'px',
                    top: y + 'px',
                });
                window.addEventListener('keyup', onKeyup);

                nextTick(() => {
                    searchValue.value = '';
                    menuRef.value.clear();
                    menuRef.value.select(menuRef.value.list[2]);
                    menuRef.value.positioning(menuRef.value.list[2]);
                    searchInputRef.value.focus();
                });
            }
        };

        onMounted(() => {
            MessageMgr.Instance.register(MessageType.CreateMenuChange, onCreateMenuChange);
            MessageMgr.Instance.register(MessageType.ShowCreateNodeWindow, onShowCreateNodeWindow);
        });

        onUnmounted(() => {
            MessageMgr.Instance.unregister(MessageType.CreateMenuChange, onCreateMenuChange);
            MessageMgr.Instance.unregister(MessageType.ShowCreateNodeWindow, onShowCreateNodeWindow);
        });

        function createNode(addOptions: GraphEditorAddOptions) {
            if (!addOptions) return;
            const floatWindowRef = commonObject.floatWindowRef.value!;
            const $shaderGraph = floatWindowRef.$parent.$parent.$el;
            GraphEditorMgr.Instance.add(addOptions);
            onClose();
        }

        let initialized = false;
        function updateMenuTreeTemplate() {
            if (!initialized) {
                initialized = true;
                menuRef.value.setTemplate('text', `<span class="name"></span>`);
                menuRef.value.setTemplateInit('text', ($text: HTMLElement & { $name: HTMLElement | null; $link: HTMLElement }) => {
                    $text.$name = $text.querySelector('.name');
                });
                menuRef.value.setRender(
                    'text',
                    (
                        $text: HTMLElement & { $name: HTMLElement; $link: HTMLElement },
                        data: { detail: { value: string }; fold: boolean },
                    ) => {
                        $text.$name.innerHTML = data.detail.value;
                    },
                );

                menuRef.value.setTemplateInit('item', ($div: HTMLElement & { data: { detail: { addOptions: GraphEditorAddOptions } } }) => {
                    $div.addEventListener('click', (event: MouseEvent) => {
                        menuRef.value.clear();
                        menuRef.value.select($div.data);
                        menuRef.value.render();
                        createNode($div.data.detail.addOptions);
                    });
                });

                menuRef.value.css = `
                    .item {
                        text-align: center;
                        line-height: 24px;
                    }
                    .content .fixed .list > ui-drag-item[selected] {
                        background-color: #094A5D;
                    }
                `;
            }

            menuRef.value.tree = convertMenuData(Menu.Instance.getShaderNodeMenu(), false);
            menuRef.value.render();
        }

        function getSelectedCreateNodeItem(
            item: { index: number; children: [] },
            list: { index: number; children: [] }[],
            arrow: 'down' | 'up' = 'down',
        ) {
            let index = item.index;
            if (arrow === 'down') {
                index++;
                if (index > list.length - 1) index = 0;

                item = list[index];
                // while (item && item.children.length > 0) {
                //     index++;
                //     if (index > list.length - 1) index = 0;
                //
                //     item = list[index];
                // }
            } else if (arrow === 'up') {
                index--;
                if (index < 0) index = list.length - 1;

                item = list[index];
                // while (item && item.children.length > 0) {
                //     index--;
                //     if (index < 0) index = list.length - 1;
                //
                //     item = list[index];
                // }
            }
            return item;
        }

        function onKeyup(event: KeyboardEvent) {
            const which = event.which;
            // 'Escape' 退出
            if (which === 27) {
                onClose();
                return;
            }
            const $dom = menuRef.value;
            const item = $dom.selectItems[$dom.selectItems.length - 1];
            if (!item) return;

            let selectItem = undefined;
            switch (which) {
                case 13: // Enter
                    if (!item.detail.addOptions) return;
                    createNode(item.detail.addOptions);
                    return;
                case 40: // ArrowDown
                    selectItem = getSelectedCreateNodeItem(item, $dom.list, 'down');
                    break;
                case 38: // ArrowUp
                    selectItem = getSelectedCreateNodeItem(item, $dom.list, 'up');
                    break;
                case 37: // ArrowLeft
                    if (!item.fold && item.parent) {
                        $dom.collapse(item.parent);
                    }
                    if (item.parent.parent) {
                        $dom.clear();
                        $dom.select(item.parent);
                    }
                    break;
                case 39: // ArrowRight
                    if (item.fold && item.children.length > 0) {
                        $dom.expand(item);
                    }
                    if (item.children[0]) {
                        $dom.clear();
                        $dom.select(item.children[0]);
                    }
                    break;
            }
            if (selectItem !== undefined) {
                $dom.clear();
                $dom.select(selectItem);
                $dom.positioning(selectItem);
            }
            $dom.render();
        }

        function onSearchInputChange(value: string) {
            if (searchValue.value === value) return;
            searchValue.value = value;

            setTimeout(() => {
                let selectItem;
                let treeData = convertMenuData(Menu.Instance.getShaderNodeMenu(), false);
                if (value) {
                    const result = filterMenuByKeyword(treeData, value);
                    treeData = result.filterTree;
                    selectItem = result.firstSelect;
                }
                const $dom = menuRef.value;
                $dom.tree = treeData;
                if (treeData.length > 0) {
                    $dom.clear();
                    $dom.select(selectItem);
                    menuRef.value.positioning(selectItem);
                    $dom.render();
                }
            }, 50);
        }

        function onClose() {
            window.removeEventListener('keyup', onKeyup);
            searchValue.value = '';
            commonObject.hide();
        }

        onUnmounted(() => {
            onClose();
        });

        commonObject.onSizeChanged = () => {
            setTimeout(() => {
                if (menuRef.value) {
                    menuRef.value.render();
                }
            }, 100);
        };

        return {
            ...commonObject,
            searchValue,
            searchInputRef,
            menuRef,

            onClose,
            onSearchInputChange,
        };
    },

    template: commonTemplate({
        css: 'create-node',
        header: `
<ui-label class="title-label" value="i18n:shader-graph.create_node.title"></ui-label>
<ui-button class="close" transparent
  tooltip="i18n:shader-graph.create_node.close.tooltip"
  @click="onClose"
>
  <ui-icon value="close"></ui-icon>
</ui-button>
        `,
        section: `
<div class="search-group">
  <ui-icon class="icon" value="search"></ui-icon>
  <ui-input ref="searchInputRef" class="input"
    :value="searchValue"
    placeholder="i18n:shader-graph.create_node.search_input.placeholder"
    @change="onSearchInputChange($event.target.value)"
  ></ui-input>
</div>

<ui-tree ref="menuRef" class="menus"></ui-tree>
        `,
        footer: `
        `,
    }),
});
