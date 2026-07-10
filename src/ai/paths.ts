import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

import { assetsAI } from '../consts'

export const BUNDLE_MARKER = '.bundle'

export function workspaceReteDir(cwd: string): string {
  return join(cwd, '.rete')
}

export function workspaceReteBackupDir(cwd: string): string {
  return join(cwd, '.tmp', 'rete-kit-ai')
}

export function workspaceBundleDir(cwd: string): string {
  return join(workspaceReteDir(cwd), 'ai')
}

export function workspaceScriptsDir(cwd: string): string {
  return join(workspaceReteDir(cwd), 'scripts')
}

export function bundleMarkerPath(cwd: string): string {
  return join(workspaceBundleDir(cwd), BUNDLE_MARKER)
}

export function baseAssetsDir(): string {
  return join(assetsAI, 'base')
}

export function introPath(): string {
  return join(assetsAI, 'intro.md')
}

export function toolsDir(): string {
  return join(assetsAI, 'tools')
}

export function toolPromptPath(tool: string, kind: 'setup' | 'commit'): string {
  return join(toolsDir(), tool, `${kind}.md`)
}

export function bundleExists(cwd: string): boolean {
  return existsSync(bundleMarkerPath(cwd))
}

export function readTextFile(path: string): string {
  return readFileSync(path, 'utf-8').trim()
}
