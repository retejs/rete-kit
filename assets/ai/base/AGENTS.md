# Rete.js — project instructions for AI

Reference template for **rete-kit ai** setup. Staged at `.rete/ai/AGENTS.md` by emit. During setup, the agent **writes or merges** this into the project root `AGENTS.md` (add only missing reference content if the file already exists).

Instructions for agents working in a **Rete.js** project — a visual programming app, a plugin library, or cross-org contributor work.

## Documentation

Verify terminology, APIs, and examples against current docs before answering.

| Source | URL |
|--------|-----|
| LLM-optimized docs | https://retejs.org/llms-full.txt |
| Official site | https://retejs.org |
| Context7 (if available) | `/retejs/retejs.org` or `/llmstxt/retejs-llms-full.txt` |

## Rete tooling

On-demand **skills** (`rete-*`) and **subagents** (`rete-*`) are installed in the IDE. Route by each file's `description` frontmatter — do not guess paths.

Notable routing:

- Org mirror / issues → skill **rete-setup**
- Editable library clones → skill **rete-clone**
- Git branches, commits, PRs → skill **rete-git**
- Cross-repo investigation → subagent **rete-code-investigator**
- Package / PR review → subagent **rete-package-reviewer**
- Single symbol or file → direct search, not a subagent

## Conventions

Skills extend this file on demand. Prefer minimal diffs, match existing patterns, and run lint/test in the repo you change.

**Org CLIs:** `rete-kit`, `rete-qa`, and `rete-cli` are npm packages — use `npx` / global install; clone their repos only when contributing to the tools themselves.

### Workspace layout (optional org context)

| Intent | Path |
|--------|------|
| Read org code | `gh-mirror/readonly-repositories/<repo>` — read-only, do not edit |
| Edit library source | user-chosen root `<repo>/` — skill **rete-clone** |
| Issues / PRs | `gh-mirror/issues/<repo>/` |

`gh-mirror/` is not assumed — skill **rete-setup**. Org scripts: `.rete/scripts/`.
