import { BaseTool } from '../base'
import { SingleFileStrategy, InstructionStrategy, PrefixedHeadingTransformer } from '../../strategies'

export class CodexTool extends BaseTool {
  constructor() {
    super('codex', '.')
  }

  protected getStrategy(): InstructionStrategy {
    return new SingleFileStrategy('AGENTS.md', [
      new PrefixedHeadingTransformer('[Rete]')
    ])
  }
}
