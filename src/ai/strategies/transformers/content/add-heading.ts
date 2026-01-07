import { F } from '../../types'
import { SingleFileTransformer } from '../../single-file'

/**
 * Transformer that adds a heading with optional prefix to content
 */
export class PrefixedHeadingTransformer implements SingleFileTransformer {
  constructor(private readonly prefix?: string) {}

  transform(content: string, instruction: F): string {
    // Extract filename from path (handle both relative and absolute paths)
    const name = instruction.file.split('/').pop() || instruction.file
    const heading = this.prefix ? `## ${this.prefix} ${name}` : `## ${name}`
    return `${heading}\n\n${content}`
  }
}
