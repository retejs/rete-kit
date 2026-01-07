import { BaseTool } from '../base'
import { SingleFileStrategy, InstructionStrategy, PrefixedHeadingTransformer, F } from '../../strategies'

export class ClaudeTool extends BaseTool {
  constructor() {
    super('claude', '.')
  }

  protected getStrategy(): InstructionStrategy | undefined {
    return new SingleFileStrategy('CLAUDE.md', (instruction: F) => [
      new PrefixedHeadingTransformer(instruction, '[Rete.js]')
    ])
  }
}
