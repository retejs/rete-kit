# GitHub Copilot setup — install `.rete/` bundle

You are setting up Rete.js AI prompts for **GitHub Copilot** (VS Code agent mode, Copilot coding agent, and compatible surfaces) in this workspace.

## Source bundle

Content is at **`.rete/`** (workspace root):

| Path | Role |
|------|------|
| `.rete/ai/skills/`, `agents/` | Staging — install into Copilot-native paths when supported; otherwise keep and route from instructions |
| `.rete/ai/AGENTS.md` | Reference template — merge into project root `AGENTS.md` |
| `.rete/scripts/` | Permanent — org tooling (`clone-org`, `source-context`) |

Use the official Copilot / VS Code doc pages below for paths and file formats.

## What to install (Copilot)

| Source | Artifact type | Official docs |
|--------|---------------|---------------|
| `.rete/ai/AGENTS.md` (reference) | **`.github/copilot-instructions.md`** — write/merge manually | [Custom instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions) |
| `.rete/ai/skills/` | Agent skills (`.github/skills/<name>/SKILL.md`) | [Agent Skills](https://code.visualstudio.com/docs/agent-customization/agent-skills) · [About agent skills (GitHub)](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) |
| `.rete/ai/agents/` | Custom agents / subagents (`.github/agents/<name>.agent.md`) | [Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents) · [Subagents](https://code.visualstudio.com/docs/agents/subagents) |

**Optional (do not use for Rete routing unless the user already has them):** scoped [`.instructions.md`](https://code.visualstudio.com/docs/agent-customization/custom-instructions#use-instructionsmd-files) files under `.github/instructions/`, or root [`AGENTS.md`](https://code.visualstudio.com/docs/agent-customization/custom-instructions#use-an-agentsmd-file) for multi-agent workspaces. For this tool, prefer a single merged **`.github/copilot-instructions.md`**.

## Install steps

Complete steps **in order**. Finish each **READ** step before the install step that depends on it.

### 1. READ — Custom instructions (`copilot-instructions.md`)

Open and read:

https://code.visualstudio.com/docs/agent-customization/custom-instructions

Apply from the page: `.github/copilot-instructions.md` location, always-on behavior, and how it combines with other instruction files.

### 2. READ — Agent Skills

Open and read:

https://code.visualstudio.com/docs/agent-customization/agent-skills

Apply from the page: project skill directory (`.github/skills/`), `SKILL.md` frontmatter, `name` must match parent directory, discovery via `chat.agentSkillsLocations`.

### 3. READ — Custom agents and subagents

Open and read:

https://code.visualstudio.com/docs/copilot/customization/custom-agents

https://code.visualstudio.com/docs/agents/subagents

Apply from the page: `.github/agents/*.agent.md` format, `tools` / `agents` frontmatter, subagent invocation via the `agent` tool, `user-invocable: false` for subagent-only personas.

### 4. Install org scripts

```bash
cd .rete/scripts && npm install
cp .env.example .env   # only if .env missing
```

### 5. Install `.github/copilot-instructions.md`

After step 1.

- Read `.rete/ai/AGENTS.md` and any existing `.github/copilot-instructions.md`.
- **No file yet:** create `.github/copilot-instructions.md` (create `.github/` if needed). Merge reference sections: Documentation, Rete tooling, Conventions.
- **File exists:** keep the user's structure and wording; add only missing reference content. Do not duplicate tables or bullets already present.
- Do **not** overwrite unrelated sections the user already has.
- Do **not** shell-copy the reference file.

**Rete tooling block (required)** — adapt from `AGENTS.md` and list what you actually installed:

1. **Installed skills** — path per skill: `.github/skills/<name>/SKILL.md`. Tell Copilot to read that file when the task matches the skill's `description` frontmatter.
2. **Installed agents** — path per agent: `.github/agents/<name>.agent.md`. Tell the main agent to delegate via the `agent` tool when the task matches the agent's `description`; prefer subagent-only agents (`user-invocable: false`).
3. **Fallback (skills/agents not installed)** — if step 6 or 7 could not complete (unsupported host, discovery failure, or older Copilot), **keep** the corresponding trees under `.rete/ai/` and add explicit routing in this file:
   - Skills: read `.rete/ai/skills/<name>/SKILL.md` (and sibling reference files) on demand.
   - Agents: read `.rete/ai/agents/<file>.md` on demand and follow as a focused subtask persona.
   - State which paths are installed vs fallback so Copilot does not guess.

Notable routing (include in **Rete tooling**):

- Org mirror / issues → skill **rete-setup**
- Editable library clones → skill **rete-clone**
- Cross-repo investigation → agent **rete-code-investigator**
- Package / PR review → agent **rete-package-reviewer**
- Single symbol or file → direct search, not an agent

### 6. Install Agent Skills

After step 2. Skip only if the READ step shows skills are unavailable in this environment — then document fallback in step 5 and **keep** `.rete/ai/skills/`.

For each directory in `.rete/ai/skills/`:

- Copy to `.github/skills/<name>/` (directory name **must** match `name` in `SKILL.md` frontmatter).
- Keep `SKILL.md` and any reference files alongside it (e.g. `rete-plugin/architecture.md`).
- Do not edit skill bodies unless required to fix invalid frontmatter per the official docs.

### 7. Install custom agents (subagents)

After step 3. Skip only if custom agents are unavailable — then document fallback in step 5 and **keep** `.rete/ai/agents/`.

For each file in `.rete/ai/agents/`:

- Install as `.github/agents/<name>.agent.md` where `<name>` matches the `name` frontmatter field.
- Preserve the Markdown body and frontmatter `description`.
- Map Rete agent frontmatter to Copilot custom-agent frontmatter (per agent — do not use one rule for all):

| Agent | `readonly: true` mapping | Invocation |
|-------|--------------------------|------------|
| **`rete-package-reviewer`** | Read-only `tools` (codebase search / read only; no edit or terminal) | `user-invocable: false` |
| **`rete-code-investigator`** | Read/search tools **plus terminal/bash** scoped to `.rete/scripts` (`npm run source-context`) | `user-invocable: false` |

- Drop fields Copilot does not recognize (`readonly`, etc.) after mapping.

Ensure `.github/copilot-instructions.md` tells the main agent that `rete-code-investigator` and `rete-package-reviewer` are available as subagents when tasks match their descriptions.

### 8. Confirm discovery

- Open **Chat → Configure Chat** (gear) → **Customizations**, or run **Chat: Open Customizations** from the Command Palette.
- Confirm **Instructions** lists `.github/copilot-instructions.md`.
- Confirm **Skills** lists installed skills under `.github/skills/`.
- Confirm **Agents** lists installed `.github/agents/*.agent.md` files.
- If anything is missing, re-read the doc page for that artifact, fix paths/frontmatter, and re-check. Use fallback routing in `copilot-instructions.md` for anything that cannot be discovered.

## Done when

- Steps 1–3 completed; steps 4–8 completed
- `.rete/scripts/` has `node_modules` and is ready to run
- `.github/copilot-instructions.md` includes required Rete.js reference content (merged, not blindly copied) and accurate skill/agent routing
- Skills and agents are installed at Copilot-native paths **or** explicitly routed from `.rete/ai/` in `copilot-instructions.md`
- Daily work does not depend on guessing paths under `.rete/ai/`

Then run:

```bash
rete-kit ai --tool github --commit
```

**Keep** `.rete/scripts/` after commit. Remove from `.rete/ai/` only what was successfully installed (see `commit.md`). Optional `gh-mirror/` and editable clones are in `commit.md` (steps 7–8).
