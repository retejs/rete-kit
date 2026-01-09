import { ContentTransformer } from '../types';
/**
 * Adds YAML frontmatter metadata block to content
 */
export declare class AddYamlFrontmatterTransformer implements ContentTransformer {
    private readonly metadata;
    constructor(metadata: Record<string, string | boolean | number>);
    transform(content: string): string;
}
