import { BaseTool } from '../base'
import { SingleFileStrategy, InstructionStrategy, PrefixedHeadingTransformer, F } from '../../strategies'

export class GithubTool extends BaseTool {
  constructor() {
    super('github', '.github')
  }

  protected getStrategy(): InstructionStrategy | undefined {
    return new SingleFileStrategy('copilot-instructions.md', (instruction: F) => [
      new PrefixedHeadingTransformer(instruction, '[Rete.js]')
    ])
  }
}
