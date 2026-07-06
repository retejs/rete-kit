import { AiError, MISSING_BUNDLE } from './errors'
import { bundleExists } from './paths'

export function requireBundle(cwd: string): void {
  if (!bundleExists(cwd)) {
    throw new AiError(MISSING_BUNDLE)
  }
}
