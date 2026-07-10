import { F } from '../../types';
import { ContentTransformer } from '../types';
/**
 * Transformer that adds a first-level heading with optional prefix
 * Can be used for both single-file and multi-file strategies
 */
export declare class PrefixedHeadingTransformer implements ContentTransformer {
    private readonly instruction;
    private readonly prefix?;
    constructor(instruction: F, prefix?: string | undefined);
    transform(content: string): string;
}
