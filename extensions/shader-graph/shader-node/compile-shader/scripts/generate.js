
const fs = require('fs-extra');
const path = require('path');
const { makeFirstCharUppcase, getFileName } = require('./utils');
const globby = require('globby');

const chunkPaths = [
    path.join(__dirname, '../shader-templates/chunks/math.chunk'),
    path.join(__dirname, '../shader-templates/chunks/noise.chunk'),
    path.join(__dirname, '../shader-templates/chunks/shape.chunk'),
    path.join(__dirname, '../shader-templates/chunks/range.chunk'),
    path.join(__dirname, '../shader-templates/chunks/uv.chunk'),
    path.join(__dirname, '../shader-templates/chunks/input_basic.chunk'),
];

const nodeDir = path.join(__dirname, '../../assets/operation/generated');

const ignoredFuncs = [];

let currentChunk;
function generateChunk(chunkPath) {
    const content = fs.readFileSync(chunkPath, 'utf-8');

    currentChunk = '';
    if (content.includes('// @depChunk')) {
        currentChunk = path.basename(chunkPath).split('.')[0];
    }

    const funcs = fetchFuncs(content);
    fetchParams(content, funcs);

    generateCode(funcs);

    // console.log(objs)
}

// 获取所有 glsl 函数，标记了注释的函数才会被纳入
function fetchFuncs(content) {
    // https://stackoverflow.com/questions/65367401/extract-glsl-function-body-with-regexp
    const reg = /^(\s*)(vec4|vec3|vec2|float|int|void) *(\w*) *\((.*)\) *{([\s\S]*?^\1)}\s*$/gm;
    const funcRegs = content.match(reg);

    const funcs = [];

    funcRegs.forEach(funcReg => {
        const res = new RegExp(reg).exec(funcReg);
        // let res = func.match(reg);

        if (!res) {
            throw new Error('Failed to get Function.');
        }

        const func = {
            return: '',
            outputs: [],
            inputs: [],

            name: res[3],
            body: res[5],
        };

        const inputs = res[4].split(',');
        func.inputs = inputs.map((i, idx) => {
            const res = /(\w+) +(\w+)/.exec(i);
            return { type: res[1], name: res[2] };
        });

        func.return = res[2];
        func.outputs.push({ type: res[2], name: 'Out' });

        funcs.push(func);
    });

    return funcs;
}

// 从注释中获取生成节点的参数

// 生成的文件夹路径
// @folder procedural/noise

/**
  * @param uv notConnect=v_uv.xy
  * @param width default=0.5
  * @param radius default=0.1
  * @presicion fixed
  * @inline
  * @type Slider
*/
function fetchParams(content, funcs) {

    const lines = content.split('\n');
    let folder = '';
    let params = {};
    const paramNames = [
        'inline',
        'presicion',
        'param',
        'type',
    ];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('@folder')) {
            folder = /@folder *(.+)/g.exec(line)[1];
            console.log('--- ', folder);
            continue;
        }
        else {
            paramNames.forEach(name => {
                if (line.includes('@' + name)) {
                    if (name === 'inline') {
                        params[name] = true;
                    }
                    else if (name === 'param') {
                        let setting = new RegExp(`@${name} *(.+)`).exec(line)[1];
                        setting = setting.split(' ');
                        const inputName = setting[0];
                        if (!params.inputs) {
                            params.inputs = {};
                        }

                        params.inputs[inputName] = {};
                        for (let i = 1; i < setting.length; i++) {
                            const inputSetting = setting[i].split('=');
                            params.inputs[inputName][inputSetting[0]] = inputSetting[1];
                        }
                    }
                    else {
                        params[name] = new RegExp(`@${name} *(.+)`).exec(line)[1];
                    }
                }
            });
        }

        funcs.forEach(obj => {
            const test = new RegExp(`${obj.return} * ${obj.name} *\\(`);
            if (test.exec(line)) {
                obj.folder = folder;
                obj.params = params;
                params = {};
            }
        });
    }

    for (let i = funcs.length - 1; i >= 0; i--) {
        const params = funcs[i].params;
        if (!Object.getOwnPropertyNames(params).length) {
            ignoredFuncs.push(funcs[i]);
            funcs.splice(i, 1);
        }
    }
}

