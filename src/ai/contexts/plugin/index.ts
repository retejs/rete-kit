import { Context, type InstructionFile } from '../base'

export class PluginContext extends Context {
  readonly name = 'plugin'
  readonly description = 'Plugin Development & Debugging - Support advanced users developing, debugging, '
  + 'or customizing plugins'
  readonly instructions: InstructionFile[] = [
    { file: 'architecture.md', title: 'Plugin Architecture' },
    { file: 'workflow.md', title: 'Development Workflow' },
    { file: 'protocol.md', title: 'Complete Coverage Protocol' }
  ]
}
