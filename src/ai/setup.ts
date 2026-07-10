import { requireBundle } from './bundle'
import { printToolPrompt } from './prompt'

export function runSetup(cwd: string, tool: string): void {
  requireBundle(cwd)
  printToolPrompt(tool, 'setup')
}
