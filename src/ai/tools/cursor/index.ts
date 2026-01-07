import { BaseTool } from '../base'
import { MultiFileStrategy, InstructionStrategy } from '../../strategies'

export class CursorTool extends BaseTool {
  constructor() {
    super('cursor', '.cursor')
  }

  protected getStrategy(): InstructionStrategy {
    return new MultiFileStrategy(
      (file) => `rules/${file.replace(/\.[^.]+$/, '.mdc')}`,
      (content) => `---
alwaysApply: true
---
${content}`
    )
  }
}
