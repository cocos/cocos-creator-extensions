/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { injectAllWithTransform, singleton } from 'tsyringe';
import { TranslateFileType } from '../../type/type';
import Writer, { WriterTransform } from '../../writer/Writer';
import TranslateData from '../../entity/translate/TranslateData';
import Reader from '../../reader/Reader';
import { CustomError } from '../../error/Errors';
import { MessageCode } from '../../entity/messages/MainMessage';

@singleton()
export default class TranslateFileService {
    constructor(
        @injectAllWithTransform('Writer', WriterTransform)
        public writerMap: Map<TranslateFileType, Writer>,
        @injectAllWithTransform('Reader', WriterTransform)
        public readerMap: Map<TranslateFileType, Reader>,
    ) {}

    async exportTranslateFile(
        filePath: string,
        translateFileType: TranslateFileType,
        data: TranslateData,
        local: TranslateData,
    ): Promise<void> {
        const writer = this.writerMap.get(translateFileType);
        writer?.write(filePath, data, local);
    }

    async importTranslateFile(
        filePath: string,
        translateFileType: TranslateFileType,
        locale: Intl.BCP47LanguageTag,
    ): Promise<TranslateData> {
        const reader = this.readerMap.get(translateFileType)!;
        const translateData = await reader.read(filePath);
        for (const [key, item] of translateData.items) {
            if (item.value.length === 0) {
                translateData.items.delete(key);
            }
        }
        return translateData;
    }
}
