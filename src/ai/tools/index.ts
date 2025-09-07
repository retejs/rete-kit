import { type Tool } from './base'
import { CursorTool } from './cursor'
import { GithubTool } from './github'

export type { Tool } from './base'
export { CursorTool } from './cursor'
export { createToolNotFoundError, createToolSelectionError } from './errors'
export { GithubTool } from './github'

const tools = new Map<string, Tool>([
  ['cursor', new CursorTool()],
  ['github', new GithubTool()]
])

export function getToolNames(): string[] {
  return Array.from(tools.keys())
}

export function getTool(toolName: string): Tool | undefined {
  return tools.get(toolName)
}
