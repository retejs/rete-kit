import { InstructionFile } from '../../contexts/base'
import { AIAssets } from '../../filesystem'
import { BaseTool } from '../base'

export class CodexTool extends BaseTool {
  constructor() {
    super('codex', '.')
  }

  async apply(
    aiAssets: AIAssets,
    instructionFiles: (InstructionFile & { path: string })[],
    force?: boolean
  ): Promise<void> {
    return super.apply(aiAssets, instructionFiles, force, instructions => {
      const combinedContent = instructions.map(instruction => instruction.content).join('\n\n')

      return [{
        content: combinedContent,
        file: `AGENTS.md`
      }]
    })
  }
}
