import type { Context, InstructionFile } from '../base'

export class DevContext implements Context {
  readonly name = 'dev'
  readonly description = 'Adding to Existing Projects - Help users add Rete.js to their existing codebase/application'

  getInstructions(): InstructionFile[] {
    return [
      { filename: 'instructions.md', title: 'Dev Context - Adding to Existing Projects' }
    ]
  }
}
