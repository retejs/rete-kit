export type PackageFile = {
    name: string;
    dependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
};
export type Dependencies = string[];
export type PackageMeta = {
    folder: string;
    config: PackageFile;
};
export type Topology = {
    dependent: Dependencies;
    dependencies: Dependencies;
};
export declare function getDependencyTopo<T extends PackageMeta>(list: T[]): (T & Topology)[];
