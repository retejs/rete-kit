import { BaseTool } from '../base'
import { MultiFileStrategy, InstructionStrategy } from '../../strategies'

export class WindsurfTool extends BaseTool {
  constructor() {
    super('windsurf', '.windsurf')
  }

  protected getStrategy(): InstructionStrategy {
    return new MultiFileStrategy(
      (file) => `rules/${file}`,
      (content) => `---
trigger: always_on
---\n${content}`
    )
  }
}
