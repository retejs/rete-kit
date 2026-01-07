import { BaseTool } from '../base'
import {
  MultiFileStrategy,
  InstructionStrategy,
  AddPathPrefixTransformer,
  AddYamlFrontmatterTransformer
} from '../../strategies'

export class WindsurfTool extends BaseTool {
  constructor() {
    super('windsurf', '.windsurf')
  }

  protected getStrategy(): InstructionStrategy {
    return new MultiFileStrategy(
      [new AddPathPrefixTransformer('rules')],
      [new AddYamlFrontmatterTransformer({ trigger: 'always_on' })]
    )
  }
}
