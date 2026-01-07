import { InstructionStrategy, F } from './types'

/**
 * Strategy for merging all instructions into a single file
 */
export class SingleFileStrategy implements InstructionStrategy {
  constructor(private readonly outputFileName: string) {}

  transform(instructions: F[]): F[] {
    if (instructions.length === 0) {
      return instructions
    }

    const combinedContent = instructions.map(instruction => instruction.content).join('\n\n')

    return [
      {
        content: combinedContent,
        file: this.outputFileName
      }
    ]
  }
}
