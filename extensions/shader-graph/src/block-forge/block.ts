'use strict';

import type { GraphNodeElement } from '@itharbors/ui-graph/dist/element/graph-node';
import type { GraphElement } from '@itharbors/ui-graph/dist/element/graph';
import { registerNode, queryNode } from '@itharbors/ui-graph';
import type { IPinDescription, IBlockDescription } from './interface';
import { completeBlockTarget } from './utils';

import { generateOutputPinHTML, generateInputPinHTML, generateStyle as generatePinStyle } from './pin';
// import { unregisterNode } from '@itharbors/ui-graph/dist/manager';

export const blockMap: Map<string, IBlockDescription> = new Map();

/**
 * Block 元素更新的一些工具方法
 * 一般是传入元素 + 数据，更新元素内的一些 HTML 对象
 */
const BlockElementUtils = {
    /**
     * 更新 Block 元素的 title
     * @param elem
     * @param blockDesc
     * @param details
     */
    updateTitle(elem: GraphNodeElement, blockDesc: IBlockDescription, details: { [key: string]: any }) {
        const title = blockDesc.title || details.title || 'Unknown';
        elem.shadowRoot.querySelector(`.title ui-label`)!.innerHTML = title;
    },

    /**
     * 更新 Block 元素的 icon
     * @param elem
     * @param blockDesc
     * @returns
     */
    updateIcon(elem: GraphNodeElement, blockDesc: IBlockDescription) {
        const feature = blockDesc.feature || {};
        const icon = feature.icon;
        if (!icon) {
            return;
        }
        const $icon = elem.shadowRoot.querySelector(`.title ui-icon`)!;
        $icon.removeAttribute('hidden');
        $icon.setAttribute('value', icon);
    },

    /**
     * 更新 Block 元素是否可进入的图标显示状态
     * @param elem
     * @param blockDesc
     */
    updateCollapsed(elem: GraphNodeElement, blockDesc: IBlockDescription) {
        const feature = blockDesc.feature || {};
        const isCollapsed = feature.isCollapsedBlock;
        const $svg = elem.shadowRoot.querySelector(`.title svg`)!;
        if (isCollapsed) {
            $svg.removeAttribute('hidden');
        } else {
            $svg.setAttribute('hidden', '');
        }
    },

    /**
     * 更新元素展开折叠的状态
     * @param elem
     * @param blockDesc
     * @param details
     */
    updateExpand(elem: GraphNodeElement, blockDesc: IBlockDescription, details: { [key: string]: any }) {
        if (blockDesc.inputPins.length > 0 || blockDesc.outputPins.length > 0) {
            elem.setAttribute('expand', '');
        } else {
            elem.removeAttribute('expand');
        }
    },
};

/**
 * 创建一个专用的节点渲染对象
 *
 * @returns
 * @param blockDesc
 */
