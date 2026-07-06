# Codex setup — install `.rete/` bundle

You are setting up Rete.js AI prompts for **OpenAI Codex** (CLI, IDE extension, or app) in this workspace.

## Source bundle

Content is at **`.rete/`** (workspace root):

| Path | Role |
|------|------|
| `.rete/ai/skills/`, `agents/` | Staging — install into the repo, then remove `.rete/ai/` |
| `.rete/ai/AGENTS.md` | Reference template — merge into project root `AGENTS.md` |
| `.rete/scripts/` | Permanent — org tooling (`clone-org`, `source-context`) |

Use the official Codex doc pages below for paths and file formats.

## What to install (Codex)

| Source | Artifact type | Official docs |
|--------|---------------|---------------|
| `.rete/ai/AGENTS.md` (reference) | Project root `AGENTS.md` — **write/merge manually** | [Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md) |
| `.rete/ai/skills/` | Repo skills | [Agent Skills](https://developers.openai.com/codex/skills) |
| `.rete/ai/agents/` | Custom subagents (TOML) | [Subagents](https://developers.openai.com/codex/subagents) |

Codex also supports global guidance in `~/.codex/AGENTS.md`, project overrides in nested `AGENTS.md` / `AGENTS.override.md`, and layered config in `.codex/config.toml`. The Rete bundle installs **project-scoped** skills and subagents only.

**Legacy Codex setups** used a single merged root `AGENTS.md` — keep one project `AGENTS.md` at the repository root (no separate `CLAUDE.md`).

## Install steps

Complete steps **in order**. Finish each **READ** step before the install step that depends on it.

### 1. READ — AGENTS.md

Open and read:

https://developers.openai.com/codex/guides/agents-md

Apply from the page: global vs project discovery, nested overrides, merge order (root → cwd), `project_doc_max_bytes`, and verification with `codex --ask-for-approval never "Summarize the current instructions."`

### 2. READ — Agent Skills

Open and read:

https://developers.openai.com/codex/skills

Apply from the page: repo skill layout (`.agents/skills/<skill-name>/SKILL.md`), required `name` and `description` frontmatter, progressive disclosure, explicit invocation (`/skills`, `$skill-name`), and implicit routing via `description`.

### 3. READ — Subagents

Open and read:

https://developers.openai.com/codex/subagents

Apply from the page: project subagents in `.codex/agents/*.toml`, required fields (`name`, `description`, `developer_instructions`), optional `sandbox_mode`, and that Codex spawns subagents only when you **explicitly** ask for parallel delegation.

### 4. Install org scripts

```bash
cd .rete/scripts && npm install
cp .env.example .env   # only if .env missing
```

### 5. Install `AGENTS.md`

After step 1.

- Read `.rete/ai/AGENTS.md` and the project `AGENTS.md` if it exists.
- **No project `AGENTS.md`:** create it at the **repository root** per the official docs, following the reference sections: Documentation, Rete tooling, Conventions.
- **Project `AGENTS.md` already exists:** keep the user's structure and wording; add only missing reference content (doc links, Rete tooling block, conventions). Do not duplicate tables or bullets already present.
- **Adapt the Rete tooling block for Codex:**
  - **Skills** (`rete-*`): installed under `.agents/skills/`; invoke with `$rete-setup` / `/skills` or let Codex match via each skill's `description`.
  - **Subagents** (`rete-*`): installed as `.codex/agents/<name>.toml`; delegate explicitly (e.g. "spawn **rete-code-investigator**" or "use one agent per review axis") — Codex does not auto-spawn subagents from routing text alone.
  - Single symbol or file → direct search, not a subagent.
- Do **not** overwrite unrelated sections the user already has.
- Do **not** shell-copy the reference file.

### 6. Install Agent Skills

After step 2.

- Install each directory in `.rete/ai/skills/` under `.agents/skills/<skill-name>/` per the Skills docs.
- Keep `SKILL.md` and any reference files alongside it (e.g. `rete-plugin/architecture.md`).
- Preserve frontmatter (`name`, `description`).

### 7. Install subagents

After step 3.

Codex subagents are **TOML**, not Markdown. For each file in `.rete/ai/agents/`:

1. Read the staged `.md` file (YAML frontmatter + body).
2. Write `.codex/agents/<name>.toml` (filename may use hyphens; `name` field is the source of truth).
3. Map fields:

| Staged `.md` | `.codex/agents/*.toml` |
|--------------|------------------------|
| `name` | `name` |
| `description` | `description` |
| Body (below frontmatter) | `developer_instructions` (triple-quoted string) |
| `readonly: true` | `sandbox_mode = "read-only"` |

Example:

```toml
name = "rete-code-investigator"
description = "Code investigation specialist. Uses token-aware source pagination..."
sandbox_mode = "read-only"
developer_instructions = """
You are a code investigation specialist focused on evidence-based understanding of source code.
...
"""
```

4. Optionally add `[agents]` limits in `.codex/config.toml` if missing:

```toml
[agents]
max_threads = 6
max_depth = 1
```

Do **not** copy raw `.md` agent files into `.codex/agents/` — only TOML per the Subagents docs.

### 8. Confirm discovery

- List `.agents/skills/` — every staged skill directory is present with valid `SKILL.md`.
- List `.codex/agents/` — every staged agent has a matching `.toml` with `name`, `description`, and `developer_instructions`.
- Run `codex --ask-for-approval never "List available skills and custom agents for this repo."` (or restart Codex) and confirm Rete skills and custom agents appear.
- Confirm project root `AGENTS.md` includes the adapted Rete tooling block.

## Done when

- Steps 1–3 completed; steps 4–8 completed
- `.rete/scripts/` has `node_modules` and is ready to run
- Project `AGENTS.md` includes required Rete.js reference content (merged, Codex-adapted — not blindly copied)
- Skills are installed under `.agents/skills/` per the official docs
- Subagents are installed as `.codex/agents/*.toml` per the official docs
- Daily work does not depend on files remaining only under `.rete/ai/`

Then run:

```bash
rete-kit ai --tool codex --commit
```

**Keep** `.rete/scripts/` after commit. Optional `gh-mirror/` and editable clones are in `commit.md` (steps 7–8).
