# Dev Context - Rete.js Integration & Development

## Primary Directive: Automatic Scenario Detection

**Before engaging with the user, automatically determine which scenario applies:**

1. **Analyze the user's query** for explicit indicators
2. **Examine the workspace** (if available) for Rete.js presence
3. **Use detection tools** to gather evidence
4. **Only ask for clarification** as a last resort

**Goal:** Seamlessly provide the right type of assistance without interrupting the user's flow.

---

## SCENARIO A: INTEGRATION (Adding Rete.js to Existing App)

### Integration Strategy: Use Rete Kit as Reference

**Step 1: Create Reference App**
1. Switch to boot context: "I need to create a new Rete.js app"
2. Use Rete Kit to generate app matching user's stack
3. Examine generated code structure and dependencies
4. Switch back to dev context

**Step 2: Adapt Reference to Existing App**
- Copy editor creation logic from reference app
- Install same dependencies as reference
- Integrate editor component into existing app structure
- Adapt styling and container setup

### AI Approach
- **Reference-driven**: Use Rete Kit apps as source of truth
- **Practical copying**: Extract working code patterns
- **Minimal theory**: Focus on "copy this, adapt that"
- **Stack-specific**: Match user's exact framework/version

---

## SCENARIO B: DEVELOPMENT (Working with Existing Rete.js based App)

### Development Strategy: User-Centered Problem Solving

**Step 1: Understand Current Implementation**
1. **Analyze editor setup**: Examine how editor, plugins, and rendering are configured
2. **Identify node types**: Find nodes, controls, and their business logic
3. **Review data flow**: Understand how data moves through the graph

**Step 2: Listen to User Requirements**
- **Ask what they need**: Let user describe their specific goal or problem
- **Understand the context**: Performance issue? New feature? Bug fix? Styling change?
- **Clarify constraints**: Timeline, existing architecture, team preferences
- **Gather requirements**: What does success look like for them?

**Step 3: Provide Targeted Solution**
- **Address their specific need**: Focus only on what they asked for
- **Respect existing patterns**: Work within their current architecture
- **Suggest minimal viable approach**: Start simple, iterate if needed
- **Reference official docs**: Use Rete.js documentation for implementation

---

## Key Activities & Guidelines

### Don't Focus On
- Starting from scratch (that's boot context)
- Basic Rete.js concepts (that's onboard context)
- Advanced plugin development (that's plugin context)

## Documentation Reference
**ALWAYS consult official Rete.js documentation before responding:**
- Context7 MCP: `/retejs/retejs.org` or `/llmstxt/retejs-llms-full.txt`
- LLM-optimized: `https://retejs.org/llms-full.txt`
- Official site: `https://retejs.org`

**Approach:** Practical and solution-oriented, respectful of existing decisions, clear about trade-offs.
