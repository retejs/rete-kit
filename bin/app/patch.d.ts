export declare function ensure(name: string, stack: string, version: number): Promise<{
    exists: boolean;
}>;
export declare function commit(name: string, stack: string, version: number): Promise<void>;
