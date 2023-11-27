import { ShaderNode } from '../../base';
import { shaderContext } from '../../context';
import { ShaderProperty, ShaderPropertyType } from '../../property';
import { ShaderSlot } from '../../slot';
import { ConcretePrecisionType, TextureConcretePrecision } from '../../type';
import { prop, slot } from '../../utils';
import { register } from '../../../graph/register';

@register({
    style: {
        headerColor: '#ec7063',
    },
})
export default class PropertyNode extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Fixed;
    property: ShaderProperty | null = null;

    name = '';

    data = {
        outputs: [
            slot('Out', {} as any, 'any', 'any'),
        ],
    };

    calcConcretePrecision(): void {
        // super.calcConcretePrecision()

        let concretePrecision = 0;
        const prop = shaderContext.properties.find(p => p.name === this.name)!;
        switch (prop.type) {
            case ShaderPropertyType.Float:
            case ShaderPropertyType.Boolean:
                concretePrecision = 1;
                break;
            case ShaderPropertyType.Vector2:
                concretePrecision = 2;
                break;
            case ShaderPropertyType.Vector3:
                concretePrecision = 4;
                break;
            case ShaderPropertyType.Vector4:
            case ShaderPropertyType.Color:
                concretePrecision = 4;
                break;
        }
        this.slots[0]._concretePrecision = concretePrecision;
    }

    isPropertyNode = true;
    generateCode() {
        const code = '';
        // let prop = shaderContext.properties.find(p => p.name === this.name)
        // if (prop) {
        //     this.outputs.forEach((o, i) => {
        //         if (o.connectSlot) {
        //             o.value = prop.value;
        //             code += `${this.getOutputVarDefine(i)} = ${this.name};\n`
        //         }
        //     })
        // }

        return code;
    }
}

