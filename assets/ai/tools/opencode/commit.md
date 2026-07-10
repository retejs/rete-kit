# OpenCode commit — finalize setup

Confirm install is complete, then remove the staging AI bundle.

Complete steps **in order**. Finish each **READ** step before the checks or actions that depend on it.

## Commit steps

### 1. READ — AGENTS.md and custom instructions

Open and read:

https://opencode.ai/docs/rules

Apply from the page: expected path for project `AGENTS.md`, optional `opencode.json` `instructions`, and how to verify instructions load in OpenCode sessions.

### 2. READ — Agent Skills

Open and read:

https://opencode.ai/docs/skills

Apply from the page: skill layout, frontmatter requirements, where installed skills should appear (native `skill` tool listing).

### 3. READ — Agents and subagents

Open and read:

https://opencode.ai/docs/agents

Apply from the page: markdown agent location, required `description` and `mode`, `@mention` routing, Task-tool delegation.

### 4. Run checks

After steps 1–3.

- [ ] **AGENTS.md** — project root file includes Rete.js reference content from `.rete/ai/AGENTS.md` (merged manually — not a blind copy; no duplicate sections); location matches [Rules — AGENTS.md](https://opencode.ai/docs/rules); **Rete tooling** lists `.opencode/skills/` and `.opencode/agents/` paths
- [ ] **Skills** — every directory under `.rete/ai/skills/` is installed under `.opencode/skills/<name>/` per [Agent Skills](https://opencode.ai/docs/skills) (including reference files); valid frontmatter (`name` matches directory); visible in the `skill` tool listing after OpenCode restart
- [ ] **Subagents** — every file under `.rete/ai/agents/` is installed as `.opencode/agents/<name>.md` per [Agents](https://opencode.ai/docs/agents); `description` and `mode: subagent` present; `rete-package-reviewer` bash denied; `rete-code-investigator` bash allowlist for `source-context` only; descriptions specific enough to route tasks
- [ ] **Scripts** — `.rete/scripts/` has `node_modules` (installed during setup)

If any check fails:

1. Re-read the official doc page linked on that check line.
2. Fix install per that page.
3. Re-run setup (`rete-kit ai --tool opencode`) if needed.
4. Re-run these checks.

Do **not** remove `.rete/ai/` until all checks pass.

### 5. Finalize — remove staging bundle

When all checks in step 4 pass:

```bash
rm -rf .rete/ai
```

**Keep** `.rete/scripts/` — org mirror tooling (`clone-org`, `source-context`).

### 6. Inspect workspace

```bash
ls -la
```

Review existing repos and layout for optional org setup.

### 7. Offer org context

Ask the user **in chat** (OpenCode has no `AskQuestion` tool). Present both questions in one message; wait for answers before continuing.

**Question 1 — `gh_mirror`**

Set up local Rete.js readonly org context? This creates `gh-mirror/` (read-only clones + issues/PRs export). Requires disk space and time.

| Answer | Meaning |
|--------|---------|
| Yes | Set up `gh-mirror/` |
| No | Skip for now |

- If **no** → still ask question 2 (user answers both before you continue).
- If **yes** → after answers: load skill **`rete-setup`** (`.opencode/skills/rete-setup/SKILL.md`), bootstrap scripts, then step 8, then `npm run clone-org`.

**Question 2 — `editable_clones`**

Will you modify Rete.js library source code in this project? If yes, I can clone the repos you need into a directory here (you choose the path).

| Answer | Meaning |
|--------|---------|
| Yes | I plan to modify library source |
| No | App/integration work only |

- If **yes** → load skill **`rete-clone`** (`.opencode/skills/rete-clone/SKILL.md`): propose a target directory based on step 6, confirm path with the user (offer 2–3 fixed choices plus a custom path in chat), `git clone` only needed repos. **Never symlink** from `gh-mirror/readonly-repositories/`.

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

Summarize: OpenCode install done (root `AGENTS.md`, `.opencode/skills/`, `.opencode/agents/`), `.rete/ai/` removed, `.rete/scripts/` kept, whether `gh-mirror/` was created (and whether a **GitHub token** was configured), whether working copies were created (and **which path**), or what was declined. Mention **`rete-setup`** / **`rete-clone`** for later.
