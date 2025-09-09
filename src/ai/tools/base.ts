import { join } from 'path'

import { AIAssets, InstructionData } from '../filesystem'
import { InstructionFile } from '../contexts/base'

type F = Pick<InstructionData, 'content' | 'file'>
export type TransformFunction = (instructions: F[]) => F[]

export interface Tool {
  getName(): string
  getAssetPath(): string
  apply(aiAssets: AIAssets, instructionFiles: (InstructionFile & { path: string })[], force?: boolean, transform?: TransformFunction): Promise<void>
}

export abstract class BaseTool implements Tool {
  constructor(protected name: string, protected assetPath: string) {}

  getName(): string {
    return this.name
  }

  getAssetPath(): string {
    return this.assetPath
  }


  async apply(aiAssets: AIAssets, instructionFiles: (InstructionFile & { path: string })[], force?: boolean, transform?: TransformFunction): Promise<void> {
    if (instructionFiles.length === 0) {
      return
    }

    const targetDir = join(process.cwd(), this.getAssetPath())
    let instructions: F[] = instructionFiles
      .map(instructionFile => {
        return aiAssets.getInstructionForContext(instructionFile)
      })
      .filter(instruction => instruction !== null)

    // Apply transformation if provided
    if (transform) {
      instructions = transform(instructions)
    }

    for (const instruction of instructions) {
      const targetFile = join(targetDir, instruction.file)
      await aiAssets.copyFileWithConfirm(instruction.content, targetFile, force)
    }
  }
}
