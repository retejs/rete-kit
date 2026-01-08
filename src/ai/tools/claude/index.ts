import { F, InstructionStrategy, PrefixedHeadingTransformer, SingleFileStrategy } from '../../strategies'
import { BaseTool } from '../base'

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
