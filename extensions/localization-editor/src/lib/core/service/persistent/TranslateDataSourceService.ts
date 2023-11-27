/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { singleton } from 'tsyringe';
import { join } from 'path';
import * as YAML from 'js-yaml';
import { ensureDir, ensureFile, readdir, readFile, rm, writeFile, existsSync, lstatSync, readdirSync, rmdirSync, statSync, unlinkSync } from 'fs-extra';
import { MergeTranslateItemOption, TranslateDataMap, TranslateItemKey } from '../../type/type';
import TranslateData from '../../entity/translate/TranslateData';
import ProjectConfigService from './ProjectConfigService';
import TranslateItem from '../../entity/translate/TranslateItem';
import LanguageConfig from '../../entity/translate/LanguageConfig';
import { ConfigDirectoryStructure } from '../../entity/directory-structure/directory-structure';
import IPersistentService from './IPersistentService';
import { CustomError } from '../../error/Errors';
import { MessageCode } from '../../entity/messages/MainMessage';
import UUIDService from '../util/UUIDService';
import Association from '../../entity/translate/Association';
import TranslateItemType from '../../entity/translate/TranslateItemType';

@singleton()
export default class TranslateDataSourceService implements IPersistentService<TranslateDataMap> {
    constructor(
        public globalConfigService: ProjectConfigService,
        public configDirectory: ConfigDirectoryStructure,
        public uuidService: UUIDService,
    ) {}

    private translateDataMap: TranslateDataMap = new Map<Intl.BCP47LanguageTag, TranslateData>();

    private async getAllTranslateDataFile(): Promise<string[]> {
        const datasourceDir = this.configDirectory.translateData;
        if (!existsSync(datasourceDir)) {
            return [];
        }
        const dirs = await readdir(datasourceDir);
        return dirs.map((dir) => join(datasourceDir, dir))
            .filter((fullPath) => existsSync(fullPath) && statSync(fullPath).isFile() && fullPath.endsWith('.yaml'));
    }

    initDataSource() {
        this.translateDataMap.clear();
    }

    async read(): Promise<void> {
        const fullPaths = await this.getAllTranslateDataFile();
        const fileContents: string[] = await Promise.all(fullPaths.map((fullPath) => readFile(fullPath, 'utf-8')));
        fileContents.forEach((content, index) => {
            try {
                const objectTranslateData = YAML.load(content) as TranslateData;
                const translateData: TranslateData = TranslateData.parse(objectTranslateData);
                this.translateDataMap.set(translateData.locale, translateData);
            } catch (e) {
                throw new CustomError(MessageCode.INVALID_TRANSLATE_FILE_CONTENT, fullPaths[index]);
            }
        });
        if (!this.translateDataMap.has(TranslateData.INDEX_LOCALE)) {
            const indexData: TranslateData = new TranslateData();
            this.translateDataMap.set(TranslateData.INDEX_LOCALE, indexData);
        }
        const localLanguage = this.globalConfigService.getLocalLanguage();
        if (localLanguage && !this.translateDataMap.has(localLanguage)) {
            const localData: TranslateData = new TranslateData(localLanguage);
            this.translateDataMap.set(localLanguage, localData);
        }
    }

