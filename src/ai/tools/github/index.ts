import { F, InstructionStrategy, PrefixedHeadingTransformer, SingleFileStrategy } from '../../strategies'
import { BaseTool } from '../base'

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
