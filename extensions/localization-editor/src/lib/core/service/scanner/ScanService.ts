/* eslint-disable no-await-in-loop */
import { join } from 'path';
import glob from 'glob';
import { autoInjectable } from 'tsyringe';
import ScanOption from '../../entity/messages/ScanOption';
import TranslateItem from '../../entity/translate/TranslateItem';
import MediaProcessor from './processor/MediaProcessor';
import ScriptProcessor from './processor/ScriptProcessor';
import SceneProcessor from './processor/SceneProcessor';
import EditorMessageService from '../EditorMessageService';
import { ScanProgressFunction } from '../../type/type';
import ComponentUnLoader from './processor/ComponentUnLoader';
import TranslateData from '../../entity/translate/TranslateData';

@autoInjectable()
export default class ScanService {
    constructor(
        public mediaProcessor: MediaProcessor,
        public sceneProcessor: SceneProcessor,
        public scriptProcessor: ScriptProcessor,
        public editorMessageService: EditorMessageService,
        public componentUnLoader: ComponentUnLoader,
    ) {
    }
    static readonly MEDIA_ASSET_TYPES = ['cc.ImageAsset', 'cc.AudioClip', 'cc.VideoClip', 'cc.TTFFont', 'cc.BitmapFont'];
    static readonly SCENE_ASSET_TYPES = ['cc.SceneAsset', 'cc.Prefab'];
    static readonly SCRIPT_ASSET_TYPES = ['cc.Script'];

    async scan(translateData: TranslateData, options: ScanOption[], progress?: ScanProgressFunction): Promise<TranslateItem[]> {
        const files = await this.scanFiles(options);
        const assetInfos = (await Promise.all(
            files.map((file) => this.editorMessageService.queryAssetInfo(file)),
        )).filter((assetInfo) => assetInfo);

        const valueMap = translateData.transformToValueMap();
        const translateItems: TranslateItem[] = [];
        for (const [i, assetInfo] of assetInfos.entries()) {
            if (!assetInfo) continue;
            const assetType = assetInfo.type;
            let items: TranslateItem[] = [];
            if (ScanService.MEDIA_ASSET_TYPES.includes(assetType)) {
                items = await this.mediaProcessor.process(assetInfo, valueMap);
            } else if (ScanService.SCENE_ASSET_TYPES.includes(assetType)) {
                items = await this.sceneProcessor.process(assetInfo, valueMap);
            } else if (ScanService.SCRIPT_ASSET_TYPES.includes(assetType)) {
                items = await this.scriptProcessor.process(assetInfo, valueMap);
            }
            translateItems.push(...items);
            progress?.(i + 1, assetInfos.length);
        }
        return translateItems;
    }

    async scanAndUnInstall(scanOptions: ScanOption[], progress?: ScanProgressFunction): Promise<void> {
        const assetInfos = await this.editorMessageService.queryAssets({
            pattern: 'db://assets/**/*.{scene,prefab}',
        });
        for (const assetInfo of assetInfos) {
            this.componentUnLoader.process(assetInfo);
        }
    }

    public cancelScan() {
        this.mediaProcessor.cancel();
        this.sceneProcessor.cancel();
        this.scriptProcessor.cancel();
    }

    public generateGlobs(options: ScanOption[]): GenerateGlobs {
        const globs: GenerateGlobs = [];
        for (const option of options) {
            let dirs: string;
            switch (option.dirs.length) {
                case 0:
                    continue;
                case 1:
                    dirs = option.dirs[0];
                    break;
                default:
                    dirs = `{${option.dirs.join(',')}}`;
                    break;
            }

            const ignores: string[] = option.excludes.map((exclude) => join(Editor.Project.path, 'assets', exclude, '**', '*'));

            let extNames: string;
            switch (option.extNames.length) {
                case 0:
                    extNames = '!(*.meta)';
                    break;
                case 1:
                    extNames = `*.${option.extNames[0]}`;
                    break;
                default:
                    extNames = `*.{${option.extNames.join(',')}}`;
                    break;
            }
            globs.push({
                pattern: join(Editor.Project.path, 'assets', dirs, '**', extNames),
                ignores,
            });
        }
        return globs;
    }

    public async scanFiles(options: ScanOption[], progress?: ScanProgressFunction): Promise<string[]> {
        const promises: Promise<string[]>[] = [];
        const globPatterns = this.generateGlobs(options);
        for (const pattern of globPatterns) {
            const options: glob.IOptions = {
                nodir: true,
            };
            if (pattern.ignores.length > 0) {
                options.ignore = pattern.ignores;
            }
            promises.push(
                new Promise((resolve, reject) => {
                    glob(pattern.pattern, options, (err, matches) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(matches.map((mt) => join(mt)));
                        }
                    });
                }),
            );
        }
        return (await Promise.all(promises)).flat();
    }
}

type GenerateGlobs = { pattern: string, ignores: string[] }[];
