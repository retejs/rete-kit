import { getToolNames } from './index'

export function createToolNotFoundError(toolName: string): Error {
  const availableTools = getToolNames().join(', ')

  return new Error(`Invalid tool "${toolName}". Available tools: ${availableTools}`)
}

export function createToolSelectionError(toolName: string): Error {
  return new Error(`Tool "${toolName}" not found`)
}
