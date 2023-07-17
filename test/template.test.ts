import { describe, expect, it } from '@jest/globals'

import { TemplateBuilder } from '../src/app/template-builder'

describe('Template builder', () => {
  const template = new TemplateBuilder(['add', 'line'])

  it('single line', async () => {
    const code = await template.build(`import { /* [add] A, [/add] */ B, /* [skip] C [/skip] */} from 'pkg';`)

    expect(code).toEqual(`import { A, B } from 'pkg';\n`)
  })

  it('multiline', async () => {
    const code = await template.build(`
      import { A } from 'pkg';

      /* [skip] const a = new A() [/skip] */
      /* [line] const b = new A() [/line] */
    `)

    expect(code).toEqual(`\
import { A } from 'pkg';

const b = new A();\n`)
  })
})
