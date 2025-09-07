import type { Context } from '../base'

export class BootContext implements Context {
  readonly name = 'boot'
  readonly description = 'New App Creation - Guide users through creating a brand new Rete.js application from scratch'
}
