import { join } from 'path'

import { AIAssets, InstructionData } from '../filesystem'
import { InstructionFile } from '../contexts/base'
import { InstructionStrategy, F } from '../strategies'

export interface Tool {
  getName(): string
  getAssetPath(): string
  apply(aiAssets: AIAssets, instructionFiles: (InstructionFile & { path: string; contextId: string })[], force?: boolean): Promise<void>
}

export abstract class BaseTool implements Tool {
  constructor(protected name: string, protected assetPath: string) {}

  getName(): string {
    return this.name
  }

  getAssetPath(): string {
    return this.assetPath
  }

  protected getStrategy(): InstructionStrategy | undefined {
    return undefined
  }

  async apply(aiAssets: AIAssets, instructionFiles: (InstructionFile & { path: string; contextId: string })[], force?: boolean): Promise<void> {
    if (instructionFiles.length === 0) {
      return
    }

    const targetDir = join(process.cwd(), this.getAssetPath())
    let instructions: F[] = instructionFiles
      .map(instructionFile => {
        return aiAssets.getInstructionForContext(instructionFile)
      })
      .filter((instruction): instruction is InstructionData => instruction !== null)
      .map(instruction => ({
        content: instruction.content,
        file: instruction.file,
        contextId: instruction.contextId,
        title: instruction.title
      }))

    // Apply strategy transformation if provided
    const strategy = this.getStrategy()
    if (strategy) {
      instructions = strategy.transform(instructions)
    }

    for (const instruction of instructions) {
      const targetFile = join(targetDir, instruction.file)

      await aiAssets.copyFileWithConfirm(instruction.content, targetFile, force)
    }
  }
}
