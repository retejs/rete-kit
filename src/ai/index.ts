import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, join, relative } from 'path'

import { assetsAI } from '../consts'
import { confirm, select } from '../shared/inquirer'
import { getContextNames, isValidContext } from './contexts'
import { createContextNotFoundError } from './errors'
import { logger } from './logger'
import { createToolNotFoundError, createToolSelectionError, getTool, getToolNames, type Tool } from './tools'

async function handleFileOverwrite(existingFile: string, force?: boolean): Promise<boolean> {
  if (force) {
    return true
  }

  logger.warn(`Found existing file: ${existingFile}`)

  return await confirm('Overwrite existing file?', false)
}

async function copyFileWithConfirm(sourceFile: string, targetFile: string, force?: boolean): Promise<void> {
  const relativePath = relative(process.cwd(), targetFile)

  if (existsSync(targetFile)) {
    const shouldOverwrite = await handleFileOverwrite(relativePath, force)

    if (!shouldOverwrite) {
      logger.skip(`Skipping ${relativePath}`)
      return
    }
  }

  // Ensure target directory exists
  const targetDir = dirname(targetFile)

  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true })
  }

  copyFileSync(sourceFile, targetFile)
  logger.info(`AI instructions copied to ${relativePath}`)
}

async function processTool(
  sourceDir: string,
  tool: Tool,
  context?: string,
  force?: boolean
): Promise<void> {
  const sourceFile = join(sourceDir, context ?? 'onboard', 'instructions.md')
  const targetDir = join(process.cwd(), tool.getAssetPath())
  const targetFile = join(targetDir, tool.getTargetFilePath())

  if (existsSync(sourceFile)) {
    await copyFileWithConfirm(sourceFile, targetFile, force)
  } else {
    const contextInfo = context
      ? ` for context "${context}"`
      : ''

    logger.warn(`Source file ${sourceFile}${contextInfo} not found, skipping...`)
  }
}

function validateTool(selectedTool: string): Tool {
  const tool = getTool(selectedTool)

  if (!tool) {
    throw createToolNotFoundError(selectedTool)
  }
  return tool
}

async function promptForTool(): Promise<Tool> {
  const toolNames = getToolNames()
  const choices = toolNames.map(name => ({ name, value: name }))

  const selectedToolName = await select('Select a tool:', choices)
  const tool = getTool(selectedToolName)

  if (!tool) {
    throw createToolSelectionError(selectedToolName)
  }

  return tool
}

async function promptForContext(): Promise<string> {
  const contextNames = getContextNames()
  const choices = contextNames.map(name => ({ name, value: name }))

  return await select('Select a context:', choices)
}

async function selectToolIfNotProvided(selectedTool?: string): Promise<Tool> {
  if (selectedTool) {
    return validateTool(selectedTool)
  }

  return await promptForTool()
}

async function validateContext(context?: string): Promise<string> {
  if (!context) {
    return await promptForContext()
  }

  if (!isValidContext(context)) {
    throw createContextNotFoundError(context)
  }

  return context
}

export async function buildInstructions(selectedTool?: string, context?: string, force?: boolean) {
  logger.warn('This command is experimental. Use with caution.')

  const sourceDir = assetsAI

  if (!existsSync(sourceDir)) {
    throw new Error(`Source directory not found at ${sourceDir}`)
  }

  const validatedContext = await validateContext(context)
  const tool = await selectToolIfNotProvided(selectedTool)

  logger.info(`Building instructions using context: "${validatedContext}"`)

  await processTool(sourceDir, tool, validatedContext, force)

  logger.ready('Done.')
}
