"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddYamlFrontmatterTransformer = void 0;
/**
 * Adds YAML frontmatter metadata block to content
 */
class AddYamlFrontmatterTransformer {
    constructor(metadata) {
        this.metadata = metadata;
    }
    transform(content) {
        const yamlLines = Object.entries(this.metadata)
            .map(([key, value]) => {
            if (typeof value === 'string') {
                return `${key}: ${value}`;
            }
            return `${key}: ${value}`;
        })
            .join('\n');
        return `---
${yamlLines}
---
${content}`;
    }
}
exports.AddYamlFrontmatterTransformer = AddYamlFrontmatterTransformer;
