# Rete.js AI setup — step 1 complete

You are running the **rete-kit ai** workflow. Step 1 (**emit**) just finished.

| Path | Contents | After IDE install |
|------|----------|-------------------|
| `.rete/ai/AGENTS.md` | Project instructions reference | **Remove** after merge to project root |
| `.rete/ai/skills/` | Skill staging | **Remove** after install — target path is in the tool `setup.md` |
| `.rete/ai/agents/` | Subagent staging | **Remove** when installed to the IDE; **keep** under `.rete/ai/agents/` only when the tool prompt says on-demand or fallback |
| `.rete/scripts/` | Org tooling (`clone-org`, `source-context`) | **Keep** — run `npm install` during setup |

During setup, read **`.rete/ai/AGENTS.md`** and **write or merge** project `AGENTS.md` manually (add only missing reference content if the file already exists). **Use only `.rete/`** — do not read from the rete-kit package.

Tool-specific prompts (`setup.md`, `commit.md`) stay in the **rete-kit package**.

**`.rete/` is local tooling** — do not commit it. If the project has a `.gitignore`, emit adds `.rete/` there automatically. Run `rete-kit ai` again anytime to refresh from the installed kit (existing `.rete/` is recreated; `.rete/scripts/.env` is preserved when present).

**`gh-mirror/` is not created yet** — offered later via skill **rete-setup** if the user agrees.

---

## Continue now — agent-driven

**Do not stop. Do not ask the user to run shell commands** — you run them (or read prompt files directly). Only ask when the host tool id is genuinely unknown.

### 2. Detect host tool

Infer tool id from your environment. Default to what you are running in now.

### 3. Setup

```bash
rete-kit ai --tool <tool>
```

Install from `.rete/ai/` into the host IDE per the setup prompt printed by that command. **Merge** `.rete/ai/AGENTS.md` into project instructions per that prompt. Run `cd .rete/scripts && npm install`.

### 4. Commit

```bash
rete-kit ai --tool <tool> --commit
```

Follow the commit prompt printed by that command for cleanup. **Do not** guess: some tools remove all of `.rete/ai/`; others remove only `.rete/ai/skills/` or per-file staging and **keep** `.rete/ai/agents/`. Always **keep** `.rete/scripts/`.

### 5–6. Optional org context

Per the tool **commit** prompt (optional steps there). If the user agrees to `gh-mirror/`, follow skill **`rete-setup`**. For editable library clones, follow skill **`rete-clone`**.

### 7. Report

Summarize: IDE setup done, project instructions merged (path per tool — e.g. `AGENTS.md`, `copilot-instructions.md`), what was removed vs kept under `.rete/ai/`, `.rete/scripts/` installed, whether `gh-mirror/` was synced, working copies (path if any), or what was declined.
