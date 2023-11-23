import type { BlockData, IBlockDescription } from '../block-forge/interface';
import type { NodeDefine, PropertyDefine } from '../../@types/shader-node-type';

/**
 * Block 模版数据
 */
export interface BlockTemplateData {
    // 是否主节点，该节点不可被删除，不可被复制，唯一一份
    isMaster?: boolean;
    description: IBlockDescription;
    data: BlockData;
    details?: {
        [key: string]: any
    };
}

/**
 * 存储 Shader Node 与 Shader Property
 */
export interface IModuleOptions {
    shaderNodeMap: Map<string, NodeDefine>;
    shaderPropertyMap: Map<string, PropertyDefine>;
    shaderNodeClassMap: Map<string, any>;// class
}
