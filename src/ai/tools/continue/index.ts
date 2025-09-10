import { InstructionFile } from '../../contexts/base'
import { AIAssets } from '../../filesystem'
import { BaseTool } from '../base'

export class ContinueTool extends BaseTool {
  constructor() {
    super('continue', '.continue')
  }

  async apply(aiAssets: AIAssets, instructionFiles: (InstructionFile & { path: string })[], force?: boolean): Promise<void> {
    return super.apply(aiAssets, instructionFiles, force, instructions => {
      return instructions.map(instruction => ({
        ...instruction,
        content: instruction.content,
        file: `rules/${instruction.file}`
      }))
    })
  }
}
