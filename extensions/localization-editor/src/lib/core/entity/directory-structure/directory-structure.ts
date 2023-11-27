import { join } from 'path';
import { singleton } from 'tsyringe';
import { MainName } from '../../service/util/global';

class DirectoryStructure {
    base!: string;

    init(base: string) {
        this.base = base;
    }
}

@singleton()
export class ConfigDirectoryStructure extends DirectoryStructure {
    root!: string;
    translateData!: string;
    indexData!: string;
    config!: string;

    init(base: string) {
        super.init(base);
        this.root = join(this.base, MainName);
        this.translateData = join(this.root, 'translate-data');
        this.config = join(this.root, `${MainName}.yaml`);
        this.indexData = join(this.translateData, 'index.yaml');
    }
}

@singleton()
export class ResourceDirectoryStructure extends DirectoryStructure {
    root!: string;
    resourceData!: string;
    resourceList!: string;

    init(base: string): ResourceDirectoryStructure {
        super.init(base);
        this.root = join(this.base, 'assets', 'resources', MainName);
        this.resourceData = join(this.root, 'resource-data');
        this.resourceList = join(this.resourceData, 'resource-list.json');
        return this;
    }
}
