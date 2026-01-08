import { PathTransformer } from '../types'

/**
 * Adds a prefix to the file path (directory prefix)
 */
export class AddPathPrefixTransformer implements PathTransformer {
  constructor(private readonly prefix: string) {}

  transform(file: string): string {
    const normalizedPrefix = this.prefix.endsWith('/')
      ? this.prefix
      : `${this.prefix}/`

    return `${normalizedPrefix}${file}`
  }
}
