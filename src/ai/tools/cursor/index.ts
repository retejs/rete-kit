import { BaseTool } from '../base'
import {
  MultiFileStrategy,
  InstructionStrategy,
  AddPathPrefixTransformer,
  ReplaceExtensionTransformer,
  AddYamlFrontmatterTransformer
} from '../../strategies'

export class CursorTool extends BaseTool {
  constructor() {
    super('cursor', '.cursor')
  }

  protected getStrategy(): InstructionStrategy {
    return new MultiFileStrategy(
      [
        new AddPathPrefixTransformer('rules'),
        new ReplaceExtensionTransformer('.mdc')
      ],
      [
        new AddYamlFrontmatterTransformer({ alwaysApply: true })
      ]
    )
  }
}
