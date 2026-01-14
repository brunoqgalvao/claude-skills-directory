---
title: "Claude Code Skills & Commands"
date: "2025-12-25"
excerpt: "How to create and use skills, custom slash commands, and plugins in Claude Code."
---

# Claude Code Skills & Commands

Claude Code is Anthropic's official CLI for Claude. It supports Agent Skills, custom slash commands, plugins, and hooks for maximum customization.

## Agent Skills

Agent Skills are folders containing instructions, scripts, and resources that Claude loads automatically when relevant to your task.

### Skill Structure

```
.claude/skills/
└── my-skill/
    ├── SKILL.md        # Required: metadata and instructions
    ├── templates/       # Optional: code templates
    ├── scripts/         # Optional: executable scripts
    └── resources/       # Optional: additional files
```

### SKILL.md Format

```markdown
---
name: my-skill
description: Brief description of what this skill does
---

## Instructions

Detailed instructions for Claude on how to use this skill.

## Examples

Show examples of expected behavior.

## Guidelines

Any constraints or best practices.
```

### Installing Skills

Skills can be installed via the plugin marketplace:

```bash
claude /plugin marketplace add anthropics/skills
```

Or manually by placing skill folders in `.claude/skills/`.

## Custom Slash Commands

Create reusable commands by placing Markdown files in `.claude/commands/`.

### Command Structure

```
.claude/commands/
├── fix-issue.md        # Available as /project:fix-issue
├── review-pr.md        # Available as /project:review-pr
└── deploy.md           # Available as /project:deploy
```

### Using Arguments

Use `$ARGUMENTS` to pass parameters:

```markdown
<!-- .claude/commands/fix-github-issue.md -->
Please analyze and fix the GitHub issue: $ARGUMENTS

1. Read the issue details
2. Find the relevant code
3. Implement a fix
4. Write tests if needed
```

Usage: `/project:fix-github-issue 1234`

## Plugins

Plugins bundle slash commands, agents, MCP servers, and hooks into installable packages.

### Installing Plugins

```bash
# From the marketplace
claude /plugin marketplace add plugin-name

# From a Git repository
claude /plugin add github.com/owner/repo
```

### Plugin Structure

```
my-plugin/
├── plugin.json         # Plugin manifest
├── commands/           # Slash commands
├── skills/             # Agent skills
├── mcp/                # MCP server configs
└── hooks/              # Hook scripts
```

## Hooks

Hooks are shell commands that execute in response to events.

### Hook Events

- `tool_call` - Before a tool executes
- `tool_result` - After a tool completes
- `prompt_submit` - When user submits a prompt

### Configuration

In `~/.claude/settings.json`:

```json
{
  "hooks": {
    "tool_call": "echo 'Tool called: $TOOL_NAME'"
  }
}
```

## Resources

- [Official Skills Repository](https://github.com/anthropics/skills)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Plugin Marketplace](https://github.com/anthropics/skills)
