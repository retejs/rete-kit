"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPathPrefixTransformer = void 0;
/**
 * Adds a prefix to the file path (directory prefix)
 */
class AddPathPrefixTransformer {
    constructor(prefix) {
        this.prefix = prefix;
    }
    transform(file) {
        const normalizedPrefix = this.prefix.endsWith('/')
            ? this.prefix
            : `${this.prefix}/`;
        return `${normalizedPrefix}${file}`;
    }
}
exports.AddPathPrefixTransformer = AddPathPrefixTransformer;
