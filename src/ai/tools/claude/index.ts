import { BaseTool } from '../base'
import { SingleFileStrategy, InstructionStrategy, PrefixedHeadingTransformer } from '../../strategies'

export class ClaudeTool extends BaseTool {
  constructor() {
    super('claude', '.')
  }

  protected getStrategy(): InstructionStrategy {
    return new SingleFileStrategy('CLAUDE.md', [
      new PrefixedHeadingTransformer('[Rete]')
    ])
  }
}
