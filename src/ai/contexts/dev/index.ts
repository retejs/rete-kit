import type { Context } from '../base'

export class DevContext implements Context {
  readonly name = 'dev'
  readonly description = 'Adding to Existing Projects - Help users add Rete.js to their existing codebase/application'
}
