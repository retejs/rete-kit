import { InstructionStrategy, F } from './types'
import { ContentTransformer } from './transformers'

/**
 * Strategy for merging all instructions into a single file
 */
export class SingleFileStrategy implements InstructionStrategy {
  constructor(
    private readonly outputFileName: string,
    private readonly contentTransformerFactory?: (instruction: F) => ContentTransformer[]
  ) {}

  transform(instructions: F[]): F[] {
    if (instructions.length === 0) {
      return instructions
    }

    // Process each instruction individually (apply transformers), then merge them
    const processedContents = instructions.map(instruction => {
      const contentTransformers = this.contentTransformerFactory ? this.contentTransformerFactory(instruction) : []
      
      let content = instruction.content
      for (const transformer of contentTransformers) {
        content = transformer.transform(content)
      }
      
      return content
    })

    // Combine all processed instruction contents
    const finalContent = processedContents.join('\n\n')

    return [
      {
        content: finalContent,
        file: this.outputFileName,
        contextId: instructions[0].contextId,
        title: instructions[0].title
      }
    ]
  }
}
