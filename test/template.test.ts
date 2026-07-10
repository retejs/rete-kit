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

  it('handles CRLF line endings with nested blocks', () => {
    const builder = new TemplateBuilder(['selectable', 'reroute', 'dataflow'])
    const code = builder.build(
      '/* [selectable]\r\n'
      + 'const selector = 1;\r\n'
      + '/* [reroute]\r\n'
      + 'const reroute = 1;\r\n'
      + '[/reroute] */\r\n'
      + '[/selectable] */\r\n'
      + '/* [dataflow] const process = 1 [/dataflow] */',
      false
    )

    expect(code).toContain('const selector = 1;')
    expect(code).toContain('const reroute = 1;')
    expect(code).toContain('const process = 1')
    expect(code).not.toContain('[/selectable]')
  })
})
