import { PathTransformer } from '../types'

/**
 * Replaces the file extension with a new one
 */
export class ReplaceExtensionTransformer implements PathTransformer {
  constructor(private readonly newExtension: string) {}

  transform(file: string): string {
    return file.replace(/\.[^.]+$/, this.newExtension.startsWith('.') ? this.newExtension : `.${this.newExtension}`)
  }
}
