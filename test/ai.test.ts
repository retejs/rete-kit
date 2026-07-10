import { afterAll, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

import { runCommit } from '../src/ai/commit'
import { emitBundle } from '../src/ai/emit'
import { AiError } from '../src/ai/errors'
import { logger } from '../src/ai/logger'
import { bundleMarkerPath } from '../src/ai/paths'
import { getToolIds } from '../src/ai/registry'
import { runSetup } from '../src/ai/setup'

describe('ai command', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rete-kit-ai-'))

  const silenceConsoleLog = (): void => {
    /* silence console.log */
  }

  afterAll(() => {
    rmSync(cwd, { recursive: true, force: true })
  })

  it('lists cursor in tool registry', () => {
    expect(getToolIds()).toContain('cursor')
  })

  it('lists supported tools in registry', () => {
    const ids = getToolIds()
    const supported = [
      'antigravity',
      'claude',
      'codex',
      'cursor',
      'devin-desktop',
      'github',
      'kiro',
      'opencode',
      'pi'
    ]

    expect(ids).toEqual(expect.arrayContaining(supported))
    expect(ids).not.toContain('windsurf')
    expect(ids).not.toContain('continue')
    expect(ids).not.toContain('amazonq')
  })

  it('emits staging bundle with AGENTS.md', async () => {
    await emitBundle(cwd)

    const agents = readFileSync(join(cwd, '.rete/ai/skills/rete-setup/SKILL.md'), 'utf-8')
    const agentsMd = readFileSync(join(cwd, '.rete/ai/AGENTS.md'), 'utf-8')
    const pkg = readFileSync(join(cwd, '.rete/scripts/package.json'), 'utf-8')
    const marker = readFileSync(bundleMarkerPath(cwd), 'utf-8')

    expect(agents).toContain('gh-mirror')
    expect(agentsMd).toContain('Rete tooling')
    expect(pkg).toContain('clone-org')
    expect(marker).toContain('rete-kit')
  })

  describe('with emitted bundle', () => {
    beforeEach(async () => {
      await emitBundle(cwd)
    })

    it('re-emits by recreating .rete', async () => {
      const skillPath = join(cwd, '.rete/ai/skills/rete-setup/SKILL.md')
      const warn = jest.spyOn(logger, 'warn').mockImplementation(silenceConsoleLog)

      writeFileSync(skillPath, 'stale local edit')

      await emitBundle(cwd)

      const content = readFileSync(skillPath, 'utf-8')

      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Recreating `.rete/`'))
      expect(content).toContain('gh-mirror')
      expect(content).not.toBe('stale local edit')
      warn.mockRestore()
    })

    it('prints setup prompt when bundle exists', () => {
      const log = jest.spyOn(console, 'log').mockImplementation(silenceConsoleLog)

      runSetup(cwd, 'cursor')

      expect(log.mock.calls.some(call => String(call[0]).includes('Cursor setup'))).toBe(true)
      log.mockRestore()
    })

    it('prints commit prompt when bundle exists', () => {
      const log = jest.spyOn(console, 'log').mockImplementation(silenceConsoleLog)

      runCommit(cwd, 'cursor')

      expect(log.mock.calls.some(call => String(call[0]).includes('Cursor commit'))).toBe(true)
      log.mockRestore()
    })
  })

  it('preserves .rete/scripts/.env on re-emit', async () => {
    const envPath = join(cwd, '.rete/scripts/.env')

    mkdirSync(join(cwd, '.rete/scripts'), { recursive: true })
    writeFileSync(envPath, 'GITHUB_TOKEN=keep-me\n')

    await emitBundle(cwd)

    expect(readFileSync(envPath, 'utf-8')).toBe('GITHUB_TOKEN=keep-me\n')
    expect(existsSync(join(cwd, '.tmp', 'rete-kit-ai'))).toBe(false)
  })

  it('adds .rete/ to .gitignore when present', async () => {
    const project = mkdtempSync(join(tmpdir(), 'rete-kit-ai-gitignore-'))
    const gitignorePath = join(project, '.gitignore')

    writeFileSync(gitignorePath, 'node_modules\n')

    try {
      await emitBundle(project)

      const gitignore = readFileSync(gitignorePath, 'utf-8')

      expect(gitignore).toContain('.rete/')
      expect(gitignore).toContain('rete-kit ai local tooling')
    } finally {
      rmSync(project, { recursive: true, force: true })
    }
  })

  it('adds .rete/ to empty .gitignore without a leading blank line', async () => {
    const project = mkdtempSync(join(tmpdir(), 'rete-kit-ai-gitignore-empty-'))
    const gitignorePath = join(project, '.gitignore')

    writeFileSync(gitignorePath, '')

    try {
      await emitBundle(project)

      const gitignore = readFileSync(gitignorePath, 'utf-8')

      expect(gitignore).toBe('# rete-kit ai local tooling\n.rete/\n')
    } finally {
      rmSync(project, { recursive: true, force: true })
    }
  })

  it('setup fails without bundle', () => {
    const empty = mkdtempSync(join(tmpdir(), 'rete-kit-ai-empty-'))

    try {
      expect(() => runSetup(empty, 'cursor')).toThrow(AiError)
    } finally {
      rmSync(empty, { recursive: true, force: true })
    }
  })
})
