import TranslateProviderConfig from './TranslateProviderConfig';
import ScanOption from '../messages/ScanOption';
import IProjectConfig from './IProjectConfig';

export default class ProjectConfig implements IProjectConfig {
    public static ConfigName = 'ProjectConfig';

    constructor(
        public localLanguage?: Intl.BCP47LanguageTag,
        public scanOptions: ScanOption[] = [],
    ) {}

    static parse(config: IProjectConfig): ProjectConfig {
        return new ProjectConfig(
            config.localLanguage,
            config.scanOptions?.map((scanOption) => ScanOption.parse(scanOption)),
        );
    }
}
