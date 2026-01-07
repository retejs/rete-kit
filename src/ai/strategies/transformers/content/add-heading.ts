import { F } from '../../types'
import { ContentTransformer } from '../types'

/**
 * Transformer that adds a first-level heading with optional prefix
 * Can be used for both single-file and multi-file strategies
 */
export class PrefixedHeadingTransformer implements ContentTransformer {
  constructor(
    private readonly instruction: F,
    private readonly prefix?: string
  ) {}

  transform(content: string): string {
    // Add first-level heading with prefix and instruction title
    const title = this.instruction.title || this.instruction.file.split('/').pop() || this.instruction.file
    const heading = this.prefix ? `# ${this.prefix} ${title}` : `# ${title}`
    
    return `${heading}\n\n${content}`
  }
}
