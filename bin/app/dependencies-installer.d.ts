export type DependenciesAlias = Record<string, string>;
export declare function install(cwd: string, dependencies: string[], aliases?: DependenciesAlias | string, force?: boolean): Promise<void>;
