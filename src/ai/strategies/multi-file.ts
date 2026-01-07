import { InstructionStrategy, F } from './types'
import { PathTransformer, ContentTransformer } from './transformers'

/**
 * Strategy for keeping instructions as separate files
 */
export class MultiFileStrategy implements InstructionStrategy {
  constructor(
    private readonly pathTransformerFactory?: (instruction: F) => PathTransformer[],
    private readonly contentTransformerFactory?: (instruction: F) => ContentTransformer[]
  ) {}

  transform(instructions: F[]): F[] {
    return instructions.map(instruction => {
      const pathTransformers = this.pathTransformerFactory ? this.pathTransformerFactory(instruction) : []
      const contentTransformers = this.contentTransformerFactory ? this.contentTransformerFactory(instruction) : []

      let file = instruction.file
      let content = instruction.content

      // Apply path transformers in sequence
      for (const transformer of pathTransformers) {
        file = transformer.transform(file)
      }

      // Apply content transformers in sequence
      for (const transformer of contentTransformers) {
        content = transformer.transform(content)
      }

      return { file, content, contextId: instruction.contextId, title: instruction.title }
    })
  }
}
