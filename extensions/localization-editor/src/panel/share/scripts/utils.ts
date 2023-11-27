import { extname } from 'path';
import { MainName } from '../../../lib/core/service/util/global';
import { TranslateFileType } from '../../../lib/core/type/type';

export function getTranslateFileType(filePath: string): TranslateFileType {
    let translateFileType: TranslateFileType;
    const ext = extname(filePath);
    if (ext === '.po') {
        translateFileType = TranslateFileType.PO;
    } else if (ext === '.csv') {
        translateFileType = TranslateFileType.CSV;
    } else if (ext === '.xlsx') {
        translateFileType = TranslateFileType.XLSX;
    } else {
        throw new Error(`[${MainName}]: cannot get TranslateFileType of ${filePath}`);
    }
    return translateFileType;
}

export function getFileExtNameOfTranslateFileType(translateFileType: TranslateFileType): '.po' | '.csv' | '.xlsx' {
    if (translateFileType === TranslateFileType.PO) {
        return '.po';
    } else if (translateFileType === TranslateFileType.CSV) {
        return '.csv';
    } else if (translateFileType === TranslateFileType.XLSX) {
        return '.xlsx';
    } else {
        throw new Error(`[${MainName}]: cannot get ExtName of ${translateFileType}`);
    }

}
