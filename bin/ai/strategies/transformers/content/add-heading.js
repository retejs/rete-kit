"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrefixedHeadingTransformer = void 0;
/**
 * Transformer that adds a first-level heading with optional prefix
 * Can be used for both single-file and multi-file strategies
 */
class PrefixedHeadingTransformer {
    constructor(instruction, prefix) {
        this.instruction = instruction;
        this.prefix = prefix;
    }
    transform(content) {
        // Add first-level heading with prefix and instruction title
        const title = this.instruction.title || this.instruction.file.split('/').pop() || this.instruction.file;
        const heading = this.prefix
            ? `# ${this.prefix} ${title}`
            : `# ${title}`;
        return `${heading}\n\n${content}`;
    }
}
exports.PrefixedHeadingTransformer = PrefixedHeadingTransformer;
