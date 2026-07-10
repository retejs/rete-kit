export interface InstructionData {
    path: string;
    content: string;
    file: string;
    contextId: string;
    title: string;
}
export declare class AIAssets {
    private readonly workingDirectory;
    private readonly interactive;
    constructor(workingDirectory: string, interactive?: boolean);
    getInstructionForContext(instructionFile: {
        file: string;
        path: string;
        contextId: string;
        title: string;
    }): InstructionData | null;
    protected handleFileOverwrite(existingFile: string, force?: boolean): Promise<boolean>;
    copyFileWithConfirm(content: string, targetFile: string, force?: boolean): Promise<void>;
}
