import { BaseTool } from '../base'
import {
  MultiFileStrategy,
  InstructionStrategy,
  AddPathPrefixTransformer,
  AddYamlFrontmatterTransformer,
  AddFilenamePrefixTransformer,
  PrefixedHeadingTransformer,
  F
} from '../../strategies'

export class WindsurfTool extends BaseTool {
  constructor() {
    super('windsurf', '.windsurf')
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
        new PrefixedHeadingTransformer(instruction, '[Rete.js]'),
        new AddYamlFrontmatterTransformer({ trigger: 'always_on' })
      ]
    )
  }
}
