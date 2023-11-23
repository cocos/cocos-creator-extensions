import { Material } from 'cc';

import previewManager from './preview';
import { shaderGraphPreview } from './preview/shader-graph-preview';
import { PreviewConfig } from './internal';

class PreviewScene {
    async init(config: PreviewConfig) {
        await previewManager.load();
        shaderGraphPreview.resetCamera();
        shaderGraphPreview.setPrimitive(config.primitive);
        shaderGraphPreview.setLightEnable(config.lightEnable);
        return true;
    }

    setMaterial(material: Material) {
        shaderGraphPreview.setMaterial(material);
    }
}

const previewScene = new PreviewScene();
export default previewScene;
