import { BaseTool } from '../base'

export class CursorTool extends BaseTool {
  constructor() {
    super('cursor', '.cursor')
  }

  getTargetFilePath(): string {
    return 'rules/instructions.md'
  }
}
