import { BaseTool } from '../base'
import { MultiFileStrategy, InstructionStrategy } from '../../strategies'

export class AntigravityTool extends BaseTool {
  constructor() {
    super('antigravity', '.')
  }

  protected getStrategy(): InstructionStrategy {
    return new MultiFileStrategy(
      (file) => `.agent/rules/${file}`
    )
  }
}
