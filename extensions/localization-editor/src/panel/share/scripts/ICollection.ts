export interface ICollection {
    /**
     * 多份搜索的路径
     */
    dirs: string[];
    /**
     * 多份扩展名
     */
    extNames: string[];
    /**
     * 排除的目录路径
     */
    excludes: string[];
}
