"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFilenamePrefixTransformer = void 0;
/**
 * Adds a prefix to the filename (before the filename, not the path)
 */
class AddFilenamePrefixTransformer {
    constructor(prefix) {
        this.prefix = prefix;
    }
    transform(file) {
        const lastSlashIndex = file.lastIndexOf('/');
        if (lastSlashIndex === -1) {
            return `${this.prefix}${file}`;
        }
        const dir = file.substring(0, lastSlashIndex + 1);
        const filename = file.substring(lastSlashIndex + 1);
        return `${dir}${this.prefix}${filename}`;
    }
}
exports.AddFilenamePrefixTransformer = AddFilenamePrefixTransformer;
