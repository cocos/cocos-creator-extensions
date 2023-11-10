/* eslint-disable semi */
import TranslateData from '../entity/translate/TranslateData'
import { Transform } from 'tsyringe/dist/typings/types'
import { TranslateFileType } from '../type/type'

export default interface Writer {
    type: TranslateFileType
    write(filePath: string, data: TranslateData, local: TranslateData): Promise<void>
}

export class WriterTransform implements Transform<Writer[], Map<TranslateFileType, Writer>> {
    transform(incoming: Writer[], args: any): Map<TranslateFileType, Writer> {
        const map = new Map<TranslateFileType, Writer>();
        for (const item of incoming) {
            map.set(item.type, item);
        }
        return map;
    }
}
