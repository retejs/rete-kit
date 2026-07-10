---
name: rete-git
description: >-
  Git and GitHub workflow for Rete.js contributions: branch naming, conventional
  commits, pull requests, validation, and fork workflow. Use when committing,
  branching, opening PRs, or contributing to retejs org repos.
---

# Rete git — version control for Rete.js

Official source: [Contribution guide](https://retejs.org/docs/contribution) · [Development / style guide](https://retejs.org/docs/development) · [Quality assurance](https://retejs.org/docs/quality-assurance)

Use this skill for **git operations and contribution workflow** across `retejs` org repositories. For plugin SDLC commands (`rete build`, `rete lint`, Scope architecture), see skill **rete-plugin**. For E2E testing details, see skill **rete-qa**.

## When to use

- Creating branches, commits, or pull requests
- Contributing to a `retejs/*` package or `retejs.org` docs
- Reviewing whether changes follow org conventions before push/PR
- Fork → clone → branch → validate → commit → PR flow

## Contribution model

Standard GitHub flow ([Contribution — Code contribution](https://retejs.org/docs/contribution#code)):

1. **Fork** the target repository on GitHub
2. **Clone** your fork locally: `git clone <fork-url>`
3. **Create a branch** (see naming below)
4. **Install** dependencies: `npm ci`
5. **Verify** the build: `npm run build`
6. **Make changes** — follow the [style guide](https://retejs.org/docs/development#style-guide)
7. **Run** tests, linter, and build before committing
8. **Validate** changes (see Validation)
9. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
10. **Push** to your fork branch
11. **Open a pull request** — reference the related issue when applicable

### Before starting work

- Discuss non-trivial changes in GitHub Issues first — confirm whether a standalone plugin is enough vs core changes
- Review [Code of conduct](https://retejs.org/docs/code-of-conduct) and [Licensing](https://retejs.org/docs/licensing)
- Prefer **plugins** over core modifications when extending functionality
- Keep PRs **small and focused** on a single issue or topic
- Add **simple, meaningful unit tests** for new code
- Watch for **breaking changes** — flag them explicitly in commits/PR description

## Branch naming

Per the [step-by-step guide](https://retejs.org/docs/contribution#step-by-step-package):

| Prefix | Use for |
|--------|---------|
| `fix/<short-description>` | Bug fixes |
| `feature/<short-description>` | New features or enhancements |
| Other descriptive prefixes | Acceptable when clearer (e.g. `docs/`, `chore/`, `ci/`) — match existing repo patterns |

Examples from org history: `fix/race-condition-removing`, `feature/angular-20`, `fix/node-compatibility`.

Rules:

- One branch per fix or feature — do not mix unrelated topics
- Use lowercase and hyphens in the slug (`fix/socket-rendering`, not `fix/SocketRendering`)
- Push to **your fork's branch**, then open PR against upstream

## Commit messages (Conventional Commits)

Commits **must** follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) — required by the [contribution guide](https://retejs.org/docs/contribution#step-by-step-package).

### Format

```
<type>(<optional-scope>): <subject>

<optional body>

<optional footer>
```

### Common types (used in org repos)

| Type | When |
|------|------|
| `feat` | Any user-facing change: new features, behavior changes, or interface/API changes |
| `fix` | Internal-only corrections that do not change public interfaces/API or user-facing behavior |
| `docs` | Documentation-only changes in non-docs repositories; in documentation website repositories, use `feat(docs)` |
| `test` | Adding or fixing tests |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `build` | Build system or external dependencies |
| `ci` | CI configuration |
| `chore` | Maintenance (releases, tooling) — e.g. `chore(release): 2.0.6` |
| `revert` | Revert a previous commit |

### Rules

- **Subject**: imperative mood, concise, no trailing period — e.g. `fix: optimize node and connection removal logic`
- **Scope** (optional): package or area — e.g. `fix(area):`, `build(deps):`, `feat(plugin):`
- **Body**: explain *why* when the subject alone is not enough
- **Breaking changes**: add `!` after type/scope (`feat(api)!: remove deprecated method`) or footer `BREAKING CHANGE: <description>`
- **Issue references** in footer when relevant: `Closes #123`, `Fixes #456`
- Do **not** commit secrets (`.env`, tokens, credentials)

### Examples (from org practice)

```
fix: optimize node and connection removal logic
test: add performance tests
build: update cli
ci: secrets
fix: update cli and fix linting errors
chore(release): 2.0.6
```

## Pull requests

### PR description

- **Reference the issue** if one exists (`Fixes #123` or link in description)
- For improvements: explain **what** changed and **why**
- Note **breaking changes** prominently
- List **validation steps** you ran (build, lint, test, rete-qa if applicable)

### PR quality checklist

- [ ] Single focused topic — not a bundle of unrelated fixes
- [ ] Follows [style guide](https://retejs.org/docs/development#style-guide)
- [ ] Unit tests for new behavior
- [ ] `npm run build` passes
- [ ] Linter passes (`rete lint` in plugin repos)
- [ ] E2E via `npx rete-qa test` when integration risk exists (see skill **rete-qa**)
- [ ] Conventional commit messages on all commits
- [ ] No secrets or generated artifacts that should stay local

### Documentation contributions

Docs live in [retejs/retejs.org](https://github.com/retejs/retejs.org). Follow that repo's [CONTRIBUTION.md](https://github.com/retejs/retejs.org/blob/main/CONTRIBUTION.md) for content-specific rules.

## Validation before PR

Per [Validate changes](https://retejs.org/docs/contribution#package-validate-changes):

1. **Pack the package**: `cd dist && npm pack`
2. **Test in your app** — install the `.tgz`, start the app
3. **Test in a Rete Kit app** — `npx rete-kit app`, install `.tgz`, start
4. **E2E** (when needed):
   - Point [deps alias](https://retejs.org/docs/quality-assurance#init) to the `.tgz`
   - `npx rete-qa init --deps-alias dependencies.json`
   - `npx rete-qa test`

For iterative local work, use `npx rete-kit build --for <apps>` for hot-reload across dependencies.

## Agent workflow for git tasks

1. **Confirm target repo** — user app vs `retejs/*` library vs docs
2. **Check git state** — `git status`, current branch, remote
3. **Create appropriately named branch** from latest `main`/`master`
4. **Stage only relevant files** — never `.env`, `node_modules`, or `.rete/` tooling
5. **Draft commit message** — conventional format, imperative subject
6. **Run validation** in the repo being changed before suggesting push
7. **PR** — only when user explicitly asks; summarize changes and link issues

### Safety rules

- **Never** force-push to `main`/`master`
- **Never** skip hooks (`--no-verify`) unless the user explicitly requests it
- **Never** amend commits already pushed to shared remote
- **Never** update git config
- Create commits **only when the user asks** — do not commit proactively

## Related skills

| Task | Skill |
|------|-------|
| Editable library clones | **rete-clone** |
| Org mirror / issues export | **rete-setup** |
| Plugin architecture & `rete` CLI | **rete-plugin** |
| E2E regression testing | **rete-qa** |
| Package / PR code review | subagent **rete-package-reviewer** |
