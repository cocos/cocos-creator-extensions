export interface TranslateRequest {
    url: string;
    query: string[];
    from: string;
    to: string;
    appKey?: string;
    appSecret?: string;
}

export interface YouDaoTranslateRequest {
    q: string;
    from: string;
    to: string;
    appKey: string;
    salt: string;
    sign: string;
    signType: 'v3';
    curtime: number;
}

export interface GoogleTranslateRequest {
    q: string;
    source: string;
    target: string;
    'X-RapidAPI-Host': string;
    'X-RapidApi-Key': string;
}