export function generateBlockOption(blockDesc: IBlockDescription) {
    blockDesc.style = blockDesc.style || {};
    blockDesc.feature = blockDesc.feature || {};

    const showQuickConnectPoint = !!blockDesc.feature.showQuickConnectPoint;

    return {
        template: /*html*/`
<section class="wrapper">
    <header class="title">
        <div>
            <ui-icon hidden></ui-icon>
            <ui-label></ui-label>
            <svg hidden viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M1 13L8 3L15 13H1Z"></path></svg>
        </div>
        ${showQuickConnectPoint ? '<div hidden class="quick-connect" name="t"></div' : ''}
    </header>
    <section class="content"></section>
</section>
        `,

        style: `${STYLE.host(blockDesc)}${STYLE.header(blockDesc)}${STYLE.pin(blockDesc)}`,

        /**
         * 初始化的时候设置一些事件和 HTML
         * @param this
         * @param details
         */
        onInit(this: GraphNodeElement, details: { [key: string]: any }) {
            // 设置 title 可拖拽
            const $title = this.shadowRoot.querySelector('header.title')! as HTMLElement;
            $title.addEventListener('mousedown', (event) => {
                event.stopPropagation();
                event.preventDefault();
                if (!this.hasAttribute('selected')) {
                    if (!(event as MouseEvent).metaKey && !(event as MouseEvent).ctrlKey) {
                        this.clearOtherSelected();
                    }
                    this.select({
                        clearLines: false,
                        clearNodes: false,
                    });
                }
                this.startMove();
            });

            // 绑定快速连接点的事件
            const $param = this.shadowRoot.querySelector(`.quick-connect`)!;
            $param && $param.addEventListener('mousedown', () => {
                this.startConnect('straight');
            });

            // 绑定元素点击开始连接的事件
            if (blockDesc.inputPins.length === 0 && blockDesc.outputPins.length === 0) {
                this.addEventListener('mousedown', (event) => {
                    if (event.button === 0 && this.hasConnect()) {
                        event.stopPropagation();
                        event.preventDefault();
                        this.startConnect('straight');
                    }
                }, true);
            }

            this.addEventListener('dblclick', (event) => {
                // event.stopPropagation();
                // event.preventDefault();

                const customEvent = new CustomEvent('block-dblclick', {
                    bubbles: true,
                    cancelable: true,
                    detail: {
                        pageX: event.pageX,
                        pageY: event.pageY,
                        offsetX: event.offsetX,
                        offsetY: event.offsetY,
                    },
                });
                this.dispatchEvent(customEvent);
            });
            this.addEventListener('click', (event) => {
                const custom = new CustomEvent('block-click', {
                    bubbles: true,
                    cancelable: true,
                    detail: {},
                });
                this.dispatchEvent(custom);
            });
            this.addEventListener('mouseup', (event) => {
                if (event.button !== 2) {
                    return;
                }
                const custom = new CustomEvent('block-right-click', {
                    bubbles: true,
                    cancelable: true,
                    detail: {
                    },
                });
                this.dispatchEvent(custom);
            });

            this.data.addPropertyListener('selected', (selected, legacySelected) => {
                if (selected === legacySelected) {
                    return;
                }
                if (selected) {
                    const custom = new CustomEvent('block-selected', {
                        bubbles: true,
                        cancelable: true,
                        detail: {},
                    });
                    this.dispatchEvent(custom);
                } else {
                    const custom = new CustomEvent('block-unselected', {
                        bubbles: true,
                        cancelable: true,
                        detail: {},
                    });
                    this.dispatchEvent(custom);
                }
            });
        },

        onUpdate(this: GraphNodeElement, details: { [key: string]: any }) {
            // 更新 title
            BlockElementUtils.updateTitle(this, blockDesc, details);

            // 更新 icon
            BlockElementUtils.updateIcon(this, blockDesc);

            // 更新折叠图标
            BlockElementUtils.updateCollapsed(this, blockDesc);

            // 更新折叠状态
            BlockElementUtils.updateExpand(this, blockDesc, details);

            // 数据更新后，更新对应的资源
            // this.data.addPropertyListener('details', (details) => {
            //     updateHTML(details.label);
            // });

            // 生成针脚
            const $content = this.shadowRoot.querySelector('.content')!;
            $content.innerHTML = '';
            if (blockDesc.createDynamicOutputPins) {
                const outputList = blockDesc.createDynamicOutputPins(blockDesc, details);
                outputList.forEach((pin, index) => {
                    return $content?.appendChild(generateOutputPinHTML(pin, details.outputPins[index]));
                });
            } else {
                blockDesc.outputPins.forEach((pin, index) => {
                    return $content?.appendChild(generateOutputPinHTML(pin, details.outputPins[index]));
                });
            }
            const $graph = (this.getRootNode() as any).host as GraphElement;
            const uuid = this.getAttribute('node-uuid')!;
            if (blockDesc.createDynamicInputPins) {
                const inputList = blockDesc.createDynamicInputPins(blockDesc, details);
                inputList.forEach((pin, index) => {
                    return $content?.appendChild(generateInputPinHTML(pin, details.inputPins, index, uuid, $graph.getProperty('lines')));
                });
            } else {
                blockDesc.inputPins.forEach((pin, index) => {
                    return $content?.appendChild(generateInputPinHTML(pin, details.inputPins, index, uuid, $graph.getProperty('lines')));
                });
            }

            // 绑定参数连接点的事件
            const $paramList = this.shadowRoot.querySelectorAll(`v-graph-node-param`);
            Array.prototype.forEach.call($paramList, ($param) => {
                $param.addEventListener('mousedown', (event: MouseEvent) => {
                    event.stopPropagation();
                    event.preventDefault();

                    const name = $param.getAttribute('name');
                    if (!name) {
                        return;
                    }
                    const paramDirection = $param.getAttribute('direction');
                    if (paramDirection !== 'input' && paramDirection !== 'output') {
                        return;
                    }
                    this.startConnect('curve', name, paramDirection);
                });
            });
        },
    };
}

