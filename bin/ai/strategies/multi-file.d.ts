import { ContentTransformer, PathTransformer } from './transformers';
import { F, InstructionStrategy } from './types';
/**
 * Strategy for keeping instructions as separate files
 */
export declare class MultiFileStrategy implements InstructionStrategy {
    private readonly pathTransformerFactory?;
    private readonly contentTransformerFactory?;
    constructor(pathTransformerFactory?: ((instruction: F) => PathTransformer[]) | undefined, contentTransformerFactory?: ((instruction: F) => ContentTransformer[]) | undefined);
    transform(instructions: F[]): F[];
}
