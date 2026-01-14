---
title: "Cursor Rules for AI"
date: "2025-12-25"
excerpt: "How to create and configure rules in Cursor IDE for better AI-assisted coding."
---

# Cursor Rules for AI

Cursor is an AI-powered code editor that supports customizable rules to control AI behavior. Rules provide persistent context and instructions for all AI interactions.

## Rule Types

| Type | Scope | Location | Use Case |
|------|-------|----------|----------|
| **Project Rules** | Repository | `.cursor/rules/` | Team standards, project patterns |
| **User Rules** | Global | Cursor Settings | Personal preferences |
| **Team Rules** | Organization | Cursor Dashboard | Enterprise standards |
| **AGENTS.md** | Repository | Project root or subdirs | Simple agent instructions |

## Project Rules

Stored in `.cursor/rules/` and version-controlled with your codebase.

### Directory Structure

```
.cursor/
└── rules/
    ├── general.md          # Always applied
    ├── typescript.md       # Applied to .ts files
    ├── testing.md          # Applied when writing tests
    └── security.md         # Applied for security-related code
```

### Rule File Format

```markdown
---
description: "Enforce TypeScript best practices"
alwaysApply: false
globs: ["**/*.ts", "**/*.tsx"]
---

## TypeScript Guidelines

1. Use strict TypeScript configuration
2. Prefer interfaces over type aliases for object shapes
3. Use explicit return types for public functions
4. Avoid `any` type - use `unknown` when type is uncertain

## Examples

```typescript
// Good
interface User {
  id: string;
  name: string;
}

// Avoid
type User = {
  id: string;
  name: string;
}
```
```

### Rule Application Types

| Type | Behavior |
|------|----------|
| `alwaysApply: true` | Always included in context |
| `alwaysApply: false` | AI decides when relevant |
| `globs: [...]` | Applied to matching files only |
| Manual | Applied via `@rules` mention |

## Creating Rules

### Via Command Palette

```
Cmd + Shift + P > New Cursor Rule
```

### Manually

Create a markdown file in `.cursor/rules/` with YAML frontmatter.

## AGENTS.md

A simpler alternative for basic instructions:

```markdown
<!-- AGENTS.md in project root -->

# Project Guidelines

- Use pnpm for package management
- Follow conventional commits
- Write tests for all new features
- Use the existing utility functions in src/utils/
```

Place AGENTS.md in subdirectories for scoped instructions.

## User Rules

Global rules in `Cursor Settings > General > Rules for AI`:

```
I prefer:
- Concise explanations
- TypeScript over JavaScript
- Functional programming patterns
- Using existing project utilities
```

## Best Practices

### Do

- Keep rules under 500 lines
- Be specific and actionable
- Include concrete examples
- Split complex rules into focused files
- Use globs for file-specific rules

### Avoid

- Vague instructions ("write good code")
- Overly long rules that waste tokens
- Duplicating rules across files
- Contradicting project rules in user rules

## Migration from .cursorrules

The legacy `.cursorrules` file is deprecated. Migrate to Project Rules:

```bash
# Move content from .cursorrules to .cursor/rules/
mkdir -p .cursor/rules
mv .cursorrules .cursor/rules/general.md
# Add YAML frontmatter to the file
```

## Resources

- [Cursor Documentation](https://cursor.com/docs)
- [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)
- [dotcursorrules.com](https://dotcursorrules.com/)
