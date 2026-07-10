# Devin Desktop setup — install `.rete/` bundle

You are setting up Rete.js AI prompts for **Devin Desktop** (formerly Windsurf) in this workspace.

## Source bundle

Content is at **`.rete/`** (workspace root):

| Path | Role |
|------|------|
| `.rete/ai/skills/` | Staging — install into `.devin/skills/` (or prior `.windsurf/skills/` layout), then remove after commit |
| `.rete/ai/agents/` | Staging — convert to `.devin/agents/<name>/AGENT.md`, then remove after commit |
| `.rete/ai/AGENTS.md` | Reference template — merge into project root `AGENTS.md` |
| `.rete/scripts/` | Permanent — org tooling (`clone-org`, `source-context`) |

Use the official Devin Desktop doc pages below for paths and file formats.

## What to install (IDE)

| Source | Artifact type | Official docs |
|--------|---------------|---------------|
| `.rete/ai/AGENTS.md` (reference) | Project root `AGENTS.md` — **write/merge manually** | [AGENTS.md](https://docs.devin.ai/desktop/cascade/agents-md) |
| `.rete/ai/skills/` | Skills (workspace) | [Cascade Skills](https://docs.devin.ai/desktop/cascade/skills) |
| `.rete/ai/agents/` | Custom subagent profiles | [Subagents](https://docs.devin.ai/cli/subagents) |

Devin Desktop also supports workspace [Rules](https://docs.devin.ai/desktop/cascade/memories) at `.devin/rules/*.md` (preferred) or `.windsurf/rules/*.md` from prior Windsurf installs. The Rete bundle does **not** emit rules files — merge `AGENTS.md`, install skills, and install subagent profiles.

**Skill install path:** prefer **`.devin/skills/<skill-name>/`**. If the workspace already uses `.windsurf/skills/` from an older install, you may keep that layout — do not duplicate skills in both trees.

## Install steps

Complete steps **in order**. Finish each **READ** step before the install step that depends on it.

### 1. READ — AGENTS.md

Open and read:

https://docs.devin.ai/desktop/cascade/agents-md

Apply from the page: root `AGENTS.md` is always-on; subdirectory files auto-scope by location; plain markdown, no frontmatter.

### 2. READ — Memories & Rules (context)

Open and read:

https://docs.devin.ai/desktop/cascade/memories

Apply from the page: how `AGENTS.md` feeds the Rules engine; workspace rules live in `.devin/rules/` (preferred) or `.windsurf/rules/`; rule `trigger` modes (`always_on`, `model_decision`, `glob`, `manual`).

### 3. READ — Skills

Open and read:

https://docs.devin.ai/desktop/cascade/skills

Apply from the page: workspace skill layout (`.devin/skills/<skill-name>/SKILL.md` or `.windsurf/skills/`), required frontmatter (`name`, `description`), progressive disclosure, `@skill-name` invocation, Customizations → Skills UI.

### 4. READ — Custom subagents

Open and read:

https://docs.devin.ai/cli/subagents

Apply from the page: custom profiles live at `.devin/agents/<profile-name>/AGENT.md` (also `.agents/agents/<profile-name>/AGENT.md`); directory name is the profile id; YAML frontmatter (`name`, `description`, `allowed-tools`, `permissions`, optional `model`); built-in profiles `subagent_explore` and `subagent_general` must not be overridden; feature is **experimental**.

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
- **Adapt the Rete tooling block for Devin Desktop:**
  - **Skills** (`rete-*`): installed under `.devin/skills/` (or `.windsurf/skills/` if that is already the project convention); route by each skill's `description` frontmatter or `@mention`.
  - **Subagents** (`rete-*`): installed as `.devin/agents/<name>/AGENT.md` profiles; delegate explicitly (e.g. "use the **rete-code-investigator** subagent") or let Devin pick by each profile's `description`.
  - Single symbol or file → direct search, not a subagent profile.
- Do **not** overwrite unrelated sections the user already has.
- Do **not** shell-copy the reference file.

### 7. Install Skills

After step 3.

- Install each directory in `.rete/ai/skills/` under `.devin/skills/<skill-name>/` (or `.windsurf/skills/<skill-name>/` if that is already the project convention).
- Keep `SKILL.md` and any reference files alongside it (e.g. `rete-plugin/architecture.md`).
- Preserve frontmatter (`name`, `description`).

### 8. Install custom subagents

After step 4.

Devin uses **one directory per profile**, not flat `.md` files. For each file in `.rete/ai/agents/`:

1. Let `<name>` = filename stem (e.g. `rete-code-investigator` from `rete-code-investigator.md`).
2. Create `.devin/agents/<name>/AGENT.md` (prefer `.devin/agents/` over `.agents/agents/`).
3. Copy the body from the source file; rewrite frontmatter per [Subagents](https://docs.devin.ai/cli/subagents):

| Source (Rete) | Target (`AGENT.md`) |
|---------------|---------------------|
| `name` | `name` (must match directory name; do not use `subagent_explore` / `subagent_general`) |
| `description` | `description` (routing text for profile selection) |
| `readonly: true` | `allowed-tools: [read, grep, glob]` plus `exec` only when the body requires shell (e.g. `rete-code-investigator` needs `npm run source-context` from `.rete/scripts`) |
| `readonly: true` | `permissions.deny: [write, edit]` (and narrow `permissions.allow` for required `Exec(...)` commands) |

Example layout after install:

```text
.devin/agents/
├── rete-code-investigator/
│   └── AGENT.md
└── rete-package-reviewer/
    └── AGENT.md
```

Do **not** copy agent content into `.devin/rules/` or Workflows. Merge without clobbering unrelated profiles.

### 9. Confirm discovery

- Open **Customizations** → **Skills** and confirm installed skills appear.
- Optionally `@mention` a skill (e.g. `@rete-setup`) to verify invocation.
- List `.devin/agents/` — every staged agent has a profile directory with `AGENT.md`.
- Confirm project root `AGENTS.md` includes the adapted Rete tooling block and lists installed subagent profile names.

## Done when

- Steps 1–4 completed; steps 5–9 completed
- `.rete/scripts/` has `node_modules` and is ready to run
- Project `AGENTS.md` includes required Rete.js reference content (merged, Devin Desktop–adapted — not blindly copied)
- Skills are installed under `.devin/skills/` (or `.windsurf/skills/`) per the official docs
- Subagents are installed under `.devin/agents/<name>/AGENT.md` per the Subagents docs
- Daily work does not depend on files remaining only under `.rete/ai/`

Then run:

```bash
rete-kit ai --tool devin-desktop --commit
```

**Keep** `.rete/scripts/` after commit. Optional `gh-mirror/` and editable clones are in `commit.md` (steps 7–8).
