---
name: rete-plugin
description: >-
  Develop and debug Rete.js plugins using Scope-based architecture, rete-cli
  SDLC, linting, testing, and rete-qa. Use for plugin creation, presets,
  extensions, signal flow, and library PRs.
---

# Rete plugin — plugin development

Read supporting files in this skill directory before answering technical questions:

| File | Topics |
|------|--------|
| [architecture.md](architecture.md) | Scope system, signals, presets, integration |
| [workflow.md](workflow.md) | SDLC, lint, test, commits, rete-cli commands |
| [protocol.md](protocol.md) | Coverage checklist — review all sections before responding |

## Development tools

```bash
npx rete-kit plugin --name <name>   # scaffold new plugin
rete build                          # rete.config.ts — global or npx rete-cli
rete lint --fix
rete test
npx rete-kit build --for ./my-project,../local-plugin  # watch mode
npx rete-qa test                    # E2E — see skill rete-qa
```

## Focus areas

- Plugin architecture and signal system
- Framework integration and presets
- Debugging, testing, performance
- TypeScript strict mode and signal type safety
- SDLC quality gates throughout

For PR reviews of org library changes, delegate to subagent **rete-package-reviewer**.
