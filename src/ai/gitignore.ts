import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const GITIGNORE_ENTRY = '.rete/'
const GITIGNORE_COMMENT = '# rete-kit ai local tooling'

function gitignoreAlreadyHasRete(content: string): boolean {
  return content.split('\n').some(line => {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      return false
    }

    const pattern = trimmed.replace(/\/$/, '')

    return pattern === '.rete' || pattern === '/.rete' || pattern.endsWith('/.rete')
  })
}

function buildGitignoreBlock(content: string): string {
  if (content.length === 0) {
    return `${GITIGNORE_COMMENT}\n${GITIGNORE_ENTRY}\n`
  }

  const separator = content.endsWith('\n')
    ? ''
    : '\n'

  return `${separator}\n${GITIGNORE_COMMENT}\n${GITIGNORE_ENTRY}\n`
}

export function ensureReteInGitignore(cwd: string): boolean {
  const gitignorePath = join(cwd, '.gitignore')

  if (!existsSync(gitignorePath)) {
    return false
  }

  const content = readFileSync(gitignorePath, 'utf-8')

  if (gitignoreAlreadyHasRete(content)) {
    return false
  }

  const block = buildGitignoreBlock(content)

  writeFileSync(gitignorePath, content + block, 'utf-8')

  return true
}
