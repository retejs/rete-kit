export class AiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AiError'
  }
}

export const MISSING_BUNDLE = 'Run `rete-kit ai` first to create `.rete/ai/`.'

export const MISSING_TOOL_FOR_COMMIT = '--tool is required with --commit'
