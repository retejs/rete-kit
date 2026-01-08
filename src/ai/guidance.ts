import { readFileSync } from 'fs'
import { join } from 'path'

import { assetsAI } from '../consts'
import { logger } from './logger'

/**
 * Type definition for markdown-to-ansi converter function.
 * Takes markdown text and returns ANSI-formatted string.
 */
type MarkdownConverter = (text: string) => string

/**
 * Type definition for markdown-to-ansi factory function.
 * Returns a converter function when called.
 */
type MarkdownToAnsiFactory = () => MarkdownConverter

/**
 * Type definition for the markdown-to-ansi module.
 * Can export the factory as default or as the module itself.
 */
type MarkdownToAnsiModule = {
  default?: MarkdownToAnsiFactory
} & MarkdownToAnsiFactory

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
     * When compiled to CommonJS, TypeScript transforms import() to require(),
     * which doesn't work for ES modules in Node.js 16 and 18.
     * Using Function constructor prevents TypeScript from transforming the import.
     */
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const dynamicImport = new Function('specifier', 'return import(specifier)') as (
      specifier: string
    ) => Promise<MarkdownToAnsiModule>
    const markdownToAnsiModule = await dynamicImport('markdown-to-ansi')
    const markdownToAnsiFactory: MarkdownToAnsiFactory = markdownToAnsiModule.default ?? markdownToAnsiModule
    // markdown-to-ansi exports a factory function that returns a converter function
    const converter: MarkdownConverter = markdownToAnsiFactory()
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
