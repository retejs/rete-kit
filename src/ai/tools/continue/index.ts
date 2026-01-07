import { BaseTool } from '../base'
import {
  MultiFileStrategy,
  InstructionStrategy,
  AddPathPrefixTransformer,
  AddFilenamePrefixTransformer
} from '../../strategies'

export class ContinueTool extends BaseTool {
  constructor() {
    super('continue', '.continue')
  }

  protected getStrategy(): InstructionStrategy {
    return new MultiFileStrategy([
      new AddPathPrefixTransformer('rules'),
      new AddFilenamePrefixTransformer('rete-')
    ])
  }
}
