import { PathTransformer } from '../types'

/**
 * Adds a prefix to the filename (before the filename, not the path)
 */
export class AddFilenamePrefixTransformer implements PathTransformer {
  constructor(private readonly prefix: string) {}

  transform(file: string): string {
    const lastSlashIndex = file.lastIndexOf('/')
    if (lastSlashIndex === -1) {
      return `${this.prefix}${file}`
    }
    const dir = file.substring(0, lastSlashIndex + 1)
    const filename = file.substring(lastSlashIndex + 1)
    return `${dir}${this.prefix}${filename}`
  }
}
