import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import { join } from 'path'
import copyDir from 'recursive-copy'

import { assetsScripts } from '../consts'
import { AiError } from './errors'
import { ensureReteInGitignore } from './gitignore'
import { logger } from './logger'
import {
  baseAssetsDir,
  bundleMarkerPath,
  introPath,
  readTextFile,
  workspaceBundleDir,
  workspaceReteBackupDir,
  workspaceReteDir,
  workspaceScriptsDir
} from './paths'

const EMIT_READY_MESSAGE
  = 'Staging at `.rete/ai/` (skills, agents, AGENTS.md) and `.rete/scripts/`.'

const RETE_RECREATE_WARNING = [
  'Recreating `.rete/` from rete-kit.',
  '`.rete/` is local tooling — do not commit it; run `rete-kit ai` again anytime to refresh.',
  '`.rete/scripts/.env` is preserved when present.'
].join(' ')

function copyErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : String(error)
}

async function copyDirOrThrow(from: string, to: string): Promise<void> {
  try {
    await copyDir(from, to, { overwrite: true, dot: true })
  } catch (error: unknown) {
    throw new AiError(`Failed to copy ${from} → ${to}: ${copyErrorMessage(error)}`)
  }
}

async function backupReteDir(cwd: string): Promise<void> {
  const reteDir = workspaceReteDir(cwd)

  if (!existsSync(reteDir)) {
    return
  }

  const backupPath = join(workspaceReteBackupDir(cwd), '.rete')

  rmSync(workspaceReteBackupDir(cwd), { recursive: true, force: true })
  mkdirSync(workspaceReteBackupDir(cwd), { recursive: true })
  await copyDirOrThrow(reteDir, backupPath)
}

function removeReteDir(cwd: string): void {
  const reteDir = workspaceReteDir(cwd)

  if (!existsSync(reteDir)) {
    return
  }

  logger.warn(RETE_RECREATE_WARNING)
  rmSync(reteDir, { recursive: true, force: true })
}

function restoreReteEnv(cwd: string): void {
  const envBackup = join(workspaceReteBackupDir(cwd), '.rete', 'scripts', '.env')
  const envTarget = join(workspaceScriptsDir(cwd), '.env')

  if (existsSync(envBackup)) {
    mkdirSync(workspaceScriptsDir(cwd), { recursive: true })
    copyFileSync(envBackup, envTarget)
  }

  rmSync(workspaceReteBackupDir(cwd), { recursive: true, force: true })
}

async function copyStagingBundle(cwd: string, bundleDir: string): Promise<void> {
  await copyDirOrThrow(baseAssetsDir(), bundleDir)

  writeFileSync(bundleMarkerPath(cwd), 'rete-kit ai bundle\n', 'utf-8')
}

async function copyOrgScripts(scriptsDir: string): Promise<void> {
  await copyDirOrThrow(assetsScripts, scriptsDir)
}

function printIntro(): void {
  console.log('')
  console.log(readTextFile(introPath()))
  console.log('')
}

function buildEmitReadyMessage(gitignoreUpdated: boolean): string {
  if (!gitignoreUpdated) {
    return EMIT_READY_MESSAGE
  }

  return `${EMIT_READY_MESSAGE} Added \`.rete/\` to \`.gitignore\`.`
}

export async function emitBundle(cwd: string): Promise<void> {
  await backupReteDir(cwd)
  removeReteDir(cwd)

  const bundleDir = workspaceBundleDir(cwd)
  const scriptsDir = workspaceScriptsDir(cwd)

  mkdirSync(bundleDir, { recursive: true })
  mkdirSync(scriptsDir, { recursive: true })

  await copyStagingBundle(cwd, bundleDir)
  await copyOrgScripts(scriptsDir)
  restoreReteEnv(cwd)

  logger.ready(buildEmitReadyMessage(ensureReteInGitignore(cwd)))
  printIntro()
}
