/* eslint-disable semi */
import TranslateData from '../entity/translate/TranslateData';
import { Transform } from 'tsyringe/dist/typings/types';
import { TranslateFileType } from '../type/type';

export default interface Reader {
    type: TranslateFileType
    read(filePath: string): Promise<TranslateData>
}

export class ReaderTransform implements Transform<Reader[], Map<TranslateFileType, Reader>> {
    transform(incoming: Reader[], args: any): Map<TranslateFileType, Reader> {
        const map = new Map<TranslateFileType, Reader>();
        for (const item of incoming) {
            map.set(item.type, item);
        }
        return map;
    }
}
