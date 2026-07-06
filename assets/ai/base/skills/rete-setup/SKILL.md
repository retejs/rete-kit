---
name: rete-setup
description: >-
  Bootstrap and sync gh-mirror: readonly org clones, issues, and PRs export.
  Use when mirror layout is missing, stale, or after rete-kit ai setup. Does not
  create editable working copies — use rete-clone for that.
---

# Rete setup — gh-mirror (readonly org context)

`gh-mirror/` **does not exist by default** in a fresh workspace. Create it here — never symlink to directories outside the current workspace.

Editable working copies are **not** part of this skill. If the user will modify Rete.js source, use skill **rete-clone** after mirror sync.

Org tooling lives in **`.rete/scripts/`** — copied on `rete-kit ai` emit and installed during IDE setup (`npm install`). This skill only syncs **data** into `gh-mirror/`.

## Rules (mandatory)

- **Never** symlink `gh-mirror/` to parent folders or an existing monorepo tree.
- **Never** hand-copy scripts from outside the workspace — use `.rete/scripts/` from `rete-kit ai` emit.
- `gh-mirror/` holds **data only** — readonly clones, issues/PRs export, digests.

## Layout (after sync)

| Path | Purpose |
|------|---------|
| `.rete/scripts/` | Org scripts (`clone-org`, `source-context`), `.env` |
| `gh-mirror/readonly-repositories/<repo>/` | Read-only git clones (full org) |
| `gh-mirror/issues/<repo>/issues/` | Exported issues (JSON) |
| `gh-mirror/issues/<repo>/pulls/` | Exported PRs (JSON) |

Legacy `gh-mirror/scripts/` and `gh-mirror/readonly-source-code/` (older layouts) can be removed after migrating to `.rete/scripts/` and `readonly-repositories/`.

## 1. Prepare gh-mirror data dirs

From **workspace root**:

```bash
cd .rete/scripts && cp .env.example .env   # only if .env missing
```

Scripts and `node_modules` should already exist from **rete-kit ai** emit + IDE setup. If `node_modules` is missing, run `cd .rete/scripts && npm install` first.

## GitHub token (before sync)

If `.rete/scripts/.env` has no `GITHUB_TOKEN` (and it is not in the environment), ask the user **once** before `npm run clone-org` — explain rate limits without a token. **Never** paste tokens in chat — the user writes to `.env` locally.

| Option | Action |
|--------|--------|
| **Yes** | User creates a token at [github.com/settings/tokens](https://github.com/settings/tokens), adds it to `.rete/scripts/.env`, agent verifies non-empty, then runs `clone-org`. |
| **No** | Warn that **rate limits** may slow or break sync; run `clone-org` without a token. |

## 2. Sync gh-mirror (readonly + issues + PRs)

```bash
cd .rete/scripts && npm run clone-org
```

Clones/updates all `retejs` org repos into `gh-mirror/readonly-repositories/` and exports issues + PRs.

List paths to open issues and PRs:

```bash
cd .rete/scripts && ./list-open-issues-prs.sh
```

## 3. source-context (investigation)

```bash
cd .rete/scripts && npm run source-context -- <directory> [--max-tokens N] [--page P]
```

Pair with subagent **rete-code-investigator**.

## Resync when stale

Re-run **§2** for mirror/issues.

## When to offer this

After **rete-kit ai** commit step, offer once (readonly mirror only). Explain disk space and time. If the user agrees, offer **GitHub token** setup once before sync. Offer **rete-clone** separately if the user may edit library source.
