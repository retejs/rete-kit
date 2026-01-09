"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplaceExtensionTransformer = void 0;
/**
 * Replaces the file extension with a new one
 */
class ReplaceExtensionTransformer {
    constructor(newExtension) {
        this.newExtension = newExtension;
    }
    transform(file) {
        return file.replace(/\.[^.]+$/, this.newExtension.startsWith('.')
            ? this.newExtension
            : `.${this.newExtension}`);
    }
}
exports.ReplaceExtensionTransformer = ReplaceExtensionTransformer;
