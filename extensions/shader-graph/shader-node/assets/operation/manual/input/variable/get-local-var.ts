import { Vec2, Vec4 } from 'cc';
import { ShaderNode } from '../../../base';
import { ConcretePrecisionType } from '../../../type';
import { prop, slot } from '../../../utils';
import { register } from '../../../../graph';
import RegisterLocalVar from './register-local-var';

@register({
    menu: 'Input/Variable/GetLocalVar',
    title: 'GetLocalVar',
})
export default class GetLocalVar extends ShaderNode {
    get name() {
        const name = this.getPropWithName('Name');
        return name && name.value;
    }
    set name(v) {
        const name = this.getPropWithName('Name');
        name.value = v;
    }

    data = {
        props: [
            prop('Name', 'local_var', 'dynamicEnum', {
                registerEnum: {
                    type: 'RegisterLocalVarName',
                    property: 'Name',
                },
            }),
        ],
        outputs: [
            slot('Out', Vec4.ZERO, 'vec4', 'vector'),
        ],
    };

    generateCode() {
        const precisionName = this.inputs[0].connectSlot.precisionName;
        return `${precisionName} ${this.name}= ${this.getInputValue(0)};`;
    }
}

