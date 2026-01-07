import { BaseTool } from '../base'
import { MultiFileStrategy, InstructionStrategy } from '../../strategies'

export class ContinueTool extends BaseTool {
  constructor() {
    super('continue', '.continue')
  }

  protected getStrategy(): InstructionStrategy {
    return new MultiFileStrategy(
      (file) => `rules/${file}`
    )
  }
}
