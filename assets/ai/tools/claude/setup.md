# Claude Code setup — install `.rete/` bundle

You are setting up Rete.js AI prompts for **Claude Code** in this workspace.

## Source bundle

Content is at **`.rete/`** (workspace root):

| Path | Role |
|------|------|
| `.rete/ai/skills/`, `agents/` | Staging — install into `.claude/`, then remove `.rete/ai/` |
| `.rete/ai/AGENTS.md` | Reference template — merge into project root `AGENTS.md` |
| `.rete/scripts/` | Permanent — org tooling (`clone-org`, `source-context`) |

Use the official Claude Code doc pages below for paths and file formats.

## What to install (Claude Code)

| Source | Artifact type | Official docs |
|--------|---------------|---------------|
| `.rete/ai/AGENTS.md` (reference) | Project `AGENTS.md` — **write/merge manually** (cross-tool) | [Memory — AGENTS.md](https://code.claude.com/docs/en/memory#agentsmd) |
| Same reference | Project `CLAUDE.md` — **write/merge manually**; import `@AGENTS.md` when both exist | [Memory — CLAUDE.md](https://code.claude.com/docs/en/memory#claudemd-files) |
| `.rete/ai/skills/` | Project skills | [Skills](https://code.claude.com/docs/en/skills) |
| `.rete/ai/agents/` | Custom subagents | [Subagents](https://code.claude.com/docs/en/sub-agents) |

Claude Code reads **`CLAUDE.md`**, not `AGENTS.md` directly. Prefer **`AGENTS.md`** for Rete reference content (shared with other agents) and a thin **`CLAUDE.md`** that imports it with `@AGENTS.md`. Legacy setups may have only root **`CLAUDE.md`** — merge there instead of splitting.

## Install steps

Complete steps **in order**. Finish each **READ** step before the install step that depends on it.

### 1. READ — CLAUDE.md and AGENTS.md

Open and read:

https://code.claude.com/docs/en/memory

Apply from the page:

- Project `CLAUDE.md` at `./CLAUDE.md` or `./.claude/CLAUDE.md`
- `@AGENTS.md` import syntax (preferred over symlinks on Windows)
- How files load at session start

### 2. READ — Skills

Open and read:

https://code.claude.com/docs/en/skills

Apply from the page: project skill layout (`.claude/skills/<name>/SKILL.md`), `SKILL.md` frontmatter, discovery, `/skill-name` invocation.

### 3. READ — Subagents

Open and read:

https://code.claude.com/docs/en/sub-agents

Apply from the page: subagent file location (`.claude/agents/`), frontmatter fields (`name`, `description`, `tools`, `model`), routing via descriptions.

### 4. Install org scripts

```bash
cd .rete/scripts && npm install
cp .env.example .env   # only if .env missing
```

### 5. Install project instructions

After step 1.

Read `.rete/ai/AGENTS.md`. Inspect existing `AGENTS.md`, `CLAUDE.md`, and `.claude/CLAUDE.md` if present.

**Choose one path** (do not duplicate Rete content across files):

| Situation | Action |
|-----------|--------|
| No `AGENTS.md`, no `CLAUDE.md` | Create `AGENTS.md` with reference sections (Documentation, Rete tooling, Conventions). Create `CLAUDE.md` at project root with `@AGENTS.md` as the first line. |
| `AGENTS.md` exists, no `CLAUDE.md` | Merge missing reference content into `AGENTS.md`. Create `CLAUDE.md` with `@AGENTS.md` (plus any Claude-specific notes below the import). |
| Both exist | Merge missing reference content into `AGENTS.md` only. Ensure `CLAUDE.md` imports `@AGENTS.md` if not already; do not duplicate Rete tables in `CLAUDE.md`. |
| **`CLAUDE.md` only** | Merge missing reference content directly into `CLAUDE.md`. Do not create `AGENTS.md` unless the user already uses it for other tools. |

For all paths:

- Keep the user's structure and wording; add only missing reference content.
- Do **not** overwrite unrelated sections the user already has.
- Do **not** shell-copy the reference file.
- Prefer `@AGENTS.md` import over `ln -s AGENTS.md CLAUDE.md` (Windows-friendly).

### 6. Install skills

After step 2.

- Install each directory in `.rete/ai/skills/` under `.claude/skills/<skill-name>/` per the Skills docs.
- Keep `SKILL.md` and any reference files alongside it.
- Preserve frontmatter (`name`, `description`, etc.).

### 7. Install subagents

After step 3.

For each file in `.rete/ai/agents/`, install as `.claude/agents/<name>.md` (`<name>` = filename stem). Rewrite frontmatter per [Subagents](https://code.claude.com/docs/en/sub-agents):

| Source (Rete) | Target (`.claude/agents/<name>.md`) |
|---------------|-------------------------------------|
| `name` | `name` |
| `description` | `description` |
| `readonly: true` on **`rete-package-reviewer`** | `tools: Read, Grep, Glob` (read-only review) |
| `readonly: true` on **`rete-code-investigator`** | `tools: Read, Grep, Glob, Bash` — investigator runs `npm run source-context` from `.rete/scripts` |

Copy the Markdown body unchanged. Drop `readonly` after mapping. Merge without clobbering unrelated agents.

### 8. Confirm discovery

- List `.claude/skills/` and `.claude/agents/` — every staged skill and agent is present.
- In Claude Code, run `/skills` (or ask Claude to list available skills) and confirm Rete skills appear.
- If `.claude/skills/` or `.claude/agents/` did not exist when the session started, **restart Claude Code** so new directories are watched.
- Optionally run `/doctor` to catch duplicate subagent `name` values.

## Done when

- Steps 1–3 completed; steps 4–8 completed
- `.rete/scripts/` has `node_modules` and is ready to run
- Rete.js reference content is merged into `AGENTS.md` and/or `CLAUDE.md` per step 5 (not blindly copied)
- Skills and subagents are installed under `.claude/skills/` and `.claude/agents/`
- Daily work does not depend on files remaining only under `.rete/ai/`

Then run:

```bash
rete-kit ai --tool claude --commit
```

**Keep** `.rete/scripts/` after commit. Optional `gh-mirror/` and editable clones are in `commit.md` (steps 7–8).
