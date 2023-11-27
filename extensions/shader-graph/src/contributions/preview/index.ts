import { shaderGraphPreview } from './shader-graph-preview';
declare const cce: any;

export class PreviewManager {
    loaded = false;
    async load() {
        if (!this.loaded) {
            // 要确保编辑器预览插件比这个先注册
            const ccePreview = cce.Preview;
            await ccePreview.initPreview('shader-graph-preview', 'query-shader-graph-preview-data', shaderGraphPreview);
            this.loaded = true;
        }
    }
    unload() {}
}
const previewManager = new PreviewManager();
export default previewManager;
