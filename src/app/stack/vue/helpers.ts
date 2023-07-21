import fs from 'fs'
import { join } from 'path'

import { TemplateBuilder } from '../../template-builder'

export async function templateAssets<K extends string>(src: string, template: TemplateBuilder<K>) {
  const customNodePath = join(src, 'customization', 'CustomNode.vue')
  const customNodeContent = await fs.promises.readFile(customNodePath, { encoding: 'utf-8' })

  await fs.promises.writeFile(customNodePath, await template.build(customNodeContent, false))
}
