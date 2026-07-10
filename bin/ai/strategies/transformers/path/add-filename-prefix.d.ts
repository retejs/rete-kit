import { PathTransformer } from '../types';
/**
 * Adds a prefix to the filename (before the filename, not the path)
 */
export declare class AddFilenamePrefixTransformer implements PathTransformer {
    private readonly prefix;
    constructor(prefix: string);
    transform(file: string): string;
}
