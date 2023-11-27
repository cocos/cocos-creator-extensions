import { Vec2, Vec4 } from 'cc';
import { ShaderNode } from '../../../base';
import { ConcretePrecisionType } from '../../../type';
import { prop, slot } from '../../../utils';
import { register } from '../../../../graph';

@register({
    menu: 'Input/Variable/RegisterLocalVar',
    title: 'RegisterLocalVar',
})
export default class RegisterLocalVar extends ShaderNode {
    isRegisterLocalVar = true;

    get name() {
        const name = this.getPropWithName('Name');
        return name.value;
    }
    set name(v) {
        const name = this.getPropWithName('Name');
        name.value = v;
    }

    data = {
        props: [
            prop('Name', 'local_var', 'string', {
                registerEnumType: 'RegisterLocalVarName',
            }),
        ],
        inputs: [
            slot('In', Vec4.ZERO, 'vec4', 'vector'),
        ],
    };

    generateCode() {
        return '';

        // const name = this.getPropWithName('Name');
        // const precisionName = this.inputs[0].connectSlot.precisionName;
        // return `${precisionName} ${name.value}= ${this.getInputValue(0)};`;
    }
}

