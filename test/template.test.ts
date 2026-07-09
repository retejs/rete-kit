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

  it('builds history and comments integration', async () => {
    const builder = new TemplateBuilder([
      'history',
      'comments',
      'import-area-extensions',
      'selectable'
    ])
    const template = await builder.load('default')
    const code = await builder.build(template, false)

    expect(code).toContain('HistoryPresets.comments.setup({ comment })')
    expect(code).toContain('CommentExtensions.selectable(comment, selector, accumulating)')
    expect(code).toContain('HistoryActions<Schemes> | CommentHistoryActions')
    expect(code).toContain("comment.addInline('Inline comment — try Ctrl+Z after edit/delete'")
  })

  it('uses classic history actions without comments', async () => {
    const builder = new TemplateBuilder(['history'])
    const template = await builder.load('default')
    const code = await builder.build(template, false)

    expect(code).toContain('HistoryActions<Schemes>')
    expect(code).not.toContain('CommentHistoryActions')
    expect(code).not.toContain('HistoryPresets.comments.setup')
    expect(code).not.toContain('CommentPlugin')
    expect(code).not.toContain('CommentExtensions')
  })

  it('builds comments without history', async () => {
    const builder = new TemplateBuilder(['comments', 'sizes', 'import-area-extensions', 'selectable'])
    const template = await builder.load('default')
    const code = await builder.build(template, false)

    expect(code).toContain('CommentPlugin')
    expect(code).toContain('comment.addFrame')
    expect(code).toContain("comment.addInline('Inline comment',")
    expect(code).not.toContain('Ctrl+Z')
    expect(code).toContain('CommentExtensions.selectable(comment, selector, accumulating)')
    expect(code).not.toContain('HistoryPlugin')
    expect(code).not.toContain('HistoryPresets')
    expect(code).not.toContain('HistoryExtensions.keyboard')
  })

  it('keeps comment selectable without history preset integration', async () => {
    const builder = new TemplateBuilder(['comments', 'selectable', 'import-area-extensions', 'sizes'])
    const template = await builder.load('default')
    const code = await builder.build(template, false)

    expect(code).toContain('CommentExtensions.selectable(comment, selector, accumulating)')
    expect(code).not.toContain('HistoryPresets.comments.setup')
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
