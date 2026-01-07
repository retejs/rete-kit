import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, relative } from 'path'

import { confirm } from '../shared/inquirer'
import { logger } from './logger'

export interface InstructionData {
  path: string
  content: string
  file: string
}

export class AIAssets {
  constructor(
    private readonly workingDirectory: string,
    private readonly interactive: boolean = false
  ) {}

  getInstructionForContext(instructionFile: { file: string, path: string }): InstructionData | null {
    const sourceFile = instructionFile.path // use the path property for absolute path

    if (existsSync(sourceFile)) {
      const content = readFileSync(sourceFile, 'utf-8')

      return {
        path: sourceFile,
        content,
        file: instructionFile.file // keep original filename
      }
    }
    logger.warn(`Source file ${sourceFile} not found, skipping...`)
    return null
  }

  protected async handleFileOverwrite(existingFile: string, force?: boolean): Promise<boolean> {
    if (force) {
      return true
    }

    // In non-interactive mode, skip prompting and default to not overwriting
    if (!this.interactive) {
      logger.warn(`Found existing file: ${existingFile}. Skipping (use --force to overwrite in non-interactive mode)`)
      return false
    }

    logger.warn(`Found existing file: ${existingFile}`)

    return await confirm('Overwrite existing file?', false)
  }

  async copyFileWithConfirm(content: string, targetFile: string, force?: boolean): Promise<void> {
    const relativePath = relative(this.workingDirectory, targetFile)

    if (existsSync(targetFile)) {
      const shouldOverwrite = await this.handleFileOverwrite(relativePath, force)

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

    writeFileSync(targetFile, content)
    logger.info(`AI instructions copied to ${relativePath}`)
  }
}
