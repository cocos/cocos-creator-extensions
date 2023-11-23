import { basename, extname, relative } from 'path';

import { PROJECT_PATH } from './global-exports';
import type { GraphEditorOtherOptions } from './base';

export function generateUUID() {
    return 'p_' + Date.now() + (Math.random() + '').substring(10);
}

/**
 * 是否坐标包含在里面
 * @param point
 * @param bounds
 */
export function contains(point: { x: number, y: number }, bounds: { x: number, y: number, width: number, height: number }): boolean {
    return point.x >= bounds.x && point.x <= bounds.x + bounds.width && point.y >= bounds.y && point.y <= bounds.y + bounds.height;
}

export function generatePinID(tag: string, blockType: string, slotType: string, slotDisplayName: string) {
    return `${tag}_${blockType}_${slotType}_${slotDisplayName}`;
}

/**
 * 转成在项目 assets 目录下
 * @param path
 */
export function convertToProjectDbUrl(path?: string | undefined): string {
    if (!path) return '';

    return `db://assets/${relative(PROJECT_PATH, path)}`;
}

export async function getAssetUuidByPath(path?: string | undefined): Promise<string> {
    if (!path) return '';

    const url = convertToProjectDbUrl(path);
    const uuid = await Editor.Message.request('asset-db', 'query-uuid', url);
    if (!uuid) {
        console.error(`loadByUrl failed, can't get uuid by ${url}`);
        return '';
    }
    return uuid;
}

export function getOffsetPointByMousePoint(list: GraphEditorOtherOptions[], mousePoint: { x: number, y: number }) {
    let sumX = 0;
    let sumY = 0;
    list.forEach((item: GraphEditorOtherOptions) => {
        if (item.blockData) {
            sumX += item.blockData.position.x;
            sumY += item.blockData.position.y;
        }
    });

    return {
        x: mousePoint.x - sumX / list.length,
        y: mousePoint.y - sumY / list.length,
    };
}

export function mergeGraphEditorOtherOptions(arr1: GraphEditorOtherOptions[], arr2: GraphEditorOtherOptions[]): GraphEditorOtherOptions[] {
    const mergedSet = new Set<string>();
    const array: GraphEditorOtherOptions[] = [];

    for (const obj of arr1) {
        mergedSet.add(obj.uuid);
        array.push(obj);
    }

    for (const obj of arr2) {
        if (!mergedSet.has(obj.uuid)) {
            mergedSet.add(obj.uuid);
            array.push(obj);
        }
    }

    return array;
}

export function getName(path: string): string {
    return basename(path, extname(path));
}
