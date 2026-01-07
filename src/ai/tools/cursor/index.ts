import { BaseTool } from '../base'
import {
  MultiFileStrategy,
  InstructionStrategy,
  AddPathPrefixTransformer,
  ReplaceExtensionTransformer,
  AddYamlFrontmatterTransformer,
  AddFilenamePrefixTransformer,
  PrefixedHeadingTransformer,
  F
} from '../../strategies'

export class CursorTool extends BaseTool {
  constructor() {
    super('cursor', '.cursor')
  }

  protected getStrategy(): InstructionStrategy | undefined {
    return new MultiFileStrategy(
      (instruction: F) => {
        const contextId = instruction.contextId
        return [
          new AddPathPrefixTransformer('rules'),
          new AddFilenamePrefixTransformer(`${contextId}-`),
          new AddFilenamePrefixTransformer(`rete-`),
          new ReplaceExtensionTransformer('.mdc')
        ]
      },
      (instruction: F) => [
        new PrefixedHeadingTransformer(instruction, '[Rete.js]'),
        new AddYamlFrontmatterTransformer({ alwaysApply: true })
      ]
    )
  }
}
