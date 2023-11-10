import IPoHeader from './IPoHeader';

type GetTextHeader = { [headerName: string]: string }
export default class PoHeader implements IPoHeader, GetTextHeader {
    [ headerName: string ]: string
    readonly 'Content-Transfer-Encoding' = '8bit';
    readonly 'Content-Type' = 'text/plain; charset=UTF-8';
    readonly 'MIME-Version' = '1.0';
    'Language-Team': string;
    'Last-Translator': string;
    'PO-Revision-Date': string;
    'POT-Creation-Date': string;
    'Plural-Forms': string;
    'Project-Id-Version': string;
    'Language': Intl.BCP47LanguageTag;

    constructor(
        language: Intl.BCP47LanguageTag,
        languageTeam: string,
        lastTranslator: string,
        poRevisionDate: string,
        potCreationDate: string,
        pluralForms: string,
        projectIdVersion: string,
    ) {
        this['Language'] = language;
        this['Language-Team'] = languageTeam;
        this['Last-Translator'] = lastTranslator;
        this['PO-Revision-Date'] = poRevisionDate;
        this['POT-Creation-Date'] = potCreationDate;
        this['Plural-Forms'] = pluralForms;
        this['Project-Id-Version'] = projectIdVersion;
    }
}
