import { ContentTransformer } from '../types'

/**
 * Adds YAML frontmatter metadata block to content
 */
export class AddYamlFrontmatterTransformer implements ContentTransformer {
  constructor(private readonly metadata: Record<string, string | boolean | number>) {}

  transform(content: string): string {
    const yamlLines = Object.entries(this.metadata)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}: ${value}`
        }
        return `${key}: ${value}`
      })
      .join('\n')

    return `---
${yamlLines}
---
${content}`
  }
}
