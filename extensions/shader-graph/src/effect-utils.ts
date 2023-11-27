import { gte } from 'semver';

export async function buildEffect(name: string, content: string) {
    if (gte(Editor.App.version, '3.8.3')) {
        return await Editor.Message.request('asset-db', 'execute-custom-operation', 'effect', 'build-effect', name, content);
    } else {
        return await Editor.Message.request('engine-extends', 'build-effect', name, content);
    }
}

export async function addChunk(name: string, content: string) {
    if (gte(Editor.App.version, '3.8.3')) {
        await Editor.Message.request('asset-db', 'execute-custom-operation', 'effect', 'add-chunk', name, content);
    } else {
        return await Editor.Message.request('engine-extends', 'add-chunk', name, content);
    }
}
