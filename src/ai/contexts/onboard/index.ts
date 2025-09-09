import type { Context, InstructionFile } from '../base'

export class OnboardContext implements Context {
  readonly name = 'onboard'
  readonly description = 'Learning & Concepts - Help users new to Rete.js understand fundamentals'

  getInstructions(): InstructionFile[] {
    return [
      { filename: 'instructions.md', title: 'Onboard Context - Learning & Concepts' }
    ]
  }
}
