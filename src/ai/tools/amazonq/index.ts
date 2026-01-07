import { BaseTool } from '../base'
import {
  MultiFileStrategy,
  InstructionStrategy,
  AddPathPrefixTransformer
} from '../../strategies'

export class AmazonQTool extends BaseTool {
  constructor() {
    super('amazonq', '.amazonq')
  }

  protected getStrategy(): InstructionStrategy {
    return new MultiFileStrategy([new AddPathPrefixTransformer('rules')])
  }
}
