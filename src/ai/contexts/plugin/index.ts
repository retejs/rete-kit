import { Context, type InstructionFile } from '../base'

export class PluginContext extends Context {
  readonly name = 'plugin'
  readonly description = 'Plugin Development & Debugging - Support advanced users developing, debugging, '
  + 'or customizing plugins'
  readonly instructions: InstructionFile[] = [
    { file: 'instructions.md', title: 'Plugin Context - Development & Debugging' }
  ]
}
