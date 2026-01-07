import { BaseTool } from '../base'
import { SingleFileStrategy, InstructionStrategy, PrefixedHeadingTransformer, F } from '../../strategies'

export class CodexTool extends BaseTool {
  constructor() {
    super('codex', '.')
  }

  protected getStrategy(): InstructionStrategy | undefined {
    return new SingleFileStrategy('AGENTS.md', (instruction: F) => [
      new PrefixedHeadingTransformer(instruction, '[Rete.js]')
    ])
  }
}
