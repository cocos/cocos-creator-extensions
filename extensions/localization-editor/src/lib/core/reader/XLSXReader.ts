import CSVReader from './CSVReader';
import { singleton } from 'tsyringe';
import TranslateData from '../entity/translate/TranslateData';
import { read, utils } from 'xlsx';
import { CustomError } from '../error/Errors';
import { MessageCode } from '../entity/messages/MainMessage';
import ICSVTranslateItem from '../entity/csv/ICSVTranslateItem';
import { TranslateFileType } from '../type/type';
import { readFile } from 'fs-extra'
@singleton()
export default class XLSXReader extends CSVReader {
    type: TranslateFileType = TranslateFileType.XLSX;

    async read(filePath: string): Promise<TranslateData> {
        const data = await readFile(filePath);
        const workbook = read(data.buffer, { type: 'string' });
        if (workbook.SheetNames.length < 1) {
            throw new CustomError(MessageCode.UNAVAILABLE_XLSX_FILE, 'no worksheets');
        }
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const csvTranslateItems: ICSVTranslateItem[] = utils.sheet_to_json<ICSVTranslateItem>(worksheet);
        return this.generateTranslateData(csvTranslateItems);
    }
}
