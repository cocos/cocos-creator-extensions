export interface TranslateResponse {
    status: number;
    translation: string[];
}

export interface YouDaoTranslateResponse {
    errorCode: string;
    query: string;
    translation: string[];
    basic?: string;
    web?: string[];
    l: string;
    dict?: {url: string};
    webdict?: {url: string};
}

export interface GoogleTranslateResponse {
    data: {
        translations: {
            translatedText: string,
        }[]
    }
}
