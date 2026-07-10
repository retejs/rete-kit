import { PathTransformer } from '../types';
/**
 * Adds a prefix to the file path (directory prefix)
 */
export declare class AddPathPrefixTransformer implements PathTransformer {
    private readonly prefix;
    constructor(prefix: string);
    transform(file: string): string;
}
