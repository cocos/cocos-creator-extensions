import { ShaderNode } from '../../base';
import { ConcretePrecisionType } from '../../type';

export default class InputNode extends ShaderNode {
    concretePrecisionType = ConcretePrecisionType.Fixed;
}

