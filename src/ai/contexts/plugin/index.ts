import type { Context, InstructionFile } from '../base'

export class PluginContext implements Context {
  readonly name = 'plugin'
  readonly description = 'Plugin Development & Debugging - Support advanced users developing, debugging, '
  + 'or customizing plugins'

  getInstructions(): InstructionFile[] {
    return [
      { filename: 'instructions.md', title: 'Plugin Context - Development & Debugging' }
    ]
  }
}
