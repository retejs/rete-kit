## Development lifecycle (SDLC)

**Continuous development workflow:**

- **Frequent validation:** Run build, lint, and test commands frequently during development
- **Early detection:** Address problems immediately rather than accumulating technical debt
- **Test-driven development (TDD):** Write tests before implementing features
  - Tests serve as precise specifications
  - Immediate feedback and regression catching
  - Clear boundaries for AI-assisted development
  - Living documentation of plugin behavior
- **Automated quality gates:** CI/CD pipelines with comprehensive validation

**Linting** *(critical for type safety):*

Running the linter (`rete lint --fix`) is crucial after making changes. It identifies issues and performs type checking. Always prioritize linting as part of your workflow.

**Setup tests:**

Unit tests use Jest via `rete-cli` — `rete test`. No manual setup required.

**Core development commands:**

```bash
rete build  # --config rete.config.ts, see Rete CLI docs
rete lint   # run after every change
rete-kit build --for ./my-project,../local-plugin  # watch mode — npx rete-kit or global
```

**Quality assurance:**

```bash
npx rete-qa test  # --deps-alias dependencies.json — see skill rete-qa
```

**Best practices:**

- **Incremental development:** Build, lint and test after each significant change
- **Cross-framework testing:** Use `npx rete-qa` for affected stacks (not full matrix by default)
- **Dependency management:** Use `npx rete-kit build` for local development with watch mode
- **Documentation sync:** Keep API docs (JSDoc) updated with code changes
- **Quality gates:** Conventional commits, automated testing, semantic versioning

**Commit guidelines:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`
- Subject line: maximum 100 characters
- Examples:
  - `feat(plugin): add signal processing pipe for custom events`
  - `fix(area): resolve signal propagation issue in nested scopes`
  - `docs(api): update JSDoc comments for Scope class methods`

## Documentation reference

Consult official Rete.js documentation before responding (see `AGENTS.md`).
