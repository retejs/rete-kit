import { InstructionFile } from '../../contexts/base'
import { AIAssets } from '../../filesystem'
import { BaseTool } from '../base'

export class GithubTool extends BaseTool {
  constructor() {
    super('github', '.github')
  }

  async apply(aiAssets: AIAssets, instructionFiles: (InstructionFile & { path: string })[], force?: boolean): Promise<void> {
    return super.apply(aiAssets, instructionFiles, force, instructions => {
      if (instructions.length === 0) {
        return instructions
      }

      // Combine all instructions into one file
      const combinedContent = instructions
        .map(instruction => instruction.content)
        .join('\n\n')

      return [{
        content: combinedContent,
        file: 'copilot-instructions.md' // Single output file
      }]
    })
  }
}
