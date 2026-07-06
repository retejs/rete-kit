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

export function ensureReteInGitignore(cwd: string): boolean {
  const gitignorePath = join(cwd, '.gitignore')

  if (!existsSync(gitignorePath)) {
    return false
  }

  const content = readFileSync(gitignorePath, 'utf-8')

  if (gitignoreAlreadyHasRete(content)) {
    return false
  }

  const separator
    = content.length === 0 || content.endsWith('\n')
      ? ''
      : '\n'
  const block = `${separator}\n${GITIGNORE_COMMENT}\n${GITIGNORE_ENTRY}\n`

  writeFileSync(gitignorePath, content + block, 'utf-8')

  return true
}
