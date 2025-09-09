import { BaseTool } from '../base'
import { AIAssets } from '../../filesystem'
import { InstructionFile } from '../../contexts/base'

export class CursorTool extends BaseTool {
  constructor() {
    super('cursor', '.cursor')
  }

  async apply(aiAssets: AIAssets, instructionFiles: (InstructionFile & { path: string })[], force?: boolean): Promise<void> {
    return super.apply(aiAssets, instructionFiles, force, instructions => {
      return instructions.map(instruction => ({
        ...instruction,
        content: `---
alwaysApply: true
---
${instruction.content}`,
        file: `rules/${instruction.file.replace(/\.[^.]+$/, '.mdc')}`
      }))
    })
  }
}
