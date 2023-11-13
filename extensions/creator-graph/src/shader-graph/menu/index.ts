import EventEmitter from 'events';
import { getCurrentWindow, screen } from '@electron/remote';

import type { BlockMouseEvent, GraphMouseEvent, LineMouseEvent } from '../../block-forge/event';

import { contains } from '../utils';
import { getBaseMenuItem } from './template/base-menu';
import { MessageMgr, MessageType, GraphEditorAddOptions } from '../base';

export interface MenuTemplateItem extends Editor.Menu.MenuTemplateItem {
    addOptions?: GraphEditorAddOptions;
}

export class Menu extends EventEmitter {

    static _instance: Menu | null = null;

    public static get Instance(): Menu {
        if (!this._instance) {
            this._instance = new Menu();
        }
        return this._instance;
    }

    private setTimeoutId: NodeJS.Timeout | null = null;

    private nodeMenuItems: string[] = [];
    private nodeMenuItemDataMap: Map<string, GraphEditorAddOptions> = new Map();

    emitMenuItemChange() {
        this.setTimeoutId && clearTimeout(this.setTimeoutId);
        this.setTimeoutId = setTimeout(() => {
            MessageMgr.Instance.send(MessageType.CreateMenuChange);
        }, 50);
    }

    addItemPath(path: string, data: GraphEditorAddOptions) {
        if (!this.nodeMenuItems.includes(path)) {
            this.nodeMenuItems.push(path);
        }
        this.nodeMenuItemDataMap.set(path, data);
        this.emitMenuItemChange();
    }

    removeItemPath(path: string) {
        const index = this.nodeMenuItems.indexOf(path);
        if (index !== -1) {
            this.nodeMenuItems.splice(index, 1);
            this.nodeMenuItemDataMap.delete(path);
            this.emitMenuItemChange();
        }
    }

    getShaderNodeMenu(onClick?: (options: GraphEditorAddOptions) => void) {
        const menuItems: MenuTemplateItem[] = [];

        const menu = (menuPath: string) => {
            // 解析菜单路径字符串为菜单项数组
            function parseMenuPath(menuPath: string): MenuTemplateItem[] {
                return menuPath.split('/').map((label) => ({ label }));
            }
            // 循环迭代方式构建菜单项
            const buildMenuIteratively = (paths: string[], currentMenuItems: MenuTemplateItem[], baseMenuPath: string, fullMenuPath: string): void => {
                const label = paths.shift();
                if (!label) return;
                if (!fullMenuPath) {
                    fullMenuPath = label;
                } else {
                    fullMenuPath += '/' + label;
                }
                let menuItem: MenuTemplateItem | undefined = currentMenuItems.find(item => item.label === label);
                if (!menuItem) {
                    menuItem = { label, submenu: [] };
                    currentMenuItems.push(menuItem);
                }
                if (paths.length === 0) {
                    const addOptions = this.nodeMenuItemDataMap.get(baseMenuPath)!;
                    menuItem.addOptions = addOptions;
                    if (onClick) {
                        delete menuItem.submenu;
                        menuItem.click = () => {
                            onClick(addOptions);
                        };
                    }
                }
                buildMenuIteratively(paths, menuItem.submenu!, baseMenuPath, fullMenuPath);
            };
            // 传入菜单路径字符串，构建相应的菜单项
            const menuPathItems = parseMenuPath(menuPath);
            // 使用循环迭代方式构建菜单项
            buildMenuIteratively(menuPath.split('/'), menuItems, menuPath, '');
        };
        this.nodeMenuItems.forEach((menuPath) => menu(menuPath));
        return menuItems;
    }

    popupMenu(event: BlockMouseEvent | GraphMouseEvent | LineMouseEvent): boolean {
        const menu = getBaseMenuItem(event, this.popupCreateMenu);
        Editor.Menu.popup({ menu });
        return true;
    }

    popupCreateMenu = () => {
        // 如果在面板内才弹菜单
        const window = getCurrentWindow();
        const point = screen.getCursorScreenPoint();
        if (!contains(point, window.getBounds())) return;

        MessageMgr.Instance.send(MessageType.ShowCreateNodeWindow);
    };
}
