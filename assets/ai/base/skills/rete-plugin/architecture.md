Guide users through **developing and debugging Rete.js plugins** using the Scope-based architecture.

## Core architecture

**Scope system fundamentals:**

- Plugins extend `Scope<Produces, Consumes>` where `Produces` defines output signal types and `Consumes` is an array of expected parent signal types
- Signal flow: Parent scopes forward signals to child scopes via `parentScope.use(childScope)`
- Type safety: TypeScript validates signal compatibility between parent-child relationships at compile time
- Context processing: Use `addPipe(context => context)` to process or modify signals

**Signal processing patterns:**

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

**Parent-child communication:**

- Access parent: `childScope.parentScope<ParentClass>(ParentClass)`
- Emit signals: `parentScope.emit(signal)` or `childScope.emit(signal)`
- Forward to children: Automatic when using `parentScope.use(childScope)`

## Plugin development patterns

**Basic plugin structure:**

- All plugins extend `Scope<Produces, Consumes>` with proper signal type definitions
- Define unique identifier and set up signal processing pipes in constructor using `addPipe()`
- Signal processing pipes can modify, forward, or block signals based on functionality

**Architecture components:**

- **Presets:** Pre-configured bundles with `setup()` methods (classic editor, context menu, minimap)
- **Extensions:** Modular functionality without inheritance (keyboard shortcuts, area extensions, history)
- **Framework integration:** Tailored extensions per framework (e.g. Area3DExtensions for 3D)

## Integration patterns

**Plugin registration:**

- Register plugins with appropriate parents using `use()` method
- Core plugins → editor, area plugins → area component, render plugins → renderer
- Hierarchical registration ensures proper signal flow and lifecycle management

**Multi-plugin coordination:**

- Plugins coordinate through the signal system using `emit()` and parent scope access
- Enable complex behaviors: history tracking, view updates, cross-plugin communication
- Access other plugins via `parentScope()` for dependency interactions

## Debugging and optimization

**Signal flow debugging:**

- Add logging pipes with `addPipe()` to monitor signal processing
- Monitor signal blocking by checking conditions and logging when signals are intentionally blocked
- Debug cross-plugin communication through parent scope interactions

**Type safety validation:**

- Use TypeScript strict mode for compile-time signal compatibility checking
- Define precise signal interfaces to catch integration issues early
- Verify parent-child signal type alignment: `Scope<Output, [ParentOutput]>`

## Advanced patterns

**Custom signal types:**

- Define domain-specific events using TypeScript union types
- Enable type-safe plugin communication and proper signal handling
- Include validation events, custom interactions, or plugin-specific state changes

**Plugin dependencies:**

- Access dependency plugins through `parentScope()` for coordination
- Establish dependencies during initialization with proper TypeScript typing
- Useful for plugins requiring area management, history tracking, or core functionality
