import ILocalizationEditorOptions from './ILocalizationEditorOptions';

/**
 * 任务的选项
 */
export type ITaskOptions = {
    packages: {
        'localization-editor'?: ILocalizationEditorOptions,
    }
};
