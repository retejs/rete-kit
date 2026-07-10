# Cursor commit — finalize setup

Confirm install is complete, then remove the staging AI bundle.

Complete steps **in order**. Finish each **READ** step before the checks or actions that depend on it.

## Commit steps

### 1. READ — AGENTS.md

Open and read:

https://cursor.com/docs/context/rules#agentsmd

Apply from the page: expected path and how to verify `AGENTS.md` is active.

### 2. READ — Agent Skills

Open and read:

https://cursor.com/docs/context/skills

Apply from the page: skill layout, frontmatter requirements, where installed skills should appear.

### 3. READ — Subagents

Open and read:

https://cursor.com/docs/subagents

Apply from the page: subagent file location, frontmatter, routing via descriptions.

### 4. Run checks

After steps 1–3.

- [ ] **AGENTS.md** — project file includes Rete.js reference content from `.rete/ai/AGENTS.md` (merged manually — not a blind copy; no duplicate sections); **Rete tooling** adapted for Cursor (skills in `.cursor/skills/`, subagents in `.cursor/agents/`); location matches [Rules — AGENTS.md](https://cursor.com/docs/context/rules#agentsmd)
- [ ] **Skills** — every directory under `.rete/ai/skills/` is installed under `.cursor/skills/<name>/` per [Agent Skills](https://cursor.com/docs/context/skills) (including reference files); valid frontmatter; visible in Customize → Skills or via skill discovery
- [ ] **Subagents** — every file under `.rete/ai/agents/` is installed as `.cursor/agents/<name>.md` per [Subagents](https://cursor.com/docs/subagents); frontmatter preserved; `readonly: true` honored; descriptions specific enough to route tasks
- [ ] **Scripts** — `.rete/scripts/` has `node_modules` (installed during setup)

If any check fails:

1. Re-read the official doc page linked on that check line.
2. Fix install per that page.
3. Re-run setup (`rete-kit ai --tool cursor`) if needed.
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

Use **one** `AskQuestion` call. **Title:** `Rete.js AI setup — optional next steps`

**Question 1** — `id`: `gh_mirror`

**Prompt:** Set up local Rete.js readonly org context? This creates `gh-mirror/` (read-only clones + issues/PRs export). Requires disk space and time.

| Option id | Label |
|-----------|-------|
| `yes` | Yes — set up gh-mirror/ |
| `no` | No — skip for now |

- If **no** → still show question 2 in the same call (user answers both before you continue).
- If **yes** → after answers: skill **`rete-setup`** — bootstrap scripts, then step 8, then `npm run clone-org`.

**Question 2** — `id`: `editable_clones`

**Prompt:** Will you modify Rete.js library source code in this project? If yes, I can clone the repos you need into a directory here (you choose the path).

| Option id | Label |
|-----------|-------|
| `yes` | Yes — I plan to modify library source |
| `no` | No — app/integration work only |

- If **yes** → skill **`rete-clone`**: propose a target directory based on step 6, confirm path with the user (`AskQuestion` for fixed choices; chat or **Other...** for a custom path), `git clone` only needed repos. **Never symlink** from `gh-mirror/readonly-repositories/`.

### 8. GitHub token — before `clone-org`

When the user chose **`gh_mirror: yes`**:

```bash
cd .rete/scripts && cp .env.example .env   # only if .env missing
```

Scripts should already be installed from setup (`npm install`). If `node_modules` is missing, run `npm install` first.

If `GITHUB_TOKEN` is missing or empty in `.rete/scripts/.env` and the environment, use **one** `AskQuestion` call before `npm run clone-org`.

**Title:** `gh-mirror — GitHub token`

**Question** — `id`: `github_token`

**Prompt:** Set up a GitHub token for `gh-mirror` sync? Public repos work without a token, but anonymous requests can hit **GitHub rate limits** — sync may be slow or fail. Add `GITHUB_TOKEN` to `.rete/scripts/.env` (**never paste the token in chat**).

| Option id | Label |
|-----------|-------|
| `yes` | Yes — I'll add a token to .env now |
| `no` | No — continue without token (rate limits possible) |

**If `yes`:**

1. Point the user to [GitHub token settings](https://github.com/settings/tokens) — `public_repo` (classic) or read access to public repos (fine-grained) is enough.
2. User adds `GITHUB_TOKEN=<token>` to `.rete/scripts/.env` locally.
3. Wait for confirmation, verify the value is non-empty (read `.env` — do not echo the token).
4. Run `cd .rete/scripts && npm run clone-org`.

**If `no`:**

1. Note that rate limits may apply.
2. Run `cd .rete/scripts && npm run clone-org` anyway.

If `GITHUB_TOKEN` is already set, skip the question and run `clone-org` directly.

### 9. Report

Summarize: IDE install done, `.rete/ai/` removed, `.rete/scripts/` kept, whether `gh-mirror/` was created (and whether a **GitHub token** was configured), whether working copies were created (and **which path**), or what was declined. Mention **`rete-setup`** / **`rete-clone`** for later.
