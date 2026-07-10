import { existsSync } from 'fs'

import { AiError } from './errors'
import { readTextFile, toolPromptPath } from './paths'
import { assertTool } from './registry'

export function printToolPrompt(tool: string, kind: 'setup' | 'commit'): void {
  assertTool(tool)

  const path = toolPromptPath(tool, kind)

  if (!existsSync(path)) {
    throw new AiError(`Missing ${kind} prompt for tool "${tool}": ${path}`)
  }

  console.log(readTextFile(path))
}
