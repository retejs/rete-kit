import type { Context } from './base'
import { BootContext } from './boot'
import { DevContext } from './dev'
import { OnboardContext } from './onboard'
import { PluginContext } from './plugin'

const contexts = new Map<string, Context>([
  ['onboard', new OnboardContext()],
  ['boot', new BootContext()],
  ['dev', new DevContext()],
  ['plugin', new PluginContext()]
])

export function getAvailableContexts(): Context[] {
  return Array.from(contexts.values())
}

export function getContextNames(): string[] {
  return Array.from(contexts.keys())
}

export function getContext(name: string): Context | undefined {
  return contexts.get(name)
}

export function isValidContext(name: string): boolean {
  return contexts.has(name)
}

export function getDefaultContext(): Context {
  const defaultContext = contexts.get('onboard')

  if (!defaultContext) {
    throw new Error('Default context "onboard" not found')
  }
  return defaultContext
}
