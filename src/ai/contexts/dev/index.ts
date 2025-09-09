import { Context, type InstructionFile } from '../base'

export class DevContext extends Context {
  readonly name = 'dev'
  readonly description = 'Adding to Existing Projects - Help users add Rete.js to their existing codebase/application'
  readonly instructions: InstructionFile[] = [
    { file: 'instructions.md', title: 'Dev Context - Adding to Existing Projects' }
  ]
}
