import { readFileSync } from 'fs'
import { join } from 'path'

import { assetsAI } from '../consts'
import { logger } from './logger'

/**
 * Loads and formats the guidance message from markdown file for terminal display.
 * Converts markdown formatting (bold, italic, code, etc.) to ANSI escape codes.
 *
 * @returns Formatted guidance text with ANSI codes, or empty string if file doesn't exist
 */
async function getGuidance(): Promise<string> {
  const guidancePath = join(assetsAI, 'guidance.md')

  try {
    const guidanceTemplate = readFileSync(guidancePath, 'utf-8')

    /*
     * Dynamic import is used because markdown-to-ansi is an ES module.
     * When compiled to CommonJS, static imports would be transformed to require(),
     * which doesn't work for ES modules in Node.js 18 and below.
     */
    const markdownToAnsiModule = await import('markdown-to-ansi')
    const markdownToAnsiFactory = markdownToAnsiModule.default ?? markdownToAnsiModule
    const converter = markdownToAnsiFactory()
    // Convert markdown to ANSI-formatted terminal text (supports bold, italic, code, etc.)

    return converter(guidanceTemplate).trim()
  } catch (error) {
    /*
     * Fallback if guidance file doesn't exist or conversion fails
     * File not found (ENOENT) is expected and silent, other errors are logged
     */
    if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
      logger.warn(`Failed to load guidance file: ${error.message}`)
    }
    return ''
  }
}

/**
 * Error class that stores guidance and error messages separately.
 * Used for missing parameter errors to provide helpful guidance to users and AI assistants.
 */
export class GuidanceError extends Error {
  public readonly guidance: Promise<string>

  constructor(message: string) {
    super(message)
    this.name = 'GuidanceError'
    this.guidance = getGuidance()
  }
}
