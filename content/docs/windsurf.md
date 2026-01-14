---
title: "Windsurf Rules, Workflows & Memories"
date: "2025-12-25"
excerpt: "How to configure rules, workflows, and memories in Windsurf (formerly Codeium)."
---

# Windsurf Rules, Workflows & Memories

Windsurf (formerly Codeium) is an AI-native IDE with a powerful Cascade agent. It supports Rules, Workflows, and a persistent Memory system for customization.

## Core Concepts

| Feature | Purpose | Persistence |
|---------|---------|-------------|
| **Rules** | Define coding standards | Per-project |
| **Workflows** | Automate repetitive tasks | Shared via commands |
| **Memories** | Store project knowledge | Cross-session |

## Rules

Rules define how Cascade writes and reviews code.

### Configuration Location

```
.windsurf/
└── rules.md
```

### Rule Format

```markdown
# Project Rules

## Code Style
- Use 2-space indentation
- Prefer arrow functions
- Use template literals over string concatenation

## Architecture
- Follow the repository pattern for data access
- Keep components under 200 lines
- Separate business logic from UI components

## Testing
- Write unit tests for all utility functions
- Use React Testing Library for component tests
- Maintain >80% code coverage
```

## Workflows

Custom Workflows (introduced in Wave 8) automate repetitive tasks as slash commands.

### Creating a Workflow

```markdown
<!-- .windsurf/workflows/deploy.md -->
---
name: deploy
description: Build and deploy to staging
---

1. Run the build command: `pnpm build`
2. Run tests: `pnpm test`
3. Deploy to staging: `pnpm deploy:staging`
4. Notify the team in Slack
```

### Using Workflows

```
/workflow:deploy
```

### Best Practice

Use Windsurf Workflows for local automation and GitHub Actions for CI/CD. Together they provide end-to-end automation.

## Memories

Memories are persistent records of project knowledge that Cascade remembers across sessions.

### Memory Storage

```
~/.codeium/windsurf/memories/
```

### Memory Types

| Type | Example |
|------|---------|
| User Stories | "Users should be able to export data as CSV" |
| Architecture Decisions | "We use Redux Toolkit for state management" |
| Technical Standards | "All API responses follow JSON:API spec" |
| Troubleshooting | "If build fails, clear .next cache first" |

### Managing Memories

Cascade automatically creates memories from conversations. You can also:

- View memories in Windsurf settings
- Delete outdated memories
- Export/import memories between projects

## Cascade Agent

Cascade is Windsurf's agentic assistant with deep codebase understanding.

### Capabilities

- Multi-step edit planning
- Tool usage (terminal, file system)
- Real-time awareness of your actions
- Repository-wide context understanding

### Using Cascade

```
@cascade refactor the authentication module to use JWT
```

Cascade will:
1. Analyze the current implementation
2. Plan the refactoring steps
3. Execute changes across files
4. Run tests to verify

## MCP Integration

Connect external tools via Model Context Protocol:

### Configuration

In Windsurf settings, add MCP servers:

```json
{
  "mcp": {
    "servers": {
      "github": {
        "command": "mcp-server-github"
      },
      "database": {
        "url": "http://localhost:3001/mcp"
      }
    }
  }
}
```

### Claude Code Integration

Windsurf can use Claude Code as an MCP server:

```json
{
  "mcp": {
    "servers": {
      "claude-code": {
        "command": "claude",
        "args": ["mcp-serve"]
      }
    }
  }
}
```

## Resources

- [Windsurf Documentation](https://docs.windsurf.com)
- [Codeium Blog](https://codeium.com/blog)
- [Windsurf Community Discord](https://discord.gg/codeium)
