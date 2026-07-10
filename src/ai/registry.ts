import { readdirSync } from 'fs'

import { AiError } from './errors'
import { toolsDir } from './paths'

export function getToolIds(): string[] {
  return readdirSync(toolsDir(), { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort()
}

export function assertTool(tool: string): void {
  const ids = getToolIds()

  if (!ids.includes(tool)) {
    throw new AiError(`Unknown tool "${tool}". Available: ${ids.join(', ')}`)
  }
}
