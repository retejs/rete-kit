---
name: rete-clone
description: >-
  Optional editable copies of retejs repos. Inspect the workspace, ask whether
  the user will modify Rete.js source, propose a target directory, clone only
  what is needed. Org scripts live in `.rete/scripts/` from rete-kit ai setup.
---

# Rete clone — editable working copies (optional)

Org scripts are in **`.rete/scripts/`** (from `rete-kit ai` emit + setup). Editable working copies are a **separate, optional** step.

## Rules

- **Never** symlink from `gh-mirror/readonly-repositories/` into a working directory.
- **Never** assume a fixed path like `./repositories/` — the target directory is chosen per workspace.
- Clones come **only** from `git clone https://github.com/retejs/<repo>.git`.
- **Inspect the working directory first** before proposing a path.

## Agent workflow

1. **Inspect** the workspace (`ls`, existing git repos, monorepo layout, free space).
2. **Ask once**: *Will you modify Rete.js library source code in this project?*
   - If **no** → readonly `gh-mirror/readonly-repositories` is enough; stop.
3. If **yes**:
   - Clarify which **libraries/plugins** (task context, or list repos under `gh-mirror/readonly-repositories/` after mirror bootstrap).
   - **Do not clone** `rete-kit`, `rete-qa`, or `rete-cli` for normal use — they are npm CLIs (`npx` / global install). Clone them only if the user will **contribute to those tools**.
   - **Propose a target directory** from what you see (e.g. `./repositories/`, `./libs/`, `./vendor/retejs/`) and **confirm with the user**.
   - `mkdir -p <target>` if needed; clone each repo to `<target>/<repo>/`.
4. **Record the chosen path** in your summary so later tasks use the same root (see project `AGENTS.md` — Workspace layout).

## Resync

`git pull` in existing clones; clone only missing repos.
