import { ContentTransformer } from './transformers';
import { F, InstructionStrategy } from './types';
/**
 * Strategy for merging all instructions into a single file
 */
export declare class SingleFileStrategy implements InstructionStrategy {
    private readonly outputFileName;
    private readonly contentTransformerFactory?;
    constructor(outputFileName: string, contentTransformerFactory?: ((instruction: F) => ContentTransformer[]) | undefined);
    transform(instructions: F[]): F[];
}
