import IScanOption from './IScanOption';

export default class ScanOption implements IScanOption {
    constructor(
        public dirs: string[],
        public extNames: string[] = [],
        public excludes: string[] = [],
    ) {}

    static parse(option: IScanOption): ScanOption {
        return new ScanOption(
            option.dirs,
            option.extNames,
            option.excludes,
        );
    }

    clone(): ScanOption {
        return new ScanOption(
            this.dirs,
            this.extNames,
            this.excludes,
        );
    }
}
