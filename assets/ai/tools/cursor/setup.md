# Cursor setup — install `.rete/` bundle

You are setting up Rete.js AI prompts for **Cursor** in this workspace.

## Source bundle

Content is at **`.rete/`** (workspace root):

| Path | Role |
|------|------|
| `.rete/ai/skills/` | Staging — install into `.cursor/skills/`, then remove after commit |
| `.rete/ai/agents/` | Staging — install into `.cursor/agents/`, then remove after commit |
| `.rete/ai/AGENTS.md` | Reference template — merge into project root `AGENTS.md` |
| `.rete/scripts/` | Permanent — org tooling (`clone-org`, `source-context`) |

Use the official Cursor doc pages below for paths and file formats.

## What to install (IDE)

| Source | Artifact type | Install target | Official docs |
|--------|---------------|----------------|---------------|
| `.rete/ai/AGENTS.md` (reference) | Project `AGENTS.md` — **write/merge manually** | Workspace root `AGENTS.md` | [Rules — AGENTS.md](https://cursor.com/docs/context/rules#agentsmd) |
| `.rete/ai/skills/` | Agent Skills | `.cursor/skills/<skill-name>/` | [Agent Skills](https://cursor.com/docs/context/skills) |
| `.rete/ai/agents/` | Subagents | `.cursor/agents/<name>.md` | [Subagents](https://cursor.com/docs/subagents) |

Use **`.cursor/skills/`** and **`.cursor/agents/`** (Cursor-native). Do not install Rete skills under `.agents/skills/` unless the project already standardizes on that tree for another tool.

## Install steps

Complete steps **in order**. Finish each **READ** step before the install step that depends on it.

### 1. READ — AGENTS.md

Open and read:

https://cursor.com/docs/context/rules#agentsmd

Apply from the page: where `AGENTS.md` belongs in this workspace.

### 2. READ — Agent Skills

Open and read:

https://cursor.com/docs/context/skills

Apply from the page: skill directory layout, `SKILL.md` frontmatter, discovery in the IDE.

### 3. READ — Subagents

Open and read:

https://cursor.com/docs/subagents

Apply from the page: subagent file location, frontmatter fields, routing via descriptions.

### 4. Install org scripts

```bash
cd .rete/scripts && npm install
cp .env.example .env   # only if .env missing
```

### 5. Install `AGENTS.md`

After step 1.

- Read `.rete/ai/AGENTS.md` and the project `AGENTS.md` if it exists.
- **No project `AGENTS.md`:** create it at the path from the official docs, following the reference sections: Documentation, Rete tooling, Conventions.
- **Project `AGENTS.md` exists:** keep the user's structure and wording; add only missing reference content (doc links, Rete tooling block, conventions). Do not duplicate tables or bullets already present.
- **Adapt the Rete tooling block for Cursor:**
  - **Skills** (`rete-*`): installed under `.cursor/skills/`; route by each skill's `description` frontmatter or `/skill-name` when available.
  - **Subagents** (`rete-*`): installed under `.cursor/agents/`; route by each file's `description` — Cursor delegates automatically when the task matches.
  - Single symbol or file → direct search, not a subagent.
- Do **not** overwrite unrelated sections the user already has.
- Do **not** shell-copy the reference file.

### 6. Install Agent Skills

After step 2.

- Install each directory in `.rete/ai/skills/` under `.cursor/skills/<skill-name>/` per the Skills docs.
- Directory name **must** match `name` in `SKILL.md` frontmatter when present.
- Keep `SKILL.md` and any reference files alongside it (e.g. `rete-plugin/architecture.md`).
- Preserve frontmatter (`name`, `description`). Merge without clobbering unrelated skills.

### 7. Install subagents

After step 3.

- Install each file in `.rete/ai/agents/` as `.cursor/agents/<name>.md` per the Subagents docs (`<name>` = filename stem).
- Preserve frontmatter (`name`, `description`, `readonly`, `model`, `tools` when present). Cursor accepts staged Rete frontmatter — do not over-transform.
- For `readonly: true` agents, keep `readonly: true` unless Cursor docs require `tools` instead.

### 8. Confirm discovery

- Open **Customize → Skills** and confirm installed Rete skills appear (or ask "What skills are available?").
- List `.cursor/agents/` — every staged agent file is present with valid frontmatter.
- Confirm project `AGENTS.md` includes the adapted Rete tooling block with `.cursor/skills/` and `.cursor/agents/` paths.

## Done when

- Steps 1–3 completed; steps 4–8 completed
- `.rete/scripts/` has `node_modules` and is ready to run
- Project `AGENTS.md` includes required Rete.js reference content (merged, not blindly copied)
- Skills and subagents are installed under `.cursor/skills/` and `.cursor/agents/` per the official docs
- Daily work does not depend on files remaining only under `.rete/ai/`

Then run:

```bash
rete-kit ai --tool cursor --commit
```

**Keep** `.rete/scripts/` after commit. Optional `gh-mirror/` and editable clones are in `commit.md` (steps 7–9).
