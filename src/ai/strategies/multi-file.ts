import { InstructionStrategy, F } from './types'
import { PathTransformer, ContentTransformer } from './transformers'

/**
 * Strategy for keeping instructions as separate files
 */
export class MultiFileStrategy implements InstructionStrategy {
  constructor(
    private readonly pathTransformers: PathTransformer[] = [],
    private readonly contentTransformers: ContentTransformer[] = []
  ) {}

  transform(instructions: F[]): F[] {
    return instructions.map(instruction => {
      let file = instruction.file
      let content = instruction.content

      // Apply path transformers in sequence
      for (const transformer of this.pathTransformers) {
        file = transformer.transform(file)
      }

      // Apply content transformers in sequence
      for (const transformer of this.contentTransformers) {
        content = transformer.transform(content)
      }

      return { file, content }
    })
  }
}
