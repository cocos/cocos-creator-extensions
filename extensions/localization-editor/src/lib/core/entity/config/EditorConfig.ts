import IEditorConfig from './IEditorConfig';

export default class EditorConfig implements IEditorConfig {
    public static ConfigName = 'EditorConfig';

    constructor(
        public currentPreview?: string,
    ) {}

    static parse(editorConfig: IEditorConfig): EditorConfig {
        return new EditorConfig(
            editorConfig.currentPreview,
        );
    }
}
