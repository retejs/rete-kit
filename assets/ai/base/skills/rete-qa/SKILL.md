---
name: rete-qa
description: >-
  Validate Rete.js changes locally (build, lint, test) and trigger remote GHA
  regression with branch dependencies. Use before merge, for PR gates, or when
  fixing cross-stack regressions.
---

# Rete QA — validation and regression

## CLI tools (npm — not cloned by default)

`rete-qa`, `rete-kit`, and `rete-cli` are **published npm packages**. Use a global install or `npx` — do not assume a local git clone:

```bash
npx rete-qa test
# optional: --deps-alias dependencies.json

npx rete-kit app ...
npx rete-cli build   # in a library repo that uses rete-cli
```

Clone `rete-qa` / `rete-kit` / `rete-cli` from GitHub **only** when contributing to those tools themselves (via skill **rete-clone**).

## Local validation (library under edit)

In the changed **library** repo (cloned working copy or the user's project):

```bash
rete build
rete lint
rete test
```

(`rete` comes from `rete-cli` — global or `npx`.)

For app-level checks, use the generated project or `npx rete-qa test` as appropriate.

## rete-qa E2E

From any directory (no `rete-qa` repo clone required):

```bash
npx rete-qa test
# optional: --deps-alias dependencies.json
```

Test against the stack relevant to the change (e.g. angular stack for `angular-plugin` fixes) — not full matrix unless explicitly requested.

## Remote regression (GHA)

Trigger org workflow with branch dependencies on the PR:

```
deps: retejs/<repo>#<branch>
```

Workflows live in [retejs/rete-qa](https://github.com/retejs/rete-qa) (`regression.yml`, `prepare-deps.yml`) — triggered remotely, not from a local clone.

**Active time ~0.25h:** open/trigger workflow, confirm green on PR.

## When to use

| Phase | Action |
|-------|--------|
| During fix | Local build/lint/test after each significant change |
| Before merge | `npx rete-qa test` for affected stack |
| PR gate | Comment trigger / bot → GHA regression with branch deps |

Run this workflow directly — local gates first, then remote regression when appropriate. Report commands, pass/fail, affected stack(s), and blockers before merge.
