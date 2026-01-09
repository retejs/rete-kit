"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleFileStrategy = void 0;
/**
 * Strategy for merging all instructions into a single file
 */
class SingleFileStrategy {
    constructor(outputFileName, contentTransformerFactory) {
        this.outputFileName = outputFileName;
        this.contentTransformerFactory = contentTransformerFactory;
    }
    transform(instructions) {
        if (instructions.length === 0) {
            return instructions;
        }
        // Process each instruction individually (apply transformers), then merge them
        const processedContents = instructions.map(instruction => {
            const contentTransformers = this.contentTransformerFactory
                ? this.contentTransformerFactory(instruction)
                : [];
            let content = instruction.content;
            for (const transformer of contentTransformers) {
                content = transformer.transform(content);
            }
            return content;
        });
        // Combine all processed instruction contents
        const finalContent = processedContents.join('\n\n');
        return [
            {
                content: finalContent,
                file: this.outputFileName,
                contextId: instructions[0].contextId,
                title: instructions[0].title
            }
        ];
    }
}
exports.SingleFileStrategy = SingleFileStrategy;
