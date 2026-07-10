import { describe, expect, it } from '@jest/globals'

import { React, resolveJobs } from '../src/app/features'
import { TemplateBuilder } from '../src/app/template-builder'

describe('Template jobs', () => {
  const sources = ['default', 'scopes']
  const react = new React(18, 'react-vite', false)
  const optional = [react]

  it('maps array features to all sources', () => {
    const jobs = resolveJobs(sources, optional, 'react-vite', { features: ['React render'] })

    expect(jobs.map(job => ({ name: job.name, from: job.from }))).toEqual([
      { name: 'default', from: 'default' },
      { name: 'scopes', from: 'scopes' }
    ])
    expect(jobs.every(job => job.features[0] === react)).toBe(true)
  })

  it('maps object form to source jobs plus extras', () => {
    const jobs = resolveJobs(sources, optional, 'react-vite', {
      features: {
        base: ['React render'],
        minimap: { from: 'default', features: ['React render'] }
      }
    })

    expect(jobs.map(job => ({ name: job.name, from: job.from }))).toEqual([
      { name: 'default', from: 'default' },
      { name: 'scopes', from: 'scopes' },
      { name: 'minimap', from: 'default' }
    ])
  })

  it('uses selected features when input is omitted', () => {
    const jobs = resolveJobs(sources, optional, 'react-vite', { selected: [react] })

    expect(jobs).toHaveLength(2)
    expect(jobs.every(job => job.features[0] === react)).toBe(true)
  })
})

describe('Entry script', () => {
  it('keeps base entry script without extras', async () => {
    const code = await new TemplateBuilder([]).getEntryScript()

    expect(code).toContain("import { createEditor as createDefaultEditor } from './default'")
    expect(code).toContain("'scopes': createScopesEditor")
    expect(code).not.toContain('{{virtual-imports}}')
    expect(code).not.toContain('{{virtual-factory}}')
    expect(code).not.toContain('minimap')
  })

  it('fills placeholders with dynamic template snippets', async () => {
    const code = await new TemplateBuilder([]).getEntryScript(['minimap', 'my-feature'])

    expect(code).toContain("import { createEditor as createMinimapEditor } from './minimap'")
    expect(code).toContain("import { createEditor as createMyFeatureEditor } from './my-feature'")
    expect(code).toContain("'minimap': createMinimapEditor")
    expect(code).toContain("'my-feature': createMyFeatureEditor")
    expect(code).not.toContain('{{virtual-imports}}')
    expect(code).not.toContain('{{virtual-factory}}')
  })
})
