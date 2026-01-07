import { InstructionStrategy, F } from './types'

/**
 * Transformer for single file strategy that accepts both content and instruction
 */
export interface SingleFileTransformer {
  transform(content: string, instruction: F): string
}

/**
 * Strategy for merging all instructions into a single file
 */
export class SingleFileStrategy implements InstructionStrategy {
  constructor(
    private readonly outputFileName: string,
    private readonly transformers: SingleFileTransformer[] = []
  ) {}

  transform(instructions: F[]): F[] {
    if (instructions.length === 0) {
      return instructions
    }

    const combinedContent = instructions
      .map(instruction => {
        let content = instruction.content

        // Apply transformers in sequence
        for (const transformer of this.transformers) {
          content = transformer.transform(content, instruction)
        }

        return content
      })
      .join('\n\n')

    return [
      {
        content: combinedContent,
        file: this.outputFileName
      }
    ]
  }
}
