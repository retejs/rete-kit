# Antigravity setup — install `.rete/` bundle

You are setting up Rete.js AI prompts for **Google Antigravity** (IDE or CLI) in this workspace.

## Source bundle

Content is at **`.rete/`** (workspace root):

| Path | Role |
|------|------|
| `.rete/ai/skills/` | Staging — install into `.agents/skills/`, then remove after commit |
| `.rete/ai/agents/` | **Kept on disk** — no declarative subagent file path; read on demand per [Subagents](https://antigravity.google/docs/subagents) |
| `.rete/ai/AGENTS.md` | Reference template — merge into project root `AGENTS.md` |
| `.rete/scripts/` | Permanent — org tooling (`clone-org`, `source-context`) |

Use the official Antigravity doc pages below for paths and file formats.

## Capability findings (Antigravity vs Cursor)

| Feature | Antigravity support | Rete-kit decision |
|---------|---------------------|-------------------|
| **Project instructions** | Workspace root `AGENTS.md` or `GEMINI.md`; also `.agents/AGENTS.md` | Merge reference into root **`AGENTS.md`** (cross-tool) |
| **Rules** | `.agents/rules/*.md` (default); `.agent/rules/*.md` still read | **Do not** use rules for Rete routing |
| **Skills** | `.agents/skills/<name>/SKILL.md` (default); `.agent/skills/` back-compat | **Install** from `.rete/ai/skills/`; remove staging skills on commit |
| **Workflows** | `.agents/workflows/*.md` — slash-command procedures | Not used by this bundle |
| **Subagents** | Built-in (`research`, `browser`, `self`); custom via `define_subagent` at runtime — no project `.agents/agents/*.md` like Cursor | **On-demand** — keep `.rete/ai/agents/`; read agent `.md` when routing matches |

Antigravity 2.0 defaults to **`.agents/`** (plural) for rules, skills, and workflows. **`.agent/`** (singular) remains backward-compatible for skills and rules.

## What to install (Antigravity)

| Source | Artifact type | Official docs |
|--------|---------------|---------------|
| `.rete/ai/AGENTS.md` (reference) | Workspace root `AGENTS.md` — **write/merge manually** | [CLI best practices — codebase rule file](https://antigravity.google/docs/cli/best-practices) · [Rules & Workflows](https://antigravity.google/docs/rules-workflows) |
| `.rete/ai/skills/` | Agent Skills (workspace) | [Agent Skills](https://antigravity.google/docs/skills) |
| `.rete/ai/agents/` | **Not installed** — read on demand from `.rete/ai/agents/` | [Subagents](https://antigravity.google/docs/subagents) (runtime / harness — not declarative files) |

## Install steps

Complete steps **in order**. Finish each **READ** step before the install step that depends on it.

### 1. READ — AGENTS.md / GEMINI.md

Open and read:

https://antigravity.google/docs/cli/best-practices

https://antigravity.google/docs/rules-workflows

Apply from the pages: workspace root `AGENTS.md` or `GEMINI.md` is parsed at startup; `.agents/AGENTS.md` is also supported by the harness. Prefer root `AGENTS.md` for cross-tool projects.

### 2. READ — Rules (context only)

Open and read:

https://antigravity.google/docs/rules-workflows

Apply from the page: rules live in `.agents/rules/` (default) with YAML frontmatter (`trigger`: `always_on`, `glob`, `model_decision`, `manual`). `.agent/rules/` is still discovered. Rete routing does **not** use rules.

### 3. READ — Agent Skills

Open and read:

https://antigravity.google/docs/skills

Apply from the page: workspace skill layout (`.agents/skills/<skill-name>/SKILL.md`), required `description` frontmatter, progressive disclosure, optional `name`, discovery at conversation start.

### 4. READ — Subagents (on-demand Rete agents)

Open and read:

https://antigravity.google/docs/subagents

Apply from the page: Antigravity subagents are harness-managed (`invoke_subagent`, built-in types, or `define_subagent` during a session). There is **no** project folder for user-authored subagent definition files like Cursor `.cursor/agents/`. Rete review/investigation agents stay at `.rete/ai/agents/*.md` and are **read on demand** when `AGENTS.md` routing matches.

### 5. Install org scripts

```bash
cd .rete/scripts && npm install
cp .env.example .env   # only if .env missing
```

### 6. Install `AGENTS.md`

After steps 1–2.

- Read `.rete/ai/AGENTS.md` and the project `AGENTS.md` if it exists.
- **No project `AGENTS.md`:** create it at the workspace root per the official docs, following the reference sections: Documentation, Rete tooling, Conventions.
- **Project `AGENTS.md` exists:** keep the user's structure and wording; add only missing reference content (doc links, Rete tooling block, conventions). Do not duplicate tables or bullets already present.
- **Adapt the Rete tooling block for Antigravity:**
  - **Skills** (`rete-*`): installed under `.agents/skills/`; route by each skill's `description` frontmatter or mention the skill by name in chat.
  - **Review / investigation agents** (`rete-*`): **not** installed in the IDE. When a task matches an agent's `description`, **read** `.rete/ai/agents/<name>.md` (e.g. `rete-code-investigator.md`, `rete-package-reviewer.md`) and follow it.
  - Single symbol or file → direct search, not an agent file.
- Do **not** overwrite unrelated sections the user already has.
- Do **not** shell-copy the reference file.

### 7. Install Agent Skills

After step 3.

- Install each directory in `.rete/ai/skills/` under `.agents/skills/<skill-name>/` per the Skills docs.
- Keep `SKILL.md` and any reference files alongside it (e.g. `rete-plugin/architecture.md`).
- Preserve frontmatter (`name`, `description`).
- If `.agents/skills/` already exists from a partial install, merge without clobbering unrelated skills.

### 8. Keep agents in `.rete/ai/agents/` (on-demand)

Antigravity does **not** discover Rete agents from a declarative install path. Do **not** copy agent files into `.agents/rules/` or `.agents/workflows/`.

Leave every file in `.rete/ai/agents/` in place. **How to use:** routing in `AGENTS.md` (step 6) tells the main agent when to **read** each file and follow its instructions; optional parallel work can still use harness subagents (`research`, `invoke_subagent`) per the Subagents docs.

| Agent file | Read when |
|------------|-----------|
| `.rete/ai/agents/rete-code-investigator.md` | Cross-repo investigation, architecture tracing, broad codebase questions |
| `.rete/ai/agents/rete-package-reviewer.md` | Package / PR / diff review for Rete.js org libraries |

When invoking an agent workflow, read the full file before acting; honor `readonly: true` in frontmatter when present.

### 9. Confirm discovery

- Ask **"What skills are available?"** in Antigravity chat (or run `/skills` in Antigravity CLI) and confirm installed Rete skills appear.
- Confirm workspace root `AGENTS.md` includes the adapted Rete tooling block.

## Done when

- Steps 1–4 completed; steps 5–9 completed
- `.rete/scripts/` has `node_modules` and is ready to run
- Project `AGENTS.md` includes required Rete.js reference content (merged, Antigravity-adapted — not blindly copied)
- Skills are installed under `.agents/skills/` per the official docs
- Agent files remain under `.rete/ai/agents/` with routing documented in `AGENTS.md`
- Daily skill work does not depend on files remaining only under `.rete/ai/skills/`

Then run:

```bash
rete-kit ai --tool antigravity --commit
```

**Keep** `.rete/scripts/` and `.rete/ai/agents/` after commit. Optional `gh-mirror/` and editable clones are in `commit.md` (steps 7–8).
