import { InstructionFile } from '../contexts/base';
import { AIAssets } from '../filesystem';
import { InstructionStrategy } from '../strategies';
export interface Tool {
    getName(): string;
    getAssetPath(): string;
    apply(aiAssets: AIAssets, instructionFiles: (InstructionFile & {
        path: string;
        contextId: string;
    })[], force?: boolean): Promise<void>;
}
export declare abstract class BaseTool implements Tool {
    protected name: string;
    protected assetPath: string;
    constructor(name: string, assetPath: string);
    getName(): string;
    getAssetPath(): string;
    protected getStrategy(): InstructionStrategy | undefined;
    apply(aiAssets: AIAssets, instructionFiles: (InstructionFile & {
        path: string;
        contextId: string;
    })[], force?: boolean): Promise<void>;
}
