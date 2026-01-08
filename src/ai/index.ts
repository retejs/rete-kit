import { BootContext, DevContext, OnboardContext, PluginContext } from './contexts'
import { AIAssets } from './filesystem'
import { GuidanceError } from './guidance'
import { logger } from './logger'
import { Repository } from './repository'
import { AmazonQTool, AntigravityTool, ClaudeTool, CodexTool, ContinueTool, CursorTool, GithubTool, WindsurfTool } from './tools'

const contexts = new Repository('context', [
  new OnboardContext(),
  new BootContext(),
  new DevContext(),
  new PluginContext()
])

const tools = new Repository('tool', [
  new CursorTool(),
  new GithubTool(),
  new AmazonQTool(),
  new WindsurfTool(),
  new CodexTool(),
  new ClaudeTool(),
  new ContinueTool(),
  new AntigravityTool()
])

export function getToolNames(): string[] {
  return tools.getNames()
}

function validateParameters(contextId: string | undefined, selectedTool: string | undefined, isInteractive: boolean): void {
  if (!isInteractive) {
    if (!contextId) {
      throw new GuidanceError('No context specified')
    }
    if (!selectedTool) {
      throw new GuidanceError('No tool specified')
    }
  }
}

export async function buildInstructions(selectedTool?: string, contextId?: string, force?: boolean, interactive = false) {
  logger.warn('This command is experimental. Use with caution.')

  validateParameters(contextId, selectedTool, interactive)

  const context = await contexts.select(contextId, interactive)
  const tool = await tools.select(selectedTool, interactive)
  const assets = new AIAssets(process.cwd(), interactive)

  logger.info(`Building instructions using context: "${context.getName()}"`)

  const instructionFiles = context.getInstructions()

  if (instructionFiles.length === 0) {
    logger.warn(`No instruction files found for context "${context.getName()}", skipping...`)
    return
  }

  // Process instructions using the tool
  await tool.apply(assets, instructionFiles, force)

  logger.ready('Done.')
}