    async persistent(locale?: Intl.BCP47LanguageTag): Promise<void> {
        await this.generateDir();
        const writeToYaml = async (data: TranslateData) => {
            // 以防传入一个鸭子类型的对象，长得像TranslateData，但不是TranslateData
            if (!(data instanceof TranslateData)) {
                data = TranslateData.parse(data);
            }
            try {
                const objToJson = {
                    ...data,
                    items: Array.from(data.items),
                }
                const fileContent = YAML.dump(objToJson);
                const filePath = this.getFilePath(data.locale);
                await ensureFile(filePath);
                await writeFile(filePath, fileContent, 'utf-8');
            } catch (e) {
                throw new CustomError(MessageCode.INVALID_TRANSLATE_DATA, data.locale, e);
            }
        }

        const rmYaml = async (locale: Intl.BCP47LanguageTag) => {
            const fileName = this.getFilePath(locale);
            if (existsSync(fileName)) {
                await rm(fileName);
            }
        };

        if (locale) {
            const data = this.translateDataMap.get(locale);
            if (data) {
                await writeToYaml(data);
            } else {
                await rmYaml(locale);
            }
        } else {
            const allYamlNames = (await this.getAllTranslateDataFile())
                .map((fullPath) => fullPath.split('/').pop()?.replace('.yaml', '') ?? undefined);
            const allTranslateData = Array.from(this.translateDataMap.values());
            await Promise.all([
                ...allYamlNames.map((name) => {
                    if (name && !this.translateDataMap.has(name)) {
                        return rmYaml(name);
                    } else {
                        return Promise.resolve();
                    }
                }),
                ...allTranslateData.map((data) => writeToYaml(data)),
            ]);
        }
        if (locale !== TranslateData.INDEX_LOCALE && this.translateDataMap.has(TranslateData.INDEX_LOCALE)) {
            await writeToYaml(this.translateDataMap.get(TranslateData.INDEX_LOCALE)!);
        }
    }

    async uninstall(): Promise<void> {
        this.deleteFolder(this.configDirectory.root);
        this.initDataSource();
    }

    private async generateDir(): Promise<void> {
        await ensureDir(this.configDirectory.translateData);
    }

    private getFilePath(locale: Intl.BCP47LanguageTag): string {
        return join(this.configDirectory.translateData, `${locale}.yaml`);
    }

    async addTranslateData(locale: Intl.BCP47LanguageTag): Promise<TranslateData> {
        if (this.translateDataMap.has(locale)) {
            throw new CustomError(MessageCode.TARGET_TRANSLATE_DATA_EXIST, locale);
        }
        const translateData = new TranslateData(locale);
        this.translateDataMap.set(locale, translateData);
        await this.persistent(locale);
        return translateData.clone();
    }

    async removeTranslateData(locale: Intl.BCP47LanguageTag): Promise<boolean> {
        if (!this.translateDataMap.has(locale)) {
            console.log('TranslateDataSourceService.removeTranslateData', `${locale}.yaml don't need delete`);
            return false;
        }
        this.translateDataMap.delete(locale);
        await this.persistent(locale);
        console.log('TranslateDataSourceService.removeTranslateData', `${locale}.yaml delete success`);
        return true;
    }

    async removeAllTranslateData(): Promise<void> {
        const translateDataList = Array.from(this.translateDataMap.values());
        translateDataList.forEach((it) => {
            it.items.clear();
            it.languageConfig.translateFinished = 0;
            it.languageConfig.translateTotal = 0;
            it.languageConfig.compileFinished = 0;
            it.languageConfig.compileTotal = 0;
        });
        await this.persistent();
    }

    private _getLocalTranslateData(): TranslateData {
        const localLanguage = this.globalConfigService.getLocalLanguage();
        if (!localLanguage || !this.translateDataMap.has(localLanguage)) {
            throw new CustomError(MessageCode.LOCAL_LANGUAGE_NOT_SET);
        }
        return this.translateDataMap.get(localLanguage)!;
    }

    getClonedLocalTranslateData(): TranslateData {
        return this._getLocalTranslateData().clone();
    }

    private _getTranslateData(locale: Intl.BCP47LanguageTag): TranslateData {
        if (!this.translateDataMap.has(locale)) {
            throw new CustomError(MessageCode.TARGET_TRANSLATE_DATA_NOT_FOUND, locale);
        }
        return this.translateDataMap.get(locale)!;
    }

    getClonedTranslateData(locale: Intl.BCP47LanguageTag): TranslateData {
        return this._getTranslateData(locale).clone();
    }

    getClonedAllTranslateData(): TranslateData[] {
        return Array.from(this.translateDataMap.values()).map((data) => data.clone());
    }

    getAllLanguageTags(): Intl.BCP47LanguageTag[] {
        return Array.from(this.translateDataMap.keys()).filter((it) => it !== TranslateData.INDEX_LOCALE);
    }

