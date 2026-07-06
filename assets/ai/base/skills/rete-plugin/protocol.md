## Read this first: complete coverage protocol

**Before responding to ANY plugin query, review ALL sections in the validation checklist below.**

1. Review all 7 sections listed in the checklist
2. Check cross-references between related concepts
3. Prioritize SDLC requirements (linting, testing, quality gates)
4. Consult official documentation sources before finalizing
5. Use the verification protocol to ensure comprehensive coverage

**Common oversights to avoid:**

- Skipping SDLC workflows (see workflow.md) when discussing development
- Missing type safety requirements when explaining architecture
- Overlooking linting/testing steps in implementation guidance
- Ignoring cross-framework testing considerations

## Mandatory validation checklist

Review ALL sections before responding:

1. **Core architecture** ([architecture.md](architecture.md)) — Scope system, signals, parent-child communication
2. **Plugin development patterns** ([architecture.md](architecture.md)) — Basic structure, components, extensions
3. **Integration patterns** ([architecture.md](architecture.md)) — Registration, multi-plugin coordination
4. **Debugging and optimization** ([architecture.md](architecture.md)) — Signal flow, type safety
5. **Advanced patterns** ([architecture.md](architecture.md)) — Custom signals, dependencies
6. **Development lifecycle (SDLC)** ([workflow.md](workflow.md)) — Workflow, linting, testing, QA
7. **Development tools** ([workflow.md](workflow.md)) — CLI commands and quality assurance

**Cross-section dependencies:**

- Architecture → Integration → Debugging (signal flow understanding)
- SDLC → All sections (quality gates apply throughout)
- Development tools → SDLC (commands support workflow)

**Verification protocol:**

1. Consult official documentation (see `AGENTS.md`)
2. Check ALL sections against the validation checklist
3. Verify cross-references between related concepts
4. Ensure SDLC considerations are included
5. Validate with current Rete.js terminology and capabilities
