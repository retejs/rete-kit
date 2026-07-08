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

Standard flow (no `--deps-alias needed`)
Use this when you can run E2E against already published npm packages (no local/unpublished tarballs to substitute).
```bash
npx rete-qa init
npx rete-qa test
```

Test against the stack relevant to the change (e.g. Vue stack for `area-plugin` fixes) — not full matrix unless explicitly requested.

Workflow with `--deps-alias` (local plugin tarballs):
Use this when `rete-qa` must test against unpublished/local plugin code.

1. **Build plugins**
   In each plugin repo:
   ```bash
   rete build -c rete.config.ts
   # or: npm run build
   ```

2. **Pack from `dist/` (important)**
   Run `npm pack` from the folder that contains published entrypoints (`package.json`, `*.esm.js`, `*.common.js`, `_types/`, etc.). In most repos this is `dist/`:
   ```bash
   cd repositories/<plugin-name>/dist
   npm pack
   # produces <plugin-name>-<version>.tgz
   ```

3. **Create `dependencies.json`**
   Create a JSON file next to where you run `rete-qa`:
   ```json
   {
     "rete-area-plugin": "./repositories/area-plugin/dist/rete-area-plugin-2.3.0.tgz",
     "rete-area-3d-plugin": "./repositories/area-3d-plugin/dist/rete-area-3d-plugin-2.0.4.tgz"
   }
   ```

4. **Initialize (or re-initialize) generated projects**
   ```bash
   npx rete-qa init -s vue -sv 3 --deps-alias dependencies.json
   ```

5. **Run tests**
   ```bash
   npx rete-qa test -s vue -sv 3 --deps-alias dependencies.json
   ```

If `rete-qa test` fails with `index.html not found`, it usually means `init` didn’t finish successfully for the requested stack/version—check the `init` logs first.

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
