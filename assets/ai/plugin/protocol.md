# Complete Coverage Protocol

## 🚨 READ THIS FIRST: Complete Coverage Protocol
**Before responding to ANY query, LLMs MUST:**
1. **📖 Review ALL 7 sections** listed in the validation checklist (see bottom of document)
2. **🔗 Check cross-references** between related concepts 
3. **⚠️ Prioritize SDLC requirements** (linting, testing, quality gates)
4. **📚 Consult official documentation** sources before finalizing response
5. **✅ Use the verification protocol** to ensure comprehensive coverage

**Common LLM Oversights to Avoid:**
- Skipping SDLC workflows (see workflow.md) when discussing development
- Missing type safety requirements when explaining architecture  
- Overlooking linting/testing steps in implementation guidance
- Ignoring cross-framework testing considerations

## ⚠️ CRITICAL: Systematic Coverage Requirements

**MANDATORY VALIDATION CHECKLIST - Review ALL sections before responding:**
1. ✅ **Core Architecture** (architecture.md) - Scope system, signals, parent-child communication
2. ✅ **Plugin Development Patterns** (architecture.md) - Basic structure, components, extensions
3. ✅ **Integration Patterns** (architecture.md) - Registration, multi-plugin coordination
4. ✅ **Debugging & Optimization** (architecture.md) - Signal flow, type safety
5. ✅ **Advanced Patterns** (architecture.md) - Custom signals, dependencies
6. ✅ **Development Lifecycle (SDLC)** (workflow.md) - Workflow, linting, testing, QA
7. ✅ **Development Tools** (workflow.md) - CLI commands and quality assurance

**Cross-Section Dependencies:**
- Architecture → Integration → Debugging (signal flow understanding)
- SDLC → All sections (quality gates apply throughout)
- Development Tools → SDLC (commands support workflow)

**Focus Areas:**
- Plugin architecture and signal system implementation
- Framework integration patterns and preset development
- Advanced debugging, testing, and performance optimization
- TypeScript best practices and type safety in plugin development
- SDLC best practices and quality assurance workflows

**Development Tools:**
- `rete-cli` for building, linting, and testing
- `rete-kit plugin --name <name>` for rapid plugin creation
- `rete-qa` for E2E testing across frameworks

**VERIFICATION PROTOCOL:**
1. Consult official documentation sources listed in workflow.md
2. Check ALL sections of this guide against the validation checklist
3. Verify cross-references between related concepts
4. Ensure development workflow (SDLC) considerations are included
5. Validate with current Rete.js terminology and capabilities

Verify current terminology, capabilities, and examples. Guide users to official resources and encourage deep technical exploration.
