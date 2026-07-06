# Pi setup — install `.rete/` bundle

You are setting up Rete.js AI prompts for **Pi** (terminal coding agent, `@earendil-works/pi-coding-agent`) in this workspace.

## Source bundle

Content is at **`.rete/`** (workspace root):

| Path | Role |
|------|------|
| `.rete/ai/skills/` | Staging — install into `.agents/skills/`, then remove after commit |
| `.rete/ai/agents/` | Staging — install into `.pi/agents/` when a subagent extension is present; otherwise keep for on-demand read |
| `.rete/ai/AGENTS.md` | Reference template — merge into project root `AGENTS.md` |
| `.rete/scripts/` | Permanent — org tooling (`clone-org`, `source-context`) |

Use the official Pi doc pages below for paths and file formats.

## Capability findings (Pi vs Cursor)

| Feature | Pi support | Rete-kit decision |
|---------|------------|-------------------|
| **Project instructions** | Root `AGENTS.md` or `CLAUDE.md`; also `~/.pi/agent/AGENTS.md` | Merge reference into root **`AGENTS.md`** (cross-tool) |
| **Skills** | `.agents/skills/<name>/SKILL.md` (project, after trust); also `.pi/skills/`, `~/.pi/agent/skills/` | **Install** from `.rete/ai/skills/` into `.agents/skills/`; remove staging skills on commit |
| **Skill invocation** | `/skill:name`; progressive disclosure via `description` | Document in `AGENTS.md`; use `/skill:rete-setup` when explicit |
| **Subagents** | **Not built-in** — [pi-subagents](https://github.com/nicobailon/pi-subagents) and compatible packages add `.pi/agents/*.md` | **If extension present:** install to `.pi/agents/`; **else:** keep `.rete/ai/agents/` and read on demand |
| **Project trust** | Required before project-local `.agents/skills/` and `.pi/` resources load | Trust the project (`/trust` or `--approve`) after install |

Pi intentionally omits built-in MCP, sub-agents, plan mode, and permission popups — those are extension/package workflows. See [Using Pi — Design Principles](https://pi.dev/docs/latest/usage#design-principles).

## What to install (Pi)

| Source | Artifact type | Official docs |
|--------|---------------|---------------|
| `.rete/ai/AGENTS.md` (reference) | Workspace root `AGENTS.md` — **write/merge manually** | [Using Pi — Context Files](https://pi.dev/docs/latest/usage#context-files) |
| `.rete/ai/skills/` | Agent Skills (workspace) | [Skills](https://pi.dev/docs/latest/skills) |
| `.rete/ai/agents/` | Custom subagent profiles (when extension installed) | [Pi packages](https://pi.dev/docs/latest/packages) · [pi-subagents](https://github.com/nicobailon/pi-subagents) · [Design principles](https://pi.dev/docs/latest/usage#design-principles) |

Pi also discovers skills under `.pi/skills/` and via `skills` entries in `.pi/settings.json`. The Rete bundle uses **`.agents/skills/`** (Agent Skills standard, shared with Codex and other harnesses).

## Install steps

Complete steps **in order**. Finish each **READ** step before the install step that depends on it.

### 1. READ — Context files (`AGENTS.md`)

Open and read:

https://pi.dev/docs/latest/usage#context-files

Apply from the page: Pi loads `AGENTS.md` or `CLAUDE.md` at startup from `~/.pi/agent/`, parent directories (walking up from cwd), and the current directory. Disable with `--no-context-files`. Also note [Project Trust](https://pi.dev/docs/latest/usage#project-trust) — project `.agents/skills/` load only after the project is trusted.

### 2. READ — Skills

Open and read:

https://pi.dev/docs/latest/skills

Apply from the page: skill layout (`.agents/skills/<skill-name>/SKILL.md`), required `name` and `description` frontmatter, progressive disclosure, `/skill:name` commands, discovery rules, and `/reload` after changes.

### 3. READ — Subagents (extension optional)

Open and read:

https://pi.dev/docs/latest/usage#design-principles

https://pi.dev/docs/latest/packages

https://github.com/nicobailon/pi-subagents#readme

Apply from the pages: stock Pi has **no built-in sub-agents**; packages such as **pi-subagents** add project agents at `.pi/agents/**/*.md` (flat markdown + YAML frontmatter, `tools:` for visibility). Project agents require [project trust](https://pi.dev/docs/latest/usage#project-trust). Without an extension, Rete agents stay at `.rete/ai/agents/*.md` and are read on demand.

### 4. Install org scripts

```bash
cd .rete/scripts && npm install
cp .env.example .env   # only if .env missing
```

### 5. Install `AGENTS.md`

After step 1.

- Read `.rete/ai/AGENTS.md` and the project `AGENTS.md` if it exists.
- **No project `AGENTS.md`:** create it at the workspace root per the official docs, following the reference sections: Documentation, Rete tooling, Conventions.
- **Project `AGENTS.md` exists:** keep the user's structure and wording; add only missing reference content (doc links, Rete tooling block, conventions). Do not duplicate tables or bullets already present.
- **Adapt the Rete tooling block for Pi** — state which agent paths are **installed** vs **on-demand** (do not make Pi guess):
  - **Skills** (`rete-*`): installed under `.agents/skills/`; route by each skill's `description` frontmatter or invoke with `/skill:rete-setup` (etc.).
  - **Subagents** (`rete-*`) — **if installed** (step 7): `.pi/agents/<name>.md`; delegate via the extension's `subagent` tool or slash commands (e.g. `/run rete-code-investigator "…"`).
  - **Subagents** (`rete-*`) — **if not installed**: when a task matches an agent's `description`, **read** `.rete/ai/agents/<name>.md` and follow it in the main session.
  - Single symbol or file → direct search, not a subagent.
- Do **not** overwrite unrelated sections the user already has.
- Do **not** shell-copy the reference file.

### 6. Install Agent Skills

After step 2.

- Install each directory in `.rete/ai/skills/` under `.agents/skills/<skill-name>/` per the Skills docs.
- Keep `SKILL.md` and any reference files alongside it (e.g. `rete-plugin/architecture.md`).
- Preserve frontmatter (`name`, `description`).
- If `.agents/skills/` already exists from a partial install, merge without clobbering unrelated skills.

### 7. Detect subagent extension and install agents

After step 3.

**Detect** whether a subagent package is installed (user-global or project-local):

```bash
pi list
pi list -l    # only if .pi/ exists in the project
```

Treat as **extension present** if output mentions a package whose name contains `subagent` (e.g. `pi-subagents`, `pi-subagent`). Also check `.pi/settings.json` / `~/.pi/agent/settings.json` for enabled `pi-subagents` or `subagents` config when `pi list` is inconclusive.

**If extension present** — install each file from `.rete/ai/agents/` to `.pi/agents/<name>.md` (`<name>` = filename stem). Rewrite frontmatter for [pi-subagents](https://github.com/nicobailon/pi-subagents):

| Source (Rete) | Target (`.pi/agents/<name>.md`) |
|---------------|----------------------------------|
| `name` | `name` (must match filename stem) |
| `description` | `description` |
| `readonly: true` | `tools: read,grep,find,ls` plus `bash` only when the body requires shell (e.g. `rete-code-investigator` needs `npm run source-context` from `.rete/scripts`) |
| `readonly: true` | drop `readonly` after mapping |

Copy the Markdown body unchanged. Merge without clobbering unrelated project agents.

Ensure **project trust** (`/trust` or `--approve`) so `.pi/agents/` loads. Run `pi config` if needed to enable the package's **agents** resource. Run `/reload` or restart Pi after install.

**If extension absent** — do **not** install to `.pi/agents/`. Leave agents in `.rete/ai/agents/`; document on-demand routing in `AGENTS.md` (step 5). Optionally offer: `pi install npm:pi-subagents -l` (project-local) — only if the user wants native subagents; re-run this step after install.

### 8. Confirm discovery

- **Trust the project** if Pi prompts on first run (`/trust` in interactive mode, or restart with `--approve`). Project `.agents/skills/` and `.pi/agents/` are not loaded until trust is granted.
- Run `/reload` in Pi (or restart) so new skills, agents, and `AGENTS.md` are picked up.
- Check the startup header lists Rete skills, or run `/skill:rete-setup` to verify one skill loads.
- **If subagents installed:** confirm `.pi/agents/rete-*.md` exist; run `/subagents-doctor` or ask Pi to list available subagents when the extension is active.
- Confirm workspace root `AGENTS.md` includes the adapted Rete tooling block and states installed vs on-demand agent paths.

## Done when

- Steps 1–3 completed; steps 4–8 completed
- `.rete/scripts/` has `node_modules` and is ready to run
- Project `AGENTS.md` includes required Rete.js reference content (merged, Pi-adapted — not blindly copied)
- Skills are installed under `.agents/skills/` per the official docs
- Subagents are installed under `.pi/agents/` **or** documented as on-demand reads from `.rete/ai/agents/`
- Daily work does not depend on files remaining only under `.rete/ai/`

Then run:

```bash
rete-kit ai --tool pi --commit
```

**Keep** `.rete/scripts/` after commit. If agents could not be installed, **keep** `.rete/ai/agents/` until commit verifies fallback routing. Optional `gh-mirror/` and editable clones are in `commit.md` (steps 7–8).
