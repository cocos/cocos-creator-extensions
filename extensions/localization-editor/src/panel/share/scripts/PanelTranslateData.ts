import IWrapperTranslateItemMap from '../../../lib/core/entity/translate/IWrapperTranslateItemMap';
import { getLanguageDisplayName } from './libs/languageMap';
import { container } from 'tsyringe';
import WrapperMainIPC from '../../../lib/core/ipc/WrapperMainIPC';

/** 面板中的翻译数据 */
export class PanelTranslateData {
    get locale() {
        return this.bcp47Tag;
    }
    constructor(
        public bcp47Tag: string,
        public displayName: string,
        /** 语言的字体的名称 */
        public fontName: string,
        /** 原始语言的字体的名称 */
        public localFontName: string,
        /** 翻译数据 key 为原文的 key 值为当前语言的值 */
        public items: IWrapperTranslateItemMap,
    ) { }
    /**
     * 获取单个翻译数据
     * @param language 如果没有指定语言则返回当前的本地的语言的数据
     */
    static async getPanelTranslateData(language?: string): Promise<PanelTranslateData | null> {
        const wrapper = container.resolve(WrapperMainIPC);
        const items = await wrapper.getTranslateData(language);
        const targetConfig = await wrapper.getLanguageConfig(language);
        const localLanguage = await wrapper.getLocalLanguage();

        if (!targetConfig || !localLanguage) {
            return null;
        }

        const wrapperTranslateItemMap: IWrapperTranslateItemMap = {};
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            wrapperTranslateItemMap[item.key] = item;
        }
        return new PanelTranslateData(
            targetConfig.bcp47Tag,
            getLanguageDisplayName(targetConfig.bcp47Tag),
            '',
            '',
            wrapperTranslateItemMap,
        );
    }
}
