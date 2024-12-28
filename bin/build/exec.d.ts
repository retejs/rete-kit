type Events = {
    log: (line: string) => void;
    error: (line: string) => void;
    resolveOn: (line: string) => boolean;
};
export declare function awaitedExec(command: string, args: string[], options: {
    cwd?: string;
}, events: Events): Promise<void>;
export {};
