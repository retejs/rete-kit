"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiFileStrategy = void 0;
/**
 * Strategy for keeping instructions as separate files
 */
class MultiFileStrategy {
    constructor(pathTransformerFactory, contentTransformerFactory) {
        this.pathTransformerFactory = pathTransformerFactory;
        this.contentTransformerFactory = contentTransformerFactory;
    }
    transform(instructions) {
        return instructions.map(instruction => {
            const pathTransformers = this.pathTransformerFactory
                ? this.pathTransformerFactory(instruction)
                : [];
            const contentTransformers = this.contentTransformerFactory
                ? this.contentTransformerFactory(instruction)
                : [];
            let file = instruction.file;
            let content = instruction.content;
            // Apply path transformers in sequence
            for (const transformer of pathTransformers) {
                file = transformer.transform(file);
            }
            // Apply content transformers in sequence
            for (const transformer of contentTransformers) {
                content = transformer.transform(content);
            }
            return { file, content, contextId: instruction.contextId, title: instruction.title };
        });
    }
}
exports.MultiFileStrategy = MultiFileStrategy;
