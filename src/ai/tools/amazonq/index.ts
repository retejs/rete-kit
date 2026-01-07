import { BaseTool } from '../base'
import { MultiFileStrategy, InstructionStrategy } from '../../strategies'

export class AmazonQTool extends BaseTool {
  constructor() {
    super('amazonq', '.amazonq')
  }

  protected getStrategy(): InstructionStrategy {
    return new MultiFileStrategy(
      (file) => `rules/${file}`
    )
  }
}