// 生成节点代码
function generateCode(funcs) {

    const glsl2CCType = {
        sampler2D: 'texture2D',
        samplerCube: 'textureCube',
        float: 'float',
        vec2: 'vec2',
        vec3: 'vec3',
        vec4: 'vec4',
    };

    const type2Default = {
        texture2D: 'white',
        textureCube: 'white',
        float: '0',
        vec2: 'Vec2.ZERO',
        vec3: 'Vec3.ZERO',
        vec4: 'Vec4.ZERO',
    };

    const type2ConnectType = {
        texture2D: 'texture2D',
        textureCube: 'textureCube',
        float: 'vector',
        vec2: 'vector',
        vec3: 'vector',
        vec4: 'vector',
    };

    funcs.forEach(func => {
        let inputsDatas = ``;
        let inputs = ``;
        func.inputs.forEach((i, idx) => {
            const type = glsl2CCType[i.type];
            if (!type) {
                throw new Error(`Not found type for ${i.type}`);
            }

            const inputParam = func.params.inputs && func.params.inputs[i.name];

            const defaultValue = (inputParam && inputParam.default) || type2Default[type];
            const connectType = type2ConnectType[type];

            const valueDefine = inputParam && inputParam.notConnect ? 'let' : 'const'; 

            inputsDatas += `\n            slot('${i.name}', ${defaultValue}, '${type}', '${connectType}'),`;
            inputs += `\n        ${valueDefine} input${idx} = this.getInputValue(${idx});`;

            if (inputParam) {
                if (inputParam.notConnect) {
                    inputs += `
        if (!this.inputs[${idx}].connectSlot) {
            input${idx} = '${inputParam.notConnect}';
        }
                    `;
                }
            }
        });

        let outputsDatas = ``;
        let outputs = ``;
        func.outputs.forEach((o, idx) => {
            const type = glsl2CCType[o.type];
            if (!type) {
                throw new Error(`Not found type for ${o.type}`);
            }
            const def = type2Default[type];
            const connectType = type2ConnectType[type];

            outputsDatas += `\n            slot('${o.name}', ${def}, '${type}', '${connectType}'),`;
            outputs += `\n        const output${idx} = this.getOutputVarDefine(${idx});`;
        });

        let funcCode = ``;
        if (func.params && func.params.inline) {
            funcCode = func.body.replace('return ', '${output0} = ');

            func.inputs.forEach((input, idx) => {
                funcCode = funcCode.replace(new RegExp(`\\b${input.name}\\b`, 'g'), '${input' + idx + '}');
            });

            const lines = funcCode.split('\n');
            let newFunc = ``;
            for (let i = 0; i < lines.length; i++) {
                const newLine = lines[i].replace(/^ */g, '');
                if (!newLine || newLine === '\r') {
                    continue;
                }
                newFunc += '\n            ' + newLine;
            }
            newFunc += '\n        ';
            funcCode = newFunc;
        }
        else {
            const params = func.inputs.map((input, idx) => '${input' + idx + '}');
            funcCode = '${output0}' + ` = ${func.name}(${params.join(', ')});`;
        }

        const folderLevel = func.folder.split('/').length;
        const pathRel = new Array(folderLevel - 1).fill(1).map(a => '../').join();

        let presicion = '';
        if (func.params.presicion) {
            presicion = `    concretePrecisionType = ConcretePrecisionType.${makeFirstCharUppcase(func.params.presicion)};\n`;
        }

        let depChunks = '';
        if (currentChunk) {
            depChunks = `    depChunks = ['${currentChunk}'];\n`;
        }

        let nodeType = '';
        if (func.params.type) {
            nodeType = `    get type() { return '${func.params.type}'; }\n`;
        }

        const preDefine = presicion + depChunks + nodeType;

        let folder = func.folder;
        let folders = folder.split('/');
        folders = folders.map(f => makeFirstCharUppcase(f));
        folder = folders.join('/');

        const code = `
import { Vec2, Vec3, Vec4 } from 'cc';
import { register } from '${pathRel}../../../graph/register';
import { ShaderNode } from '${pathRel}../../base';
import { ConcretePrecisionType } from '${pathRel}../../type';
import { slot } from '${pathRel}../../utils';

@register({
    menu: '${folder}/${func.name}',
    title: '${func.name}',
})
export default class ${func.name} extends ShaderNode {
${preDefine}
    data = {
        inputs: [${inputsDatas}
        ],
        outputs: [${outputsDatas}
        ],
    };

    calcConcretePrecision() {
        super.calcConcretePrecision();
    }

    generateCode() {
        ${inputs}
        ${outputs}
        return \`${funcCode}\`;
    }
}
    `;
        const nodePath = path.join(nodeDir, func.folder, getFileName(func.name) + '.ts');
        fs.ensureDirSync(path.dirname(nodePath));
        fs.writeFileSync(nodePath, code);
    });

}

// 在 index.ts 中 import 所有节点文件，作为加载所有节点的入口
function generateIndex() {
    const generatedDir = path.join(nodeDir, '**/*.ts');
    const manualDir = path.join(__dirname, '../../assets/operation/manual', '**/*.ts');

    const baseDir = path.join(__dirname, '../../assets/operation');

    const paths = globby.sync([
        generatedDir.replace(/\\/g, '/'),
        manualDir.replace(/\\/g, '/'),
    ]);

    let index = '';
    paths.forEach(p => {
        index += `import './${path.relative(baseDir, p).replace(/\\/g, '/')}';\n`;
    });

    fs.writeFileSync(path.join(baseDir, 'index.ts'), index);
}

function run() {
    chunkPaths.forEach(chunkPath => {
        generateChunk(chunkPath);
    });
    
    ignoredFuncs.forEach(obj => {
        console.warn(`Ignored function ${obj.name}`);
    });
    
    generateIndex();
}

run();
