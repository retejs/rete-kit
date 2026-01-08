import { AddFilenamePrefixTransformer,
  AddPathPrefixTransformer,
  F,
  InstructionStrategy,
  MultiFileStrategy,
  PrefixedHeadingTransformer } from '../../strategies'
import { BaseTool } from '../base'

export class ContinueTool extends BaseTool {
  constructor() {
    super('continue', '.continue')
  }

  protected getStrategy(): InstructionStrategy | undefined {
    return new MultiFileStrategy(
      (instruction: F) => {
        const contextId = instruction.contextId

        return [
          new AddPathPrefixTransformer('rules'),
          new AddFilenamePrefixTransformer(`${contextId}-`),
          new AddFilenamePrefixTransformer(`rete-`)
        ]
      },
      (instruction: F) => [
        new PrefixedHeadingTransformer(instruction, '[Rete.js]')
      ]
    )
  }
}
