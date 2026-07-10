# GitHub Copilot commit — finalize setup

Confirm install is complete, then remove **only** the staging AI bundle paths that were installed into Copilot-native locations.

Complete steps **in order**. Finish each **READ** step before the checks or actions that depend on it.

## Commit steps

### 1. READ — Custom instructions

Open and read:

https://code.visualstudio.com/docs/agent-customization/custom-instructions

Apply from the page: expected path for `.github/copilot-instructions.md` and how to verify it is active.

### 2. READ — Agent Skills

Open and read:

https://code.visualstudio.com/docs/agent-customization/agent-skills

Apply from the page: skill layout, frontmatter requirements, where installed skills should appear.

### 3. READ — Custom agents and subagents

Open and read:

https://code.visualstudio.com/docs/copilot/customization/custom-agents

https://code.visualstudio.com/docs/agents/subagents

Apply from the page: `.github/agents/*.agent.md` location, frontmatter, subagent routing via the `agent` tool.

### 4. Run checks

After steps 1–3.

- [ ] **`.github/copilot-instructions.md`** — includes Rete.js reference content from `.rete/ai/AGENTS.md` (merged manually — not a blind copy; no duplicate sections); **Rete tooling** lists installed skill/agent paths **and** any `.rete/ai/` fallback paths still in use; location matches [Custom instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions)
- [ ] **Skills** — every directory under `.rete/ai/skills/` that was installed exists at `.github/skills/<name>/` per [Agent Skills](https://code.visualstudio.com/docs/agent-customization/agent-skills) (including reference files); valid frontmatter; visible in Copilot customizations **or** documented as `.rete/ai/` fallback in `copilot-instructions.md`
- [ ] **Agents** — every file under `.rete/ai/agents/` that was installed exists as `.github/agents/<name>.agent.md` per [Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents); `rete-package-reviewer` read-only tools; `rete-code-investigator` includes terminal/bash for `source-context`; `user-invocable: false` for subagent delegation; descriptions specific enough to route tasks **or** documented as `.rete/ai/` fallback
- [ ] **Scripts** — `.rete/scripts/` has `node_modules` (installed during setup)

If any check fails:

1. Re-read the official doc page linked on that check line.
2. Fix install per that page.
3. Re-run setup (`rete-kit ai --tool github`) if needed.
4. Re-run these checks.

Do **not** remove installed paths from `.rete/ai/` until the checks for those paths pass.

### 5. Finalize — remove staging bundle (partial or full)

When checks in step 4 pass for a given artifact type:

**Skills installed to `.github/skills/`** — remove only matching staging directories:

```bash
# For each <name> successfully installed under .github/skills/<name>/
rm -rf .rete/ai/skills/<name>
```

**Agents installed to `.github/agents/`** — remove only matching staging files:

```bash
# For each <name> successfully installed as .github/agents/<name>.agent.md
rm -f .rete/ai/agents/<name>.md
```

**If every skill and agent was installed and verified**, and `.rete/ai/skills/` and `.rete/ai/agents/` are empty:

```bash
rm -rf .rete/ai
```

**If any skill or agent remains only under `.rete/ai/`** (fallback):

- **Keep** those paths.
- Confirm `.github/copilot-instructions.md` tells Copilot to **read** `.rete/ai/skills/<name>/SKILL.md` or `.rete/ai/agents/<file>.md` when the task matches — Copilot has no automatic discovery for unstaged paths.
- Do **not** run `rm -rf .rete/ai` while fallback content remains.

**Keep** `.rete/scripts/` — org mirror tooling (`clone-org`, `source-context`).

### 6. Inspect workspace

```bash
ls -la
```

Review existing repos and layout for optional org setup.

### 7. Offer org context

Ask the user **in chat** (GitHub Copilot has no `AskQuestion` tool). Present both questions; wait for answers before continuing.

**Question 1 — `gh_mirror`**

Set up local Rete.js readonly org context? This creates `gh-mirror/` (read-only clones + issues/PRs export). Requires disk space and time.

| Answer | Meaning |
|--------|---------|
| Yes | Set up `gh-mirror/` |
| No | Skip for now |

- If **no** → still ask question 2 (user answers both before you continue).
- If **yes** → after answers: read skill **rete-setup** (`.github/skills/rete-setup/SKILL.md`, or `.rete/ai/skills/rete-setup/SKILL.md` if fallback), bootstrap scripts, then step 8, then `npm run clone-org`.

**Question 2 — `editable_clones`**

Will you modify Rete.js library source code in this project? If yes, I can clone the repos you need into a directory here (you choose the path).

| Answer | Meaning |
|--------|---------|
| Yes | I plan to modify library source |
| No | App/integration work only |

- If **yes** → read skill **rete-clone** (installed path or `.rete/ai/` fallback): propose a target directory based on step 6, confirm path with the user (offer 2–3 fixed choices plus a custom path in chat), `git clone` only needed repos. **Never symlink** from `gh-mirror/readonly-repositories/`.

### 8. GitHub token — before `clone-org`

When the user chose **`gh_mirror: yes`**:

```bash
cd .rete/scripts && cp .env.example .env   # only if .env missing
```

Scripts should already be installed from setup (`npm install`). If `node_modules` is missing, run `npm install` first.

If `GITHUB_TOKEN` is missing or empty in `.rete/scripts/.env` and the environment, ask **in chat** before `npm run clone-org`.

**Prompt:** Set up a GitHub token for `gh-mirror` sync? Public repos work without a token, but anonymous requests can hit **GitHub rate limits** — sync may be slow or fail. Add `GITHUB_TOKEN` to `.rete/scripts/.env` (**never paste the token in chat**).

| Answer | Action |
|--------|--------|
| Yes | I'll add a token to `.env` now |
| No | Continue without token (rate limits possible) |

**If yes:**

1. Point the user to [GitHub token settings](https://github.com/settings/tokens) — `public_repo` (classic) or read access to public repos (fine-grained) is enough.
2. User adds `GITHUB_TOKEN=<token>` to `.rete/scripts/.env` locally.
3. Wait for confirmation, verify the value is non-empty (read `.env` — do not echo the token).
4. Run `cd .rete/scripts && npm run clone-org`.

**If no:**

1. Note that rate limits may apply.
2. Run `cd .rete/scripts && npm run clone-org` anyway.

If `GITHUB_TOKEN` is already set, skip the question and run `clone-org` directly.

### 9. Report

Summarize: Copilot install done (`.github/copilot-instructions.md`, skills/agents paths), what was removed from `.rete/ai/` vs kept as fallback, `.rete/scripts/` kept, whether `gh-mirror/` was created (and whether a **GitHub token** was configured), whether working copies were created (and **which path**), or what was declined. Mention **rete-setup** / **rete-clone** skill paths for later.
