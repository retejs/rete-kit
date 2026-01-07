import { InstructionStrategy, F } from './types'

/**
 * Strategy for keeping instructions as separate files
 */
export class MultiFileStrategy implements InstructionStrategy {
  constructor(
    private readonly filePathTransformer?: (originalFile: string) => string,
    private readonly contentTransformer?: (originalContent: string) => string
  ) {}

  transform(instructions: F[]): F[] {
    return instructions.map(instruction => ({
      content: this.contentTransformer 
        ? this.contentTransformer(instruction.content)
        : instruction.content,
      file: this.filePathTransformer
        ? this.filePathTransformer(instruction.file)
        : instruction.file
    }))
  }
}
