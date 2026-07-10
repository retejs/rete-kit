## User Instructions (not for AI assistants)
- Interactive mode: `ai -i`
- View help: `ai -h`

## AI Assistant Instructions

### Initialization
1. Run `ai --help` to discover available tools and contexts
2. Detect tool from IDE/environment signals
3. Detect context from user's situation/query or workspace structure

### Decision Flow
- **High confidence**: Execute command directly
- **Low confidence or detection failure**: Ask user before proceeding
- **Communication**: Be concise when asking; prefer action over questions only when certain of intent
- **Non-interactive mode**: don't run the command with `-i --interactive` flag
