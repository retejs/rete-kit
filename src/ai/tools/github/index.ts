import { BaseTool } from '../base'
import { SingleFileStrategy, InstructionStrategy } from '../../strategies'

export class GithubTool extends BaseTool {
  constructor() {
    super('github', '.github')
  }

  protected getStrategy(): InstructionStrategy {
    return new SingleFileStrategy('copilot-instructions.md')
  }
}
