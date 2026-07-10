import { requireBundle } from './bundle'
import { printToolPrompt } from './prompt'

export function runCommit(cwd: string, tool: string): void {
  requireBundle(cwd)
  printToolPrompt(tool, 'commit')
}
