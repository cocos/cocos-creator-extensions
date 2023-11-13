import { PreviewBuffer } from './buffer';

class PreviewBase {
    protected previewBuffer!: PreviewBuffer;
    public async queryPreviewData(info: any) {
        return (await this.previewBuffer.getImageData( info.width, info.height));
    }

    public queryPreviewDataQueue(info: any, event: any) {
        this.previewBuffer.getImageDataInQueue( info.width, info.height, event);
    }
    clearPreviewBuffer() {
        this.previewBuffer.clear();
    }

    public init(registerName: string, queryName: string) { }
}

export { PreviewBase };
