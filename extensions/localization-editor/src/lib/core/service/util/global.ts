import { join } from 'path';
import type { L10nManager } from '../../../../../@types/runtime/l10n';

export const MainName = 'localization-editor';
export const ProjectAssetPath = join(Editor.Project.path, 'assets');
export const RuntimeBundleName = 'l10n';
export const resourceListPath = 'resource-list';
export const resourceBundlePath = 'resource-bundle';

export const DEFAULT_NAMESPACE: typeof L10nManager['DEFAULT_NAMESPACE'] = 'translation';
export const ASSET_NAMESPACE: typeof L10nManager['ASSET_NAMESPACE'] = 'asset';
export const ALLOW_NAMESPACE: typeof L10nManager['ALLOW_NAMESPACE'] = [DEFAULT_NAMESPACE, ASSET_NAMESPACE];
