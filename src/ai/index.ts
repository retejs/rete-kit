import { BootContext, DevContext, OnboardContext, PluginContext } from './contexts'
import { AIAssets } from './filesystem'
import { logger } from './logger'
import { Repository } from './repository'
import { AmazonQTool, ClaudeTool, CodexTool, ContinueTool, CursorTool, GithubTool, WindsurfTool } from './tools'

// eslint-disable-next-line max-statements
export async function buildInstructions(selectedTool?: string, contextId?: string, force?: boolean) {
  logger.warn('This command is experimental. Use with caution.')

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
    new ContinueTool()
  ])
  const context = await contexts.select(contextId)
  const tool = await tools.select(selectedTool)
  const assets = new AIAssets(process.cwd())

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
