import { BaseTool } from '../base'
import {
  MultiFileStrategy,
  InstructionStrategy,
  AddPathPrefixTransformer,
  AddFilenamePrefixTransformer,
  PrefixedHeadingTransformer,
  F
} from '../../strategies'

export class AmazonQTool extends BaseTool {
  constructor() {
    super('amazonq', '.amazonq')
  }

  protected getStrategy(): InstructionStrategy | undefined {
    return new MultiFileStrategy(
      (instruction: F) => {
        const contextId = instruction.contextId
        return [
          new AddPathPrefixTransformer('rules'),
          new AddFilenamePrefixTransformer(`${contextId}-`),
          new AddFilenamePrefixTransformer(`rete-`),
        ]
      },
      (instruction: F) => [
        new PrefixedHeadingTransformer(instruction, '[Rete.js]')
      ]
    )
  }
}
