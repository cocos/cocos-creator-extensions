import { singleton } from 'tsyringe';
import ProjectConfig from '../../entity/config/ProjectConfig';
import TranslateProviderConfig from '../../entity/config/TranslateProviderConfig';
import ScanOption from '../../entity/messages/ScanOption';
import IPersistentService from './IPersistentService';
import { MainName } from '../util/global';
import IProjectConfig from '../../entity/config/IProjectConfig';

@singleton()
export default class ProjectConfigService implements IPersistentService<ProjectConfig> {
    private projectConfig!: ProjectConfig;
    private l10nEnable = false;

    static L10nEnableConfigName = 'L10nEnable';

    async toggle(): Promise<boolean> {
        this.l10nEnable = !this.l10nEnable;
        await Editor.Profile.setProject(MainName, ProjectConfigService.L10nEnableConfigName, this.l10nEnable);
        return this.l10nEnable;
    }

    async enableChanged() {
        await this.read();
    }

    getEnable(): boolean {
        return this.l10nEnable;
    }

    initDataSource(): void {
        this.projectConfig = new ProjectConfig();
    }

    async read(): Promise<void> {
        try {
            const objectGlobalConfig = (await Editor.Profile.getProject(MainName, ProjectConfig.ConfigName)) as IProjectConfig;
            this.projectConfig = ProjectConfig.parse(objectGlobalConfig);
            this.l10nEnable = (await Editor.Profile.getProject(MainName, ProjectConfigService.L10nEnableConfigName)) as boolean;
        } catch (e) {
            this.initDataSource();
        }
    }

    async persistent(): Promise<void> {
        await Editor.Profile.setProject(MainName, ProjectConfig.ConfigName, this.projectConfig);
    }

    async uninstall(): Promise<void> {
        await Editor.Profile.removeProject(MainName, ProjectConfig.ConfigName);
        this.initDataSource();
    }

    async setLocalLanguage(localLanguage: Intl.BCP47LanguageTag): Promise<void> {
        this.projectConfig.localLanguage = localLanguage;
        await this.persistent();
    }

    getLocalLanguage(): Intl.BCP47LanguageTag | undefined {
        return this.projectConfig.localLanguage;
    }

    async setScanOptions(scanOptions: ScanOption[]): Promise<void> {
        this.projectConfig.scanOptions = scanOptions;
        await this.persistent();
    }

    getScanOptions(): ScanOption[] {
        return this.projectConfig.scanOptions.map((item) => item.clone());
    }
}
