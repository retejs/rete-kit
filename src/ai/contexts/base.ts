import { join } from 'path'

import { assetsAI } from '../../consts'

export interface InstructionFile {
  file: string
  title: string
}

export abstract class Context {
  abstract readonly name: string
  abstract readonly description: string
  abstract readonly instructions: InstructionFile[]

  getName(): string {
    return this.name
  }

  getInstructions(): (InstructionFile & { path: string; contextId: string })[] {
    const instructionsPath = join(assetsAI, this.name)

    return this.instructions.map(instruction => ({
      ...instruction,
      path: join(instructionsPath, instruction.file),
      contextId: this.name
    }))
  }
}
