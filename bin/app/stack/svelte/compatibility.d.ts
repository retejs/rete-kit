interface ToolsSet {
    create: {
        version: string;
        flags?: string[];
    };
    kit: {
        version: string;
    };
    config?: {
        path?: string;
    };
    adapter: {
        version: string;
    };
}
export declare function getToolsFor(version: number): ToolsSet;
export declare function getConfigFor(version: number): {
    source: string;
    name: string;
};
export {};
