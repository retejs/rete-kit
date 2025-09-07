import { getContextNames } from './contexts'
import { getToolNames } from './tools'

export function createToolNotFoundError(toolName: string): Error {
  const availableTools = getToolNames().join(', ')

  return new Error(`Invalid tool "${toolName}". Available tools: ${availableTools}`)
}

export function createToolSelectionError(toolName: string): Error {
  return new Error(`Tool "${toolName}" not found`)
}

export function createContextNotFoundError(contextName: string): Error {
  const availableContexts = getContextNames().join(', ')

  return new Error(`Invalid context "${contextName}". Available contexts: ${availableContexts}`)
}
