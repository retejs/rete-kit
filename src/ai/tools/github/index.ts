import { BaseTool } from '../base'

export class GithubTool extends BaseTool {
  constructor() {
    super('github', '.github')
  }

  getTargetFilePath(): string {
    return 'copilot-instructions.md'
  }
}
