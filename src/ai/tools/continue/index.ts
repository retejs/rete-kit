import { BaseTool } from '../base'
import {
  MultiFileStrategy,
  InstructionStrategy,
  AddPathPrefixTransformer
} from '../../strategies'

export class ContinueTool extends BaseTool {
  constructor() {
    super('continue', '.continue')
  }

  protected getStrategy(): InstructionStrategy {
    return new MultiFileStrategy([new AddPathPrefixTransformer('rules')])
  }
}
