import type { Context, InstructionFile } from '../base'

export class BootContext implements Context {
  readonly name = 'boot'
  readonly description = 'New App Creation - Guide users through creating a brand new Rete.js application from scratch'

  getInstructions(): InstructionFile[] {
    return [
      { filename: 'instructions.md', title: 'Boot Context - New App Creation' }
    ]
  }
}
