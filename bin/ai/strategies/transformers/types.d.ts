/**
 * Path transformers for modifying file paths
 */
export interface PathTransformer {
    transform(file: string): string;
}
/**
 * Content transformers for modifying file content
 */
export interface ContentTransformer {
    transform(content: string): string;
}
