import CSVWriter from './CSVWriter';
import { singleton } from 'tsyringe';
import TranslateData from '../entity/translate/TranslateData';
import { TranslateFileType } from '../type/type';
import { utils, write } from 'xlsx';
import ICSVTranslateItem from '../entity/csv/ICSVTranslateItem';
import { writeFile } from 'fs-extra';

@singleton()
export default class XLSXWriter extends CSVWriter {
    type: TranslateFileType = TranslateFileType.XLSX;

    async write(filePath: string, data: TranslateData, local: TranslateData): Promise<void> {
        const csvTranslateItems = this.generateCsvTranslateItems(local, data);
        const header: (keyof ICSVTranslateItem)[] = ['key', 'sourceValue', 'targetValue'];
        const worksheet = utils.json_to_sheet(csvTranslateItems, {
            header: header,
        });
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, data.locale);
        const maxWidths = header.map(head => {
            return csvTranslateItems.reduce((max, item) => Math.max(max, item[head].length), head.length);
        });
        worksheet['!cols'] = maxWidths.map(maxWidth => {
            return { wch: maxWidth };
        });
        const buffer = write(workbook, { type: 'buffer', bookType: 'xlsx' })
        await writeFile(filePath, buffer, { encoding: 'utf-8' });
    }
}
