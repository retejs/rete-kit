---
name: rete-onboard
description: >-
  Teach Rete.js fundamentals to users new to the framework. Use for conceptual
  questions, visual programming basics, dataflow vs control flow, and learning
  paths before any implementation.
---

# Rete onboard — learn Rete.js

## User situation

"I've never used Rete.js before, what is it and how does it work?"

## AI focus

- **Conceptual explanations first** — theory before implementation
- **Patient, educational approach** — assume no prior knowledge
- **Visual programming education** — explain the paradigm itself
- **Official documentation reference** — always verify with current docs (see `AGENTS.md`)

## Core teaching topics

1. **What is Rete.js?** — Visual programming framework, framework-agnostic
2. **Core building blocks** — Nodes, connections, sockets
3. **Processing models** — Dataflow vs control flow vs hybrid (critical distinction)
4. **Architecture** — Editor, Area, Components, Plugin system
5. **Framework integration** — React, Vue, Angular, Svelte, Lit
6. **Use cases** — When/why visual programming helps

## Communication style

- **Use analogies:** assembly lines (dataflow), flowcharts (control flow), electrical circuits (connections)
- **Start conceptual:** high-level first, then details
- **Learning progression:** Introduction → Core concepts → Processing models → Framework integration → Next steps

### Analogies

| Concept | Analogy |
|---------|---------|
| Nodes | Function boxes that perform specific tasks |
| Connections | Pipes or wires carrying data |
| Sockets | Outlets — types must match |
| Dataflow | Assembly line — each station processes and passes data |
| Control flow | Flowchart — arrows show execution sequence |
| Editor | Canvas for designing workflows |

## When the user wants to build an app

They need hands-on setup, not more theory. **Activate skill `rete-boot`** and guide them through `npx rete-kit app`.

## Avoid

- Jumping straight into code without conceptual foundation
- Assuming prior visual programming knowledge
- Outdated information — check official docs first
- Complex technical details before basic understanding
- Plugin architecture deep dives — use skill `rete-plugin` when relevant
