---
title: "Skills & Custom Commands for AI Coding Assistants"
date: "2025-12-25"
excerpt: "A comprehensive guide to skills, custom commands, and rules across major AI coding assistants."
---

# Skills & Custom Commands for AI Coding Assistants

The landscape of AI coding assistants has evolved rapidly, with each major platform developing its own approach to customization and extensibility. This documentation covers how to create and use skills, custom commands, and rules across the leading AI coding tools.

## What Are Skills?

Skills are organized collections of instructions, scripts, and resources that help AI coding assistants perform specific tasks better. Think of them as "custom onboarding materials" that transform general-purpose AI into specialized assistants tailored to your needs.

### Key Characteristics

- **Composable**: Skills can stack together for complex workflows
- **Portable**: Many formats work across multiple platforms
- **Efficient**: Load only what's needed for the current task
- **Powerful**: Can include executable code, templates, and domain knowledge

## Platform Comparison

| Platform | Customization | Location | Format |
|----------|--------------|----------|--------|
| [Claude Code](/docs/claude-code) | Skills, Slash Commands, Plugins | `.claude/skills/`, `.claude/commands/` | Markdown + YAML |
| [OpenAI Codex](/docs/openai-codex) | Custom Prompts, MCP | `~/.codex/prompts/` | Markdown + YAML |
| [GitHub Copilot](/docs/github-copilot) | Agent Skills, Extensions | `.claude/skills/`, `.github/copilot/` | Markdown |
| [Cursor](/docs/cursor) | Rules, AGENTS.md | `.cursor/rules/` | Markdown + YAML |
| [Windsurf](/docs/windsurf) | Rules, Workflows, Memories | `~/.codeium/windsurf/` | Markdown |

## Cross-Platform Compatibility

A significant development in 2025 is the convergence of skill formats. GitHub Copilot now automatically recognizes Claude Code skills in the `.claude/skills` directory, and many platforms support Model Context Protocol (MCP) for tool integration.

## Getting Started

Choose your platform below to learn how to create custom skills:

- [Claude Code Skills](/docs/claude-code) - Anthropic's official CLI
- [OpenAI Codex CLI](/docs/openai-codex) - OpenAI's terminal-based assistant
- [GitHub Copilot](/docs/github-copilot) - Agent Skills and Extensions
- [Cursor](/docs/cursor) - Rules for AI
- [Windsurf](/docs/windsurf) - Rules, Workflows & Memories
