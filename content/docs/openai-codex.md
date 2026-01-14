---
title: "OpenAI Codex CLI Custom Commands"
date: "2025-12-25"
excerpt: "How to create custom slash commands and configure tools in OpenAI Codex CLI."
---

# OpenAI Codex CLI Custom Commands

OpenAI Codex CLI is a lightweight coding agent that runs in your terminal. It supports custom prompts, MCP integration, and automation via the exec command.

## Custom Slash Commands

Custom prompts turn Markdown files into reusable slash commands triggered with `/prompts:<name>`.

### Directory Structure

```
~/.codex/
├── config.toml         # Global configuration
└── prompts/            # Custom prompts directory
    ├── draftpr.md
    ├── fixbug.md
    └── review.md
```

### Creating a Custom Prompt

```markdown
---
description: Prep a branch, commit, and open a draft PR
argument-hint: [FILES=<paths>] [PR_TITLE="<title>"]
---

Create a branch named `dev/<feature_name>` for this work.
If files are specified, stage them first: $FILES.
Commit the staged changes with a clear message.
Open a draft PR with title: $PR_TITLE
```

### Placeholder System

| Placeholder | Description |
|-------------|-------------|
| `$1` - `$9` | Positional arguments (space-separated) |
| `$ARGUMENTS` | All arguments combined |
| `$FILE`, `$TICKET_ID` | Named placeholders (uppercase) |

### Usage Examples

```bash
# Using positional arguments
/prompts:fixbug component-name error-message

# Using named arguments
/prompts:draftpr FILES="src/pages/index.tsx" PR_TITLE="Add hero section"
```

## Configuration

Global settings in `~/.codex/config.toml`:

```toml
# Enable web search
search = true

# Default model
model = "gpt-4"

# Custom instructions
system_prompt = "You are a senior developer..."
```

## Built-in Tools

| Tool | Status | Description |
|------|--------|-------------|
| `shell` | Stable, on by default | Run terminal commands |
| `view_image` | Stable, on by default | Analyze local images |
| `web_search` | Opt-in | Search the web |

## MCP Integration

Connect external tools via Model Context Protocol:

```toml
# ~/.codex/config.toml

[mcp.servers.github]
command = "mcp-server-github"
args = ["--token", "$GITHUB_TOKEN"]

[mcp.servers.database]
url = "http://localhost:3001/mcp"
```

Manage MCP servers with CLI commands:

```bash
codex mcp list
codex mcp add server-name
codex mcp remove server-name
```

## Automation with Exec

Run Codex non-interactively for scripting:

```bash
# Single task
codex exec "Fix the TypeScript errors in src/utils.ts"

# With file output
codex exec "Generate API documentation" > docs/api.md

# In CI/CD pipelines
codex exec "Review this PR for security issues" --json
```

## Resources

- [Codex CLI Documentation](https://developers.openai.com/codex/cli)
- [Codex CLI GitHub](https://github.com/openai/codex)
- [Configuration Guide](https://developers.openai.com/codex/local-config/)
