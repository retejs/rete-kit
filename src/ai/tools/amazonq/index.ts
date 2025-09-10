import { InstructionFile } from '../../contexts/base'
import { AIAssets } from '../../filesystem'
import { BaseTool } from '../base'

export class AmazonQTool extends BaseTool {
  constructor() {
    super('amazonq', '.amazonq')
  }

  async apply(
    aiAssets: AIAssets,
    instructionFiles: (InstructionFile & { path: string })[],
    force?: boolean
  ): Promise<void> {
    return super.apply(aiAssets, instructionFiles, force, instructions => {
      return instructions.map(instruction => ({
        content: instruction.content,
        file: `rules/${instruction.file}`
      }))
    })
  }
}
