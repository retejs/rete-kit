# Kiro setup — install `.rete/` bundle

You are setting up Rete.js AI prompts for **Kiro** (AWS agentic IDE + CLI) in this workspace.

Kiro is the successor to Amazon Q Developer IDE plugins. If this project still has `.amazonq/` rules from an older Amazon Q setup, remove them after installing Kiro-native paths — see [Migrating from Amazon Q Developer](https://kiro.dev/docs/migrating-from-q-developer).

## Source bundle

Content is at **`.rete/`** (workspace root):

| Path | Role |
|------|------|
| `.rete/ai/skills/`, `agents/` | Staging — install into `.kiro/`, then remove `.rete/ai/` |
| `.rete/ai/AGENTS.md` | Reference template — merge into project root `AGENTS.md` |
| `.rete/scripts/` | Permanent — org tooling (`clone-org`, `source-context`) |

Use the official Kiro doc pages below for paths and file formats. The same `.kiro/` layout applies to **Kiro IDE** and **Kiro CLI** (ACP-compatible).

## What to install (Kiro)

| Source | Artifact type | Official docs |
|--------|---------------|---------------|
| `.rete/ai/AGENTS.md` (reference) | Project root `AGENTS.md` — **write/merge manually** | [Steering — AGENTS.md](https://kiro.dev/docs/steering#agentsmd) |
| `.rete/ai/skills/` | Workspace Agent Skills | [Agent Skills](https://kiro.dev/docs/skills) |
| `.rete/ai/agents/` | Custom subagents | [Subagents](https://kiro.dev/docs/chat/subagents), [Custom agents](https://kiro.dev/docs/custom-agents) |

Kiro also supports [Steering](https://kiro.dev/docs/steering) (`.kiro/steering/*.md` with inclusion modes) and [Hooks](https://kiro.dev/docs/hooks) (`.kiro/hooks/*.json`). The Rete bundle does **not** emit steering or hooks — use native skills and `AGENTS.md` only.

## Install steps

Complete steps **in order**. Finish each **READ** step before the install step that depends on it.

### 1. READ — AGENTS.md and steering

Open and read:

https://kiro.dev/docs/steering

Apply from the page:

- Workspace root `AGENTS.md` is always included (no inclusion-mode frontmatter)
- Optional global copy at `~/.kiro/steering/AGENTS.md`
- How steering differs from skills (do not duplicate Rete skills as steering files)

### 2. READ — Agent Skills

Open and read:

https://kiro.dev/docs/skills

Apply from the page: workspace skill layout (`.kiro/skills/<skill-name>/SKILL.md`), required frontmatter (`name` must match folder name, `description`), discovery in **Agent Steering & Skills**, `/` slash-command invocation.

CLI users: same paths — see [CLI Agent Skills](https://kiro.dev/docs/cli/skills).

### 3. READ — Subagents and custom agents

Open and read:

https://kiro.dev/docs/chat/subagents

https://kiro.dev/docs/custom-agents

Apply from the pages:

- Workspace subagents at `.kiro/agents/<name>.md` (nested paths supported; agent name is the relative path without extension)
- Frontmatter: `name` (required), `description`, `tools`, `model`, optional `permissions`
- Routing via `description`; explicit invocation (`Use the <name> subagent…`) and `/name` slash commands
- Workspace agents load only when the workspace is **trusted** — accept the trust prompt if shown
- Map `readonly: true` in staged agents to tool access (per agent):
  - **`rete-package-reviewer`:** `tools: ["read"]` (omit `write`, `shell`, `web`)
  - **`rete-code-investigator`:** `tools: ["read", "shell"]` — runs `npm run source-context` from `.rete/scripts`

### 4. Install org scripts

```bash
cd .rete/scripts && npm install
cp .env.example .env   # only if .env missing
```

### 5. Install `AGENTS.md`

After step 1.

- Read `.rete/ai/AGENTS.md` and the project `AGENTS.md` if it exists.
- **No project `AGENTS.md`:** create it at the **workspace root** per the official docs, following the reference sections: Documentation, Rete tooling, Conventions.
- **Project `AGENTS.md` exists:** keep the user's structure and wording; add only missing reference content (doc links, Rete tooling block, conventions). Do not duplicate tables or bullets already present.
- **Adapt the Rete tooling block for Kiro:**
  - **Skills** (`rete-*`): installed under `.kiro/skills/`; route by each skill's `description` or `/rete-<name>` slash command.
  - **Subagents** (`rete-*`): installed as `.kiro/agents/<name>.md`; Kiro auto-delegates by `description` or on explicit request (`Use the rete-code-investigator subagent…`).
- Remove `.amazonq/` rules if present from a prior Amazon Q setup.
- Do **not** overwrite unrelated sections the user already has.
- Do **not** shell-copy the reference file.

### 6. Install Agent Skills

After step 2.

- Install each directory in `.rete/ai/skills/` under `.kiro/skills/<skill-name>/` per the Skills docs.
- Keep `SKILL.md` and any reference files alongside it (e.g. `rete-plugin/architecture.md`).
- Preserve frontmatter; ensure `name` matches the folder name.

### 7. Install subagents

After step 3.

- Install each file in `.rete/ai/agents/` as `.kiro/agents/<name>.md` per the Subagents docs.
- Map frontmatter: `name`, `description`; `readonly: true` → `tools: ["read"]` for **`rete-package-reviewer`**, `tools: ["read", "shell"]` for **`rete-code-investigator`**; drop `readonly` after mapping.
- Copy the body unchanged. Merge without clobbering unrelated agents.

### 8. Confirm discovery

- Open **Agent Steering & Skills** in the Kiro panel and confirm skills appear.
- Type `/` in chat and confirm Rete skills and subagents are listed as slash commands.
- Confirm workspace root `AGENTS.md` includes the adapted Rete tooling block.
- If `.kiro/agents/` was added to an already-open workspace, reload the window or restart Kiro so agents are picked up.

## Done when

- Steps 1–3 completed; steps 4–8 completed
- `.rete/scripts/` has `node_modules` and is ready to run
- Project `AGENTS.md` includes required Rete.js reference content (merged, Kiro-adapted — not blindly copied)
- Skills and subagents are installed under `.kiro/skills/` and `.kiro/agents/` per the official docs
- Daily work does not depend on files remaining only under `.rete/ai/`

Then run:

```bash
rete-kit ai --tool kiro --commit
```

**Keep** `.rete/scripts/` after commit. Optional `gh-mirror/` and editable clones are in `commit.md` (steps 7–8).
