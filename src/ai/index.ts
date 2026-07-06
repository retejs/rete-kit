import { runCommit } from './commit'
import { emitBundle } from './emit'
import { AiError, MISSING_TOOL_FOR_COMMIT } from './errors'
import { logger } from './logger'
import { runSetup } from './setup'

export { AiError } from './errors'
export { getToolIds } from './registry'

export interface AiOptions {
  tool?: string
  commit?: boolean
}

export async function runAi(options: AiOptions): Promise<void> {
  logger.warn('This command is experimental. Use with caution.')

  const cwd = process.cwd()

  if (options.commit) {
    if (!options.tool) {
      throw new AiError(MISSING_TOOL_FOR_COMMIT)
    }
    runCommit(cwd, options.tool)
    return
  }

  if (options.tool) {
    runSetup(cwd, options.tool)
    return
  }

  await emitBundle(cwd)
}
