# OpenCode setup — install `.rete/` bundle

You are setting up Rete.js AI prompts for **OpenCode** in this workspace.

## Source bundle

Content is at **`.rete/`** (workspace root):

| Path | Role |
|------|------|
| `.rete/ai/skills/`, `agents/` | Staging — install into `.opencode/`, then remove `.rete/ai/` |
| `.rete/ai/AGENTS.md` | Reference template — merge into project root `AGENTS.md` |
| `.rete/scripts/` | Permanent — org tooling (`clone-org`, `source-context`) |

Use the official OpenCode doc pages below for paths and file formats.

## What to install (OpenCode)

| Source | Artifact type | Official docs |
|--------|---------------|---------------|
| `.rete/ai/AGENTS.md` (reference) | Project root `AGENTS.md` — **write/merge manually** | [Rules — AGENTS.md](https://opencode.ai/docs/rules) |
| Same reference (optional) | `opencode.json` `instructions` array — only when modularizing beyond root `AGENTS.md` | [Rules — Custom instructions](https://opencode.ai/docs/rules#custom-instructions) |
| `.rete/ai/skills/` | Native skills (on-demand via `skill` tool) | [Agent Skills](https://opencode.ai/docs/skills) |
| `.rete/ai/agents/` | Custom subagents (markdown) | [Agents](https://opencode.ai/docs/agents) |

OpenCode discovers project config from **`opencode.json`** (project root) and **`.opencode/`** directories. Plural subdirs (`skills/`, `agents/`) are preferred; singular names (`skill/`, `agent/`) work for backwards compatibility — use **`.opencode/skills/`** and **`.opencode/agents/`** for Rete installs.

OpenCode also reads Claude-compatible paths (`.claude/skills/`, `CLAUDE.md`) as fallbacks. Prefer native **`.opencode/`** paths so Rete assets are explicit.

## Install steps

Complete steps **in order**. Finish each **READ** step before the install step that depends on it.

### 1. READ — AGENTS.md and custom instructions

Open and read:

https://opencode.ai/docs/rules

Apply from the page: project root `AGENTS.md`, optional global `~/.config/opencode/AGENTS.md`, `opencode.json` `instructions` array (paths, globs, remote URLs), precedence vs `CLAUDE.md`, and `/init` behavior.

### 2. READ — Agent Skills

Open and read:

https://opencode.ai/docs/skills

Apply from the page: `.opencode/skills/<name>/SKILL.md` layout, required `name` and `description` frontmatter, on-demand loading via the native `skill` tool, permission patterns in `opencode.json`.

### 3. READ — Agents and subagents

Open and read:

https://opencode.ai/docs/agents

Apply from the page: markdown agents in `.opencode/agents/`, required `description` and `mode`, `@mention` and Task-tool invocation, `permission` blocks (preferred over legacy `tools`).

### 4. READ — Config (optional)

Open and read:

https://opencode.ai/docs/config

Apply from the page: `opencode.json` location and merge order, `.opencode/` directory precedence, when to add project-level `permission` overrides.

### 5. Install org scripts

```bash
cd .rete/scripts && npm install
cp .env.example .env   # only if .env missing
```

### 6. Install `AGENTS.md`

After step 1.

- Read `.rete/ai/AGENTS.md` and the project `AGENTS.md` if it exists.
- **No project `AGENTS.md`:** create it at the **project root** per the official docs, following the reference sections: Documentation, Rete tooling, Conventions.
- **Project `AGENTS.md` exists:** keep the user's structure and wording; add only missing reference content (doc links, Rete tooling block, conventions). Do not duplicate tables or bullets already present.
- **Adapt the Rete tooling block for OpenCode:**
  - **Skills** (`rete-*`): installed under `.opencode/skills/`; loaded on demand via the native `skill` tool or matched from each skill's `description`.
  - **Subagents** (`rete-*`): installed as `.opencode/agents/<name>.md` with `mode: subagent`; invoke with `@<name>` or let primary agents delegate via the Task tool when the task matches `description`.
  - Single symbol or file → direct search (`grep` / `glob` / `read`), not a subagent.
- Do **not** overwrite unrelated sections the user already has.
- Do **not** shell-copy the reference file.
- **Optional:** if the project already uses `opencode.json` `instructions` for modular rules, add only missing Rete references there — do **not** duplicate content already in `AGENTS.md`.

### 7. Install skills

After step 2.

- Install each directory in `.rete/ai/skills/` under `.opencode/skills/<skill-name>/` per the Skills docs.
- Keep `SKILL.md` and any reference files alongside it (e.g. `rete-plugin/architecture.md`).
- Preserve frontmatter (`name`, `description`); `name` must match the directory name.

### 8. Install subagents

After step 3.

For each file in `.rete/ai/agents/`, write `.opencode/agents/<name>.md` (filename stem = agent name per OpenCode docs):

1. Read the staged `.md` file (YAML frontmatter + body).
2. Map frontmatter to OpenCode format (per agent — `readonly: true` is not one-size-fits-all):

| Staged agent | `.opencode/agents/*.md` |
|--------------|-------------------------|
| All | `description` (required), `mode: subagent` |
| **`rete-package-reviewer`** | `permission:` with `edit: deny` and `bash: deny` |
| **`rete-code-investigator`** | `permission:` with `edit: deny`; `bash` allowlist for `.rete/scripts` only, e.g. `cd .rete/scripts && npm run source-context*` allow, other commands deny |

3. Drop staging-only fields OpenCode does not use (`name`, `readonly`) after mapping.
4. Preserve any other valid OpenCode frontmatter the staged file already defines (`model`, `temperature`, `permission` overrides).

Example (`rete-code-investigator`):

```markdown
---
description: Code investigation specialist. Uses token-aware source pagination...
mode: subagent
permission:
  edit: deny
  bash:
    "*": deny
    "cd .rete/scripts && npm run source-context*": allow
---

You are a code investigation specialist focused on evidence-based understanding of source code.
...
```

Example (`rete-package-reviewer`):

```markdown
---
description: Review PRs and diffs for any Rete.js org package...
mode: subagent
permission:
  edit: deny
  bash: deny
---
```

### 9. Confirm discovery

- List `.opencode/skills/` — every staged skill directory is present with valid `SKILL.md`.
- List `.opencode/agents/` — every staged agent has a matching `.md` with `description`, `mode: subagent`, and body prompt.
- Start or restart OpenCode in this project; confirm skills appear in the `skill` tool listing and subagents appear in `@` autocomplete.
- Confirm project root `AGENTS.md` includes the adapted Rete tooling block.

## Done when

- Steps 1–4 completed; steps 5–9 completed
- `.rete/scripts/` has `node_modules` and is ready to run
- Project `AGENTS.md` includes required Rete.js reference content (merged, OpenCode-adapted — not blindly copied)
- Skills are installed under `.opencode/skills/` per the official docs
- Subagents are installed under `.opencode/agents/` per the official docs
- Daily work does not depend on files remaining only under `.rete/ai/`

Then run:

```bash
rete-kit ai --tool opencode --commit
```

**Keep** `.rete/scripts/` after commit. Optional `gh-mirror/` and editable clones are in `commit.md` (steps 7–8).