    async overrideTranslateData(translateData: TranslateData): Promise<void> {
        this.translateDataMap.set(translateData.locale, translateData);
        await this.persistent(translateData.locale);
    }

    async saveTranslateData(locale: Intl.BCP47LanguageTag, translateItems: TranslateItem[], mergeOption?: MergeTranslateItemOption): Promise<void> {
        this.updateTranslateData(locale, translateItems, mergeOption);
        await this.persistent(locale);
    }

    /**
     * 该方法只负责更新数据，不会持久化
     * @param locale
     * @param translateItems
     * @param mergeOption
     * @private
     */
    private updateTranslateData(locale: Intl.BCP47LanguageTag, translateItems: TranslateItem[], mergeOption?: MergeTranslateItemOption) {
        const indexData = this._getIndexData();
        const translateData = this._getTranslateData(locale);
        const translateItemValueMap = translateData.transformToValueMap();
        for (const item of translateItems) {
            const sameKeyItem = indexData.items.get(item.key);
            const sameValueItem = translateItemValueMap.get(item.value);
            if (sameKeyItem) {
                const newItem = translateData.items.get(sameKeyItem.key) ?? sameKeyItem.clone().clearAssociation();
                newItem.merge(item, mergeOption);
                if (newItem.value.length > 0) {
                    translateData.items.set(newItem.key, newItem);
                } else {
                    translateData.items.delete(newItem.key);
                }
            } else if (sameValueItem) {
                sameValueItem.merge(item, mergeOption);
                if (!indexData.items.has(sameValueItem.key)) {
                    const newItem = sameValueItem.clone()
                        .clearVariant()
                        .clearValue();
                    indexData.items.set(newItem.key, newItem);
                }
                if (item.value.length > 0) {
                    sameValueItem.clearAssociation();
                    translateData.items.set(sameValueItem.key, sameValueItem);
                } else {
                    translateData.items.delete(sameValueItem.key);
                }
            } else {
                const keyItem = item.clone().clearValue().clearVariant();
                indexData.items.set(keyItem.key, keyItem);
                if (item.value.length > 0) {
                    item.clearAssociation();
                    translateData.items.set(item.key, item);
                    translateItemValueMap.set(item.value, item);
                } else {
                    translateData.items.delete(item.key);
                    translateItemValueMap.delete(item.value);
                }
            }
        }
        const localLanguage = this.globalConfigService.getLocalLanguage();
        const localTranslateData = this._getLocalTranslateData();
        if (translateData.locale !== localLanguage) {
            translateData.statisticsFinished(localTranslateData);
        } else {
            const allTranslateData = Array.from(this.translateDataMap.values());
            allTranslateData.forEach((data) => {
                data.statisticsFinished(localTranslateData);
            });
        }
        translateData.statisticsTotal();
    }

    /**
     * 设置主语言
     * 1、需要将之前的主语言数据拷贝到新的语言，包括value数据（模拟fallback的行为）
     * 2、需要重新计算已翻译字数
     * 3、原主语言编译进度不变，新主语言编译进度为归0
     * @param locale
     */
    async setLocalTranslateData(locale: Intl.BCP47LanguageTag): Promise<void> {
        const localLanguage = this.globalConfigService.getLocalLanguage();
        if (localLanguage !== locale) {
            const oldLocalTranslateData: TranslateData | undefined = this.translateDataMap.get((localLanguage)!);
            const newLocalTranslateData = this.translateDataMap.get(locale) ?? new TranslateData(locale);
            for (const [key, value] of oldLocalTranslateData?.items ?? []) {
                const newItem = value.clone();
                if (!newLocalTranslateData.items.has(key)) {
                    newLocalTranslateData.items.set(key, newItem);
                }
            }
            newLocalTranslateData.statisticsTotal();
            this.translateDataMap.set(newLocalTranslateData.locale, newLocalTranslateData);
            this.translateDataMap.forEach((data) => {
                data.statisticsFinished(newLocalTranslateData);
            });
            await this.persistent();
        }
    }

