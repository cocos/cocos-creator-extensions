import { Configuration, HotModuleReplacementPlugin, ProgressPlugin } from 'webpack';
import { resolve } from 'path';
import { VueLoaderPlugin } from 'vue-loader';
import DashboardPlugin from 'webpack-dashboard/plugin';
import { merge } from 'webpack-merge';
import pkg from './package.json';
import {DefinePlugin} from 'webpack';

const externalsFromPackages: string[] = Object.keys(pkg.dependencies ?? {});
const mode: Configuration['mode'] = process.env['production'] ? 'production' : 'development';
const mainEntry = {
    'main': [
        'webpack/hot/poll?1000',
        resolve(__dirname, 'src', 'lib', 'main', 'main.ts'),
    ],
    'scene': resolve(__dirname, 'src', 'lib', 'scene', 'scene.ts'),
    'server': resolve(__dirname, 'src', 'lib', 'server', 'server.ts'),
    'builder': resolve(__dirname, 'src', 'lib', 'builder', 'builder.ts'),
    'builder-hooks': resolve(__dirname, 'src', 'lib', 'builder', 'hooks.ts'),
};

const renderEntry = {
    'default': resolve(__dirname, 'src', 'panel', 'default', 'index.ts'),
    'l10n-label-inspector': resolve(__dirname, 'src', 'panel', 'l10n-label-inspector', 'index.ts'),
    'builder': resolve(__dirname, 'src', 'panel', 'builder', 'index.ts'),
};
const externals: Configuration['externals'] = [
    'cc', // 引擎dts
    {
        'Editor': {
            root: 'Editor',
        },
    },
    'Intl',
].concat(externalsFromPackages);

const base: Configuration = {
    mode,
    output: {
        library: {
            type: 'umd2',
        },
        clean: true,
        publicPath: '',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    'swc-loader',
                    resolve(__dirname, 'pre-swc-loader'),
                ],
            },
        ],
    },
    externals,
    externalsPresets: {
        node: true,
        electron: true,
    },
    resolve: {
        extensions: ['.vue', '.js', '.json', '.ts', '.less', '.css', '...'],
    },
    plugins: [
        new HotModuleReplacementPlugin(),
        new DashboardPlugin(),
        new ProgressPlugin(),
    ],
    devtool: mode === 'production' ? undefined : 'source-map',
    optimization: {
        minimize: mode === 'production' ? true : false,
    },
};

const configs: Configuration[] = [
    merge(base, {
        entry: mainEntry,
        target: ['electron-main'],
        output: {
            path: resolve(__dirname, 'webpack-dist', 'electron-main'),
        },
    }),
    merge(base, {
        output: {
            path: resolve(__dirname, 'webpack-dist', 'electron-renderer'),
        },
        entry: renderEntry,
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        shadowMode: true,
                        compilerOptions: {
                            isCustomElement: (tag: string) => {
                                return tag.startsWith('ui');
                            },
                        },
                    },
                },
                {
                    test: /\.(le|c)ss$/,
                    use: [
                        'raw-loader',
                        'less-loader',
                    ],
                },
            ],
        },
        target: ['electron-renderer'],
        plugins: [
            new VueLoaderPlugin(),
            new DefinePlugin({
                // 不适配 vue2.x
                __VUE_OPTIONS_API__: false,
                // 不需要使用开发时工具
                __VUE_PROD_DEVTOOLS__: false,
            }),
        ],
    }),
];

export default configs;
