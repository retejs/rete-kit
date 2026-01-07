import { BaseTool } from '../base'
import {
  MultiFileStrategy,
  InstructionStrategy,
  AddPathPrefixTransformer,
  AddFilenamePrefixTransformer
} from '../../strategies'

export class AntigravityTool extends BaseTool {
  constructor() {
    super('antigravity', '.')
  }

  protected getStrategy(): InstructionStrategy {
    return new MultiFileStrategy([
      new AddPathPrefixTransformer('.agent/rules'),
      new AddFilenamePrefixTransformer('rete-')
    ])
  }
}