    async updateLanguageConfig(locale: Intl.BCP47LanguageTag, languageConfig: LanguageConfig): Promise<void> {
        const data = this._getTranslateData(locale);
        data.languageConfig = languageConfig;
        await this.persistent(locale);
    }

    private _getIndexData(): TranslateData {
        return this._getTranslateData(TranslateData.INDEX_LOCALE);
    }

    getClonedIndexData(): TranslateData {
        return this._getIndexData().clone();
    }

    getLocalLanguageConfig(): LanguageConfig | undefined {
        if (!this.globalConfigService.getLocalLanguage()) return undefined;
        return this.translateDataMap.get(this.globalConfigService.getLocalLanguage()!)?.languageConfig;
    }

    getLanguageConfig(locale: Intl.BCP47LanguageTag): LanguageConfig {
        return this._getTranslateData(locale).languageConfig.clone();
    }

    getAllLanguageConfigs(): LanguageConfig[] {
        const localLanguage = this.globalConfigService.getLocalLanguage();
        return Array.from(this.translateDataMap.values())
            .filter((it) => it.locale !== localLanguage && it.locale !== TranslateData.INDEX_LOCALE)
            .map((data) => data.languageConfig.clone());
    }

    changeValue(key: TranslateItemKey, value: string, nodeUuid: string) {
        // TODO
    }

    async addAssociation(key: string, association: Association): Promise<void> {
        try {
            const indexData = this._getIndexData();
            let item!: TranslateItem;
            if (indexData.items.has(key)) {
                item = indexData.items.get(key)!;
            } else if (key.length > 0) {
                item = new TranslateItem(key, '', TranslateItemType.Text, false, [association]);
            } else {
                return;
            }
            item.associations.push(association);
            indexData.items.set(key, item);
            await this.persistent(TranslateData.INDEX_LOCALE);
        } catch (e) {
            if (e instanceof CustomError) {
                console.log(e);
                console.log('Don\'t need remove this association');
            } else {
                console.warn(e);
            }
        }
    }

    async removeAssociation(key: string, association: Association): Promise<void> {
        try {
            const indexData = this._getIndexData();
            const item = indexData.items.get(key);
            if (item) {
                item.removeAssociation(association);
                await this.persistent(TranslateData.INDEX_LOCALE);
            }
        } catch (e) {
            if (e instanceof CustomError) {
                console.log(e);
                console.log('Don\'t need remove this association');
            } else {
                console.warn(e);
            }
        }
    }

    /**
     * 获取待翻译的条目
     * 待翻译条目的定义如下：
     * 1、该item存在于主语言中，且value不为空（理论上在任何语言中都不存在value为空的item，因为在@see TranslateDataService.updateTranslateData中已经将其过滤了）
     * 2、该item不存在于目标语言中，且value不为空（同上）
     * @param targetLanguage
     */
    getShouldTranslateItems(targetLanguage: Intl.BCP47LanguageTag): TranslateItem[] {
        const from = this.getClonedLocalTranslateData();
        const to = this._getTranslateData(targetLanguage);
        return Array.from(from.items.values())
            .filter((item) => (item.value.length > 0)
                        && ((to.items.get(item.key)?.value.length ?? 0) === 0))
            .map((item) => item.clone());
    }

    async clearAllLanguagesProvider() {
        for (const translateData of this.translateDataMap.values()) {
            translateData.languageConfig.providerTag = undefined;
        }
        await this.persistent();
    }

    // 删除文件夹
    private deleteFolder(folderPath: string) {
        try {
            if (!existsSync(folderPath)) return;
            readdirSync(folderPath).forEach((file: string) => {
                const filePath = `${folderPath}/${file}`;
                if (lstatSync(filePath).isDirectory()) {
                    this.deleteFolder(filePath);
                } else {
                    unlinkSync(filePath);
                }
            });
            rmdirSync(folderPath);
        } catch (e) {
            console.log(e);
        }
    }
}
