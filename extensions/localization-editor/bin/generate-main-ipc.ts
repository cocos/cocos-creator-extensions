/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'reflect-metadata';
import { InterfaceDeclaration, OptionalKind, ParameterDeclarationStructure, Project, Scope, Type } from 'ts-morph';
import { readFileSync, createFileSync, existsSync, readJSONSync, writeFileSync, writeJSONSync } from 'fs-extra';
import { ESLint } from 'eslint';

export type Messages = { [key: string]: { methods: string[] } }

class GenerateIPC {
    constructor(
        public threadName: string,
        public ipcName: string,
        public ipcFilePath: string,
        public iThreadName: string,
        public iThreadFilePath: string,
        public executeBody: string,
        public withMessages: boolean = false,
        public messages?: Messages,
    ) {}

    generate() {
        console.log(`检查文件是否存在: ${this.ipcFilePath}`);
        if (existsSync(this.ipcFilePath)) {
            console.log(`清空文件: ${this.ipcFilePath}`);
            writeFileSync(this.ipcFilePath, '', 'utf-8');
        } else {
            console.log(`创建文件: ${this.ipcFilePath}`);
            createFileSync(this.ipcFilePath);
        }

        console.log('读取tsconfig.json配置');
        const project = new Project({
            tsConfigFilePath: 'tsconfig.json',
        });

        const ipcFile = project.getSourceFileOrThrow(this.ipcFilePath);
        console.log(`在 ${this.ipcFilePath} 中添加class ${this.ipcName}`);
        const ipcClass = ipcFile.addClass({
            name: this.ipcName,
            implements: [this.iThreadName],
            isDefaultExport: true,
            decorators: [{
                name: 'singleton',
                trailingTrivia: '()',
            }],
        });
        console.log(`扫描interface ${this.iThreadName}`);
        const iThreadFile = project.getSourceFileOrThrow(this.iThreadFilePath);
        const iThread = iThreadFile.getInterfaceOrThrow(this.iThreadName)!;

        const executeScriptMethod = ipcClass.addMethod({
            name: `execute${this.threadName}Script<T>`,
            isAsync: true,
            returnType: 'Promise<T>',
            scope: Scope.Private,
            parameters: [
                {
                    name: 'method',
                    type: 'string',
                },
                {
                    name: '...args',
                    type: 'any',
                },
            ],
        });
        console.log(`生成方法: ${executeScriptMethod.getText()}`);

        executeScriptMethod.setBodyText(this.executeBody);
        const members = iThread.getMembers();
        for (const extend of iThread.getBaseDeclarations()) {
            if (extend.getType().isInterface() && extend instanceof InterfaceDeclaration) {
                members.push(...extend.getMembers());
            }
        }

        for (const member of members) {
            console.log(`生成方法: ${member.getText()}`);
            const splits = member.getText().split(': (');
            const types = splits[1].split(') => ');
            const params = types[0].split(',');
            const parameters: OptionalKind<ParameterDeclarationStructure>[] = [];
            for (const param of params) {
                const paramDeclares = param.split(':');
                if (paramDeclares.length < 2) continue;
                parameters.push({
                    name: paramDeclares[0].trim(),
                    type: paramDeclares[1].trim(),
                });
            }
            const method = ipcClass.addMethod({
                name: splits[0].trim(),
                isAsync: true,
                returnType: `Promise<${types[1].split('<')[1].replace('>', '').trim()}>`,
                parameters: parameters,
            });
            const message = this.withMessages ? this.toHyphenCase(method.getName()) : method.getName();
            method.setBodyText(`return this.execute${this.threadName}Script('${message}', ...arguments)`);
            if (this.messages) {
                this.messages[message] = {
                    'methods': [
                        method.getName(),
                    ],
                };
            }
        }

        console.log('补全导入依赖模块');
        ipcFile.fixMissingImports();
        console.log(`写入文件: ${this.ipcFilePath}`);
        ipcFile.saveSync();

        let ipcContent = readFileSync(this.ipcFilePath, 'utf-8');
        ipcContent = `/* eslint-disable prefer-rest-params */\n${ipcContent}`;
        writeFileSync(this.ipcFilePath, ipcContent, 'utf-8');

        console.log(`ESLint fix: ${this.ipcFilePath}`);
        const eslint = new ESLint({ fix: true });
        eslint.lintFiles(this.ipcFilePath).then((results) => {
            ESLint.outputFixes(results).then();
        });

        if (this.withMessages) {
            console.log('更新package.json配置');
            const packageJSON = readJSONSync('package.json', {encoding: 'utf-8'});
            packageJSON.contributions.messages = this.messages;
            writeJSONSync('package.json', packageJSON, {
                encoding: 'utf-8',
                spaces: 4,
            });
        }
        console.log('更新完成');
    }

    toHyphenCase(str: string): string {
        return str.replace(/([A-Z])/g, '-$1')
            .toLowerCase();
    }
}

const messages: Messages = {
    'execute-panel-method': {
        methods: [
            'default.executePanelMethod',
        ],
    },
    'scene:ready': {
        'methods': [
            'onSceneReady',
        ],
    },
    'builder:task-changed': {
        'methods': [
            'onBuilderTaskChanged',
        ],
    },
};

try {
    new GenerateIPC(
        'Main',
        'MainIPC',
        'src/lib/core/ipc/MainIPC.ts',
        'IMainThread',
        'src/lib/main/IMainThread.ts',
        'return await Editor.Message.request(MainName, method, ...args) as T;',
        true,
        messages,
    ).generate();

    new GenerateIPC(
        'Scene',
        'SceneIPC',
        'src/lib/core/ipc/SceneIPC.ts',
        'ISceneThread',
        'src/lib/scene/ISceneThread.ts',
        `try {
            return await Editor.Message.request('scene', 'execute-scene-script', {
                name: MainName,
                method,
                args,
            }) as T;
        } catch (e) {
            // @ts-ignore
            if (e.message?.startsWith(CustomError.NAME) ?? false) {
                // @ts-ignore
                throw new CustomError(parseInt(e.message.split(':')[1]));
            } else {
                console.warn(...arguments);
                console.warn(e);
                throw new CustomError(MessageCode.SCENE_ERROR);
            }
        }`,
    ).generate();
} catch (e) {
    console.error(e);
}
