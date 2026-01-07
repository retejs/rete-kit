import { readFileSync } from 'fs'
import { join } from 'path'
// @ts-ignore - markdown-to-ansi is ESM but we're using it in CJS context
import markdownToAnsiFactory from 'markdown-to-ansi'

import { assetsAI } from '../consts'

/**
 * Loads and formats the guidance message from markdown file for terminal display.
 * Converts markdown formatting (bold, italic, code, etc.) to ANSI escape codes.
 * 
 * @returns Formatted guidance text with ANSI codes, or empty string if file doesn't exist
 */
function getGuidance(): string {
  const guidancePath = join(assetsAI, 'guidance.md')

  try {
    const guidanceTemplate = readFileSync(guidancePath, 'utf-8')

    // markdown-to-ansi exports a factory function that returns a converter function
    const converter = markdownToAnsiFactory()
    // Convert markdown to ANSI-formatted terminal text (supports bold, italic, code, etc.)
    return converter(guidanceTemplate).trim()
  } catch (error) {
    // Fallback if guidance file doesn't exist or conversion fails
    // Silently return empty string - guidance is optional
    return ''
  }
}

/**
 * Error class that stores guidance and error messages separately.
 * Used for missing parameter errors to provide helpful guidance to users and AI assistants.
 */
export class GuidanceError extends Error {
  public readonly guidance: string

  constructor(message: string) {
    super(message)
    this.name = 'GuidanceError'
    this.guidance = getGuidance()
  }
}
