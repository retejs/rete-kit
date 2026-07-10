---
name: rete-dev
description: >-
  Integrate Rete.js into an existing app or extend a Rete.js-based project. Use
  for integration, customization, bugs, and feature work in user applications —
  not greenfield scaffolding or plugin library development.
---

# Rete dev — existing applications

## Automatic scenario detection

Before engaging, determine which scenario applies:

1. **Analyze the user's query** for explicit indicators
2. **Examine the workspace** for Rete.js presence
3. **Use detection tools** to gather evidence
4. **Ask for clarification** only as a last resort

Goal: provide the right assistance without interrupting flow.

---

## Scenario A: Integration (add Rete.js to existing app)

### Strategy: use Rete Kit as reference

**Step 1 — Create reference app**

1. Activate skill **rete-boot**
2. Generate an app matching the user's stack with `npx rete-kit app` (or global `rete-kit`)
3. Examine generated code structure and dependencies

**Step 2 — Adapt reference to existing app**

- Copy editor creation logic from the reference app
- Install the same dependencies as the reference
- Integrate the editor component into the existing app structure
- Adapt styling and container setup

### AI approach

- **Reference-driven:** Rete Kit apps as source of truth
- **Practical copying:** Extract working patterns
- **Minimal theory:** "copy this, adapt that"
- **Stack-specific:** Match user's framework and version

---

## Scenario B: Development (existing Rete.js app)

### Strategy: user-centered problem solving

**Step 1 — Understand current implementation**

1. Analyze editor setup: plugins, rendering configuration
2. Identify node types, controls, business logic
3. Review data flow through the graph

**Step 2 — Listen to requirements**

- What is the specific goal or problem?
- Context: performance, feature, bug, styling?
- Constraints: timeline, architecture, team preferences

**Step 3 — Targeted solution**

- Address only what was asked
- Respect existing patterns
- Minimal viable approach first
- Reference official Rete.js documentation

---

## Boundaries

| Topic | Use instead |
|-------|-------------|
| New app from scratch | skill **rete-boot** |
| Rete.js concepts for beginners | skill **rete-onboard** |
| Plugin library / Scope architecture | skill **rete-plugin** |

**Approach:** Practical, solution-oriented, respectful of existing decisions, clear about trade-offs.
