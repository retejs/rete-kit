import { InstructionFile } from '../../contexts/base'
import { AIAssets } from '../../filesystem'
import { BaseTool } from '../base'

export class WindsurfTool extends BaseTool {
  constructor() {
    super('windsurf', '.windsurf')
  }

  async apply(
    aiAssets: AIAssets,
    instructionFiles: (InstructionFile & { path: string })[],
    force?: boolean
  ): Promise<void> {
    return super.apply(aiAssets, instructionFiles, force, instructions => {
      return instructions.map(instruction => ({
        content: `---
trigger: always_on
---\n${instruction.content}`,
        file: `rules/${instruction.file}`
      }))
    })
  }
}
