---
title: "GitHub Copilot Agent Skills & Extensions"
date: "2025-12-25"
excerpt: "How to create and use Agent Skills and Extensions with GitHub Copilot."
---

# GitHub Copilot Agent Skills & Extensions

GitHub Copilot supports Agent Skills (as of December 2025) and Extensions for customizing AI behavior across the Copilot coding agent, CLI, and VS Code.

## Agent Skills

Agent Skills are folders containing instructions, scripts, and resources that Copilot automatically loads when relevant to your prompt.

### Supported Environments

- Copilot coding agent
- Copilot CLI
- VS Code Insiders (stable VS Code support coming January 2025)

### Skill Structure

```
.github/copilot/skills/
└── my-skill/
    ├── SKILL.md        # Instructions and metadata
    └── resources/       # Optional: templates, scripts
```

### Cross-Platform Compatibility

Copilot automatically recognizes Claude Code skills:

```
.claude/skills/
└── my-skill/
    └── SKILL.md        # Works with both Copilot and Claude Code
```

### SKILL.md Format

```markdown
# My Skill Name

## Description
Brief description of what this skill helps with.

## Instructions
Detailed guidance for the AI on how to use this skill.

## Examples
Show expected behavior with concrete examples.
```

### Requirements

- GitHub Copilot paid plan (Individual, Business, or Enterprise)
- Without a paid plan, SKILL.md files serve as documentation only

## Copilot Extensions

Extensions integrate external services into Copilot Chat.

### Extension Types

| Type | Complexity | Use Case |
|------|------------|----------|
| **Skillsets** | Low | Simple API integrations (up to 5 skills) |
| **Agents** | High | Complex integrations, custom LLM logic |

### Building a Skillset

Skillsets let you define API endpoints that Copilot can call:

```json
{
  "name": "my-skillset",
  "skills": [
    {
      "name": "get-user",
      "description": "Fetch user information",
      "endpoint": "https://api.example.com/users/{id}"
    }
  ]
}
```

### Building an Agent Extension

Agents provide full control over request processing:

1. Handle incoming chat requests
2. Process with custom logic or external LLMs
3. Return formatted responses
4. Manage conversation context

## Model Context Protocol (MCP)

GitHub provides an MCP server for AI tool integration:

```json
{
  "mcp": {
    "servers": {
      "github": {
        "command": "mcp-server-github"
      }
    }
  }
}
```

### MCP Capabilities

- Automate code-related tasks
- Connect third-party tools to GitHub context
- Enable cloud-based workflows
- Invoke GitHub tools like the Copilot coding agent

## Community Resources

- [anthropics/skills](https://github.com/anthropics/skills) - Cross-platform skills
- [github/awesome-copilot](https://github.com/github/awesome-copilot) - Community collection
- [GitHub Copilot Extensions Marketplace](https://github.com/marketplace?type=apps&copilot_app=true)

## Resources

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Building Copilot Extensions](https://docs.github.com/en/copilot/building-copilot-extensions)
- [Agent Skills Announcement](https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/)
