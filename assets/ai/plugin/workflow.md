# Development Workflow

## Development Lifecycle (SDLC)

**Continuous Development Workflow:**
- **Frequent Validation**: Run build, lint, and test commands frequently during development to catch issues early
- **Early Detection**: Address problems immediately rather than accumulating technical debt
- **Test-Driven Development (TDD)**: Write tests before implementing features to ensure robust plugin behavior
  - **Clear Requirements**: Tests serve as precise specifications for expected behavior
  - **Immediate Feedback**: Quickly validate implementations and catch regressions
  - **AI Development**: Tests provide clear boundaries and validation for AI-assisted development
  - **Documentation as Code**: Tests act as living documentation of plugin functionality
- **Automated Quality Gates**: Use CI/CD pipelines with comprehensive validation

**Linting:** *(Critical for Type Safety - see Debugging & Optimization section)*
Running the linter (`rete lint --fix`) is crucial after making changes to ensure code quality and consistency. It helps identify current issues in the codebase before proceeding with fixes or further development. Additionally, it performs type checking to catch type-related issues early. Always prioritize linting as part of your workflow.

**Setup tests:**
Unit tests are executed using Jest, which is integrated via `rete-cli` - `rete test`. No manual setup is required—just use the provided CLI commands for testing.

**🔧 Core Development Commands:** *(ESSENTIAL - Use Frequently)*
```bash
rete build  # --config rete.config.ts, see Rete CLI docs
rete lint   # ⚠️ CRITICAL: Run after every change
rete-kit build --for ./my-project,../local-plugin  # Watch mode, see Rete Kit docs
```

**🧪 Quality Assurance Process:** *(Required for Production)*
```bash
rete-qa test  # --deps-alias dependencies.json, see Quality Assurance docs
```



**📋 Best Practices:** *(Follow These Always)*
- **🔄 Incremental Development**: Build, lint and test after each significant change
- **🌐 Cross-Framework Testing**: Use Rete QA to validate across React, Vue, Angular, Svelte  
- **📦 Dependency Management**: Use `rete-kit build` for local development with watch mode
- **📖 Documentation Sync**: Keep API docs (JSDoc) updated with code changes
- **✅ Quality Gates**: Use conventional commits, automated testing, and semantic versioning

## Documentation Reference
**ALWAYS consult official Rete.js documentation before responding:**
- Context7 MCP: `/retejs/retejs.org` or `/llmstxt/retejs-llms-full.txt`
- LLM-optimized: `https://retejs.org/llms-full.txt`
- Official site: `https://retejs.org`
