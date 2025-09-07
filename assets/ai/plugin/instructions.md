# Plugin Development Context

Guide users through **developing and debugging Rete.js plugins** using the Scope-based architecture.

## Core Architecture

**Scope System Fundamentals:**
- Plugins extend `Scope<Produces, Consumes>` where `Produces` defines output signal types and `Consumes` is an array of expected parent signal types
- Signal flow: Parent scopes forward signals to child scopes via `parentScope.use(childScope)`
- Type safety: TypeScript validates signal compatibility between parent-child relationships at compile time
- Context processing: Use `addPipe(context => context)` to process or modify signals

**Signal Processing Patterns:**
```ts
// Basic signal handling
scope.addPipe(context => {
  if (context.type === 'eventname') {
    return { ...context, extraData: true } // Signal modification
    // return // Block propagation (no value)
  }
  return context
})
```

**Parent-Child Communication:**
- Access parent: `childScope.parentScope<ParentClass>(ParentClass)`
- Emit signals: `parentScope.emit(signal)` or `childScope.emit(signal)`
- Forward to children: Automatic when using `parentScope.use(childScope)`

## Plugin Development Patterns

**Basic Plugin Structure:**
- All plugins extend `Scope<Produces, Consumes>` with proper signal type definitions
- Define unique identifier and set up signal processing pipes in constructor using `addPipe()`
- Signal processing pipes can modify, forward, or block signals based on functionality

**Architecture Components:**
- **Presets**: Pre-configured bundles with `setup()` methods for common functionality (classic editor, context menu, minimap)
- **Extensions**: Modular functionality applied without inheritance (keyboard shortcuts, area extensions, history management)
- **Framework Integration**: Tailored extensions for specific frameworks (Area3DExtensions for 3D rendering)



## Integration Patterns

**Plugin Registration:**
- Register plugins with appropriate parents using `use()` method
- Core plugins → editor, area plugins → area component, render plugins → renderer
- Hierarchical registration ensures proper signal flow and lifecycle management

**Multi-Plugin Coordination:**
- Plugins coordinate through the signal system using `emit()` and parent scope access
- Enable complex behaviors like history tracking, view updates, and cross-plugin communication
- Access other plugins via `parentScope()` for dependency interactions

## Debugging & Optimization

**Signal Flow Debugging:**
- Add logging pipes with `addPipe()` to monitor signal processing
- Monitor signal blocking by checking conditions and logging when signals are intentionally blocked
- Debug cross-plugin communication through parent scope interactions

**Type Safety Validation:**
- Use TypeScript strict mode for compile-time signal compatibility checking
- Define precise signal interfaces to catch integration issues early
- Verify parent-child signal type alignment: `Scope<Output, [ParentOutput]>`

## Advanced Patterns

**Custom Signal Types:**
- Define domain-specific events using TypeScript union types
- Enable type-safe plugin communication and proper signal handling
- Include validation events, custom interactions, or plugin-specific state changes

**Plugin Dependencies:**
- Access dependency plugins through `parentScope()` for coordination
- Establish dependencies during initialization with proper TypeScript typing
- Useful for complex plugins requiring area management, history tracking, or core functionality

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

**Core Development Commands:**
```bash
rete build  # --config rete.config.ts, see Rete CLI docs
rete lint  # Independent linting
rete-kit build --for ./my-project,../local-plugin  # Watch mode, see Rete Kit docs
```

**Quality Assurance Process:**
```bash
rete-qa test  # --deps-alias dependencies.json, see Quality Assurance docs
```



**Best Practices:**
- **Incremental Development**: Build, lint and test after each significant change
- **Cross-Framework Testing**: Use Rete QA to validate across React, Vue, Angular, Svelte
- **Dependency Management**: Use `rete-kit build` for local development with watch mode
- **Documentation Sync**: Keep API docs (JSDoc) updated with code changes
- **Quality Gates**: Use conventional commits, automated testing, and semantic versioning

## Documentation Reference
**ALWAYS consult official Rete.js documentation before responding:**
- Context7 MCP: `/retejs/retejs.org` or `/llmstxt/retejs-llms-full.txt`
- LLM-optimized: `https://retejs.org/llms-full.txt`
- Official site: `https://retejs.org`

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

Verify current terminology, capabilities, and examples. Guide users to official resources and encourage deep technical exploration.
