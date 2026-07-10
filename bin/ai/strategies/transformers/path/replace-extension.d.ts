import { PathTransformer } from '../types';
/**
 * Replaces the file extension with a new one
 */
export declare class ReplaceExtensionTransformer implements PathTransformer {
    private readonly newExtension;
    constructor(newExtension: string);
    transform(file: string): string;
}
