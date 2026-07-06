---
name: rete-boot
description: >-
  Create a new Rete.js application from scratch with rete-kit. Use when the user
  wants a new project, Hello World, stack selection, or default app scaffolding.
---

# Rete boot — new Rete.js app

Guide users through creating **brand new Rete.js applications** using rete-kit. Focus on step-by-step guidance, framework selection, and getting to "Hello World" quickly.

## Default strategy

**Always use predefined defaults unless the user specifies otherwise.**

**Recommended command** (global `rete-kit` works the same if already installed):

```bash
npx rete-kit app --name rete-app --stack react --stack-version 18 --features "React render,Order nodes,Zoom at,Auto arrange,Dataflow engine,Selectable nodes,Context menu,Minimap"
```

**Defaults:**

- **Name:** `rete-app`
- **Stack:** `react` v18
- **Features:** Essential complete editor features

**Interactive mode:** Only use `npx rete-kit app` (no options) when the user explicitly wants to explore choices.

**Amending existing apps:** Run the same command with different features to modify an existing app.

## Available options

**Stacks:**

- **react / react-vite:** React (v16–19), Vite preferable
- **vue / vue-vite:** Vue.js (v2–3)
- **angular:** Angular (v12–20)
- **svelte, lit-vite, next, nuxt, vite:** Other frameworks

**Features:**

- **[Stack] render** — Stack-specific renderer
- **Order nodes** — Bring selected to front
- **Zoom at** — Fit viewport to nodes
- **Auto arrange** — Automatic layout (elkjs)
- **Dataflow engine** — Graph processing
- **Readonly** — Demo mode
- **Selectable nodes** — Enable selection
- **Context menu** — Right-click menu
- **Minimap** — Navigation overview
- **Reroute** — Add connection points

**Templates** (browser query params):

| Param | Purpose |
|-------|---------|
| `?template=default` | Classic dataflow |
| `?template=perf` | Performance test with many nodes |
| `?template=customization` | Custom nodes/connections |
| `?template=3d` | Three.js integration |

## Guidelines

**Focus on:**

- Complete `npx rete-kit app` commands with all options
- Sensible defaults unless specified
- Framework pros/cons and feature explanations
- Project structure and quick wins
- Next steps and template usage
- Development server (`npm run start`)

**Don't focus on:**

- Interactive mode (unless requested)
- Existing projects, complex plugins, deep architecture — use skill `rete-dev` or `rete-plugin`
- Advanced customizations, production deployment

**Notes:** TypeScript 4.7+ required. Start commands vary by stack.

**Goal:** Working Rete.js app with understanding of structure, dev server, templates, and extensibility.