const STYLE = {
    host(block: IBlockDescription) {
        const config = block.style || {};
        return /*css*/`
:host *[hidden] {
    display: none;
}
:host {
    --font-color: ${config.fontColor || '#ccc'};
    --font-color-hover: ${config.fontHoverColor || config.fontColor || '#ccc'};
    --border-color: ${config.borderColor || 'white'};
    --border-color-hover: ${config.borderHoverColor || config.borderColor || 'white'};
    --shadow-color: ${config.shadowColor || '#ccc'};
    --shadow-color-hover: ${config.shadowHoverColor || config.shadowColor || '#ccc'};
    --background-color: ${config.backgroundColor || '#2b2b2bcc'};
    --border-radius: 2px;

    --header-height: 24px;
    --header-background: ${config.headerColor || '#2b2b2bcc'};

    --pin-height: 24px;

    width: 200px;

    color: var(--font-color);
    cursor: default;

}
:host > section.wrapper {
    margin: 10px;
}
:host(:hover) > section.wrapper, :host([selected]) > section.wrapper {
    border-color: var(--border-color-hover);
    color: var(--font-color-hover);
    box-shadow: 0px 0px 7px 2px var(--shadow-color-hover);
}
section.wrapper {
    position: relative;
    border-radius: var(--border-radius); 
    background: var(--background-color);
    box-shadow: 0px 0px 7px 2px none;
}
:host(:hover) > section.wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    border-radius: var(--border-radius); 
    box-shadow: 0px 0px 0px 1px var(--shadow-color-hover) inset;
    pointer-events: none;
}
`;
    },
    header(block: IBlockDescription) {
        const config = block.style || {};
        return /*css*/`
header.title {
    line-height: var(--header-height);

    text-align: center;
    border-radius: var(--border-radius);

    ${config.secondaryColor ? `background: ${config.secondaryColor}; padding-left: 6px;` : ''}
}
header.title > div {
    padding: 0 10px;
    height: 24px;
    border-radius: var(--border-radius);
    display: flex;
    background: var(--header-background);
}
:host([expand]) header.title > div {
    border-radius: var(--border-radius) var(--border-radius) 0 0;
}
header.title > div > ui-label {
    display: block;
    padding: 0 10px;
}
header.title > div > ui-icon {
    display: block;
}
header.title > div > svg {
    fill: white;
    display: block;
    width: 10px;
    transform: rotate(90deg);
}
header.title > .quick-connect {
    display: block;
    padding: 0;
    width: 12px;
    height: 12px;
    border-radius: 6px;
    background: white;
    position: absolute;
    right: -6px;
    top: 50%;
    margin-top: -6px;
    opacity: 0;
    transition: opacity 0.3s;
}
:host(:hover) header.title > .quick-connect {
    display: block;
    opacity: 1;
}
        `;
    },
    pin: generatePinStyle,
};

export function hasDeclareBlock(type: string) {
    return blockMap.has(type);
}

export function getDeclareBlock(type: string) {
    return blockMap.get(type);
}

export function removeDeclareBlock(type: string) {
    const graph = '*';
    const unknownOption = queryNode(graph, 'unknown');
    registerNode(graph, type, unknownOption);
    blockMap.delete(type);
}

// @ts-ignore
window.removeDeclareBlock = removeDeclareBlock;

/**
 * 注册一个 block 类型
 * @param block
 * @returns
 */
export function declareBlock(block: IBlockDescription) {
    const graph = '*';
    // if (blockMap.has(block.type)) {
    //     console.warn(`Cannot declare duplicate block types: ${block.type}`);
    //     return;
    // }

    // 合并 extend 数据
    if (block.extend) {
        const extend = blockMap.get(block.extend);
        if (!extend) {
            console.warn(`Inheritance data not found: ${block.extend}`);
        } else {
            completeBlockTarget(block, extend);
        }
    }

    const options = generateBlockOption(block);
    registerNode(graph, block.type, options);
    blockMap.set(block.type, block);
}

export function unDeclareBlock(type: string) {
    const graph = '*';
    // TODO 需要删除底层 block 节点
    // unregisterNode(graph, type);
    blockMap.delete(type);
}

export function replaceDeclareBlock(searchType: string, block: IBlockDescription) {
    if (blockMap.has(searchType)) {
        unDeclareBlock(searchType);
    }
    declareBlock(block);
}
