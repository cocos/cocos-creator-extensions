import { ShaderNode } from '../../base';
import { register } from '../../../graph';
import { slot } from '../../utils';

@register({
    title: 'Output',
    master: true,
    style: {
        headerColor: '#81ff2f',
    },
})
export default class SubGraphOutputNode extends ShaderNode {
    data = {
        inputs: [
            slot('Out', 0, 'any', 'any'),
        ],
    };
}

