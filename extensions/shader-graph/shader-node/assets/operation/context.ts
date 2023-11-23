import { ShaderNode } from './base';
import { ShaderProperty } from './property';

export class ShaderContext {
    shaderTemplatesDir: '';
    allNodes: ShaderNode[] = [];
    properties: ShaderProperty[] = [];

    localVars: any[] = [];
    getLocalVars: any[] = [];

    reset() {
        this.allNodes.length = 0;
        this.properties.length = 0;

        this.localVars.length = 0;
        this.getLocalVars.length = 0;
    }
}

export const shaderContext = new ShaderContext();
