// @ts-ignore
// import { EDITOR } from 'cc/env';

import { addChunk } from '../effect-utils';

const useNpm = true;//(EDITOR || (globalThis as any).electron);
export const fs = useNpm && globalThis.require('fs-extra');
export const path = useNpm && globalThis.require('path');

const { basename, dirname, extname, join, relative } = path || {};
const { readFileSync, readdirSync, statSync } = fs || {};

let _addedChunks = false;
export async function addChunks() {
    if (_addedChunks) {
        return;
    }

    _addedChunks = true;

    const enginePath = (await Editor.Message.request('engine', 'query-engine-info')).typescript.path;

    // 添加所有 builtin 头文件
    const builtinChunkDir = join(enginePath, './editor/assets/chunks');
    const builtinChunks = (() => {
        const arr: string[] = [];
        function step(dir: string) {
            const names: string[] = readdirSync(dir);
            names.forEach((name) => {
                const file = join(dir, name);
                if (/\.chunk$/.test(name)) {
                    arr.push(file);
                } else if (statSync(file).isDirectory()) {
                    step(file);
                }
            });
        }
        step(builtinChunkDir);
        return arr;
    })();

    for (let i = 0; i < builtinChunks.length; ++i) {
        const name = basename(builtinChunks[i], '.chunk');
        const content = readFileSync(builtinChunks[i], { encoding: 'utf8' });
        await addChunk(name, content);
        const relativeName = relative(builtinChunkDir, builtinChunks[i]).replace('.chunk', '').replace(/\\/g, '/');
        await addChunk(relativeName, content);
    }

}
