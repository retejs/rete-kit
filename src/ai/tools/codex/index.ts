import { F, InstructionStrategy, PrefixedHeadingTransformer, SingleFileStrategy } from '../../strategies'
import { BaseTool } from '../base'

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
