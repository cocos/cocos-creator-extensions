import IAssociation from './IAssociation';

export default class Association implements IAssociation {
    constructor(
        /* 引用的场景的 uuid */
        public sceneUuid?: string,
        /* 引用的节点的 uuid */
        public nodeUuid?: string,
        /* 文件路径 */
        public reference?: string,
    ) {}

    static create(option: {
        sceneUuid?: string,
        nodeUuid?: string,
        reference?: string,
    }): Association {
        return new Association(
            option.sceneUuid,
            option.nodeUuid,
            option.reference,
        );
    }

    clone(): Association {
        return new Association(
            this.sceneUuid,
            this.nodeUuid,
            this.reference,
        );
    }

    static parse(association: IAssociation): Association {
        return new Association(
            association.sceneUuid,
            association.nodeUuid,
            association.reference,
        );
    }

    equals(association: Association): boolean {
        return association.sceneUuid === this.sceneUuid
            && association.nodeUuid === this.nodeUuid
            && association.reference === this.reference;
    }
}
