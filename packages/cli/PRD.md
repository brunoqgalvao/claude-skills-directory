# Product Requirements Document: Skill CLI

## Overview

**Product Name:** `skill`  
**Tagline:** NPM for AI Agent Skills  
**Version:** 0.1.0

A command-line package manager for installing, managing, and publishing skills for AI coding agents (Claude Code, OpenAI Codex CLI, ChatGPT, and others).

---

## Problem Statement

AI coding agents like Claude Code support "skills" - folders containing instructions, scripts, and resources that improve agent performance on specialized tasks. However:

1. **Discovery is fragmented** - Skills are scattered across GitHub repos with no central index
2. **Installation is manual** - Users must clone repos, copy files, and configure paths
3. **No dependency management** - Skills with setup requirements have no standard install flow
4. **Sharing is ad-hoc** - No standardized way to publish and distribute skills

---

## Solution

A CLI tool modeled after npm/pip that provides:

- **One-command installation** from registry or git URLs
- **Local and global scopes** matching how Claude Code loads skills
- **Automatic setup execution** for skills with dependencies
- **Central registry** for discovery and search
- **Publishing workflow** for skill authors

---

## Target Users

| Persona | Description | Primary Use Cases |
|---------|-------------|-------------------|
| **Developers** | Use AI agents daily for coding | Install skills to enhance agent capabilities |
| **Teams** | Share workflows across organization | Publish private/internal skills |
| **Skill Authors** | Create reusable agent instructions | Publish to registry, manage versions |

---

## Core Features

### 1. Install Skills

```bash
# From registry (by name)
skill install invoice-extractor

# From git URL
skill install https://github.com/user/my-skill

# Global install (available to all projects)
skill install -g legal-research

# Force reinstall
skill install -f my-skill

# Skip setup scripts
skill install --skip-setup my-skill
```

**Behavior:**
- Clones repo with `--depth 1` for speed
- Removes `.git` directory after clone
- Validates `SKILL.md` exists (warns if missing)
- Runs `setup.sh` or `setup.py` if present
- Tracks installation in config

**Install Locations:**
| Scope | Directory | Use Case |
|-------|-----------|----------|
| Local | `./.claude/skills/<name>/` | Project-specific skills |
| Global | `~/.claude/skills/<name>/` | Shared across all projects |

### 2. Uninstall Skills

```bash
skill uninstall my-skill
skill rm my-skill -g  # global
```

### 3. List Installed Skills

```bash
skill list           # Local skills
skill list -g        # Global skills
skill list -a        # All (both scopes)
```

**Output:**
```
Global skills:
  ~/.claude/skills

  ● invoice-extractor (12/21/2025)
  ● legal-research (12/20/2025)

Local skills:
  ./.claude/skills

  ● custom-linter (12/21/2025)
```

### 4. Search Registry

```bash
skill search invoice
skill search "legal compliance"
```

**Output:**
```
invoice-extractor v2025-10-01
  Parse PDFs and export key fields to CSV for AR teams.
  by Acme Corp • Finance, Operations
  ★ 15 • 87 installs
```

**Search matches on:** id, name, summary, tags, verticals

### 5. Skill Info

```bash
skill info invoice-extractor
```

**Output:**
```
Invoice Extractor

Parse PDFs and export key fields to CSV for AR teams.

Author:    Acme Corp
Verticals: Finance, Operations
Tags:      pdf, ocr, csv, receivables
Updated:   2025-10-01
Stats:     ★ 15 stars, 87 installs

Links:
  repo:     https://github.com/acme/invoice-extractor-skill
  skill_md: https://raw.githubusercontent.com/.../SKILL.md

Installation:
  ○ Local:  not installed
  ● Global: ~/.claude/skills/invoice-extractor
```

### 6. Initialize New Skill

```bash
skill init
```

**Interactive prompts:**
- Skill name
- Description
- Author name/GitHub
- Verticals
- Create setup.sh template?

**Creates:**
```
./
├── SKILL.md      # Instructions with YAML frontmatter
├── skill.json    # Metadata for registry
└── setup.sh      # Optional setup script
```

### 7. Publish Skill

```bash
skill publish
```

**Behavior:**
1. Validates `SKILL.md` exists
2. Checks git repo status
3. Provides instructions to:
   - Push to GitHub
   - Submit to registry via GitHub Issue

**Future:** Direct API publishing to registry

### 8. Update Skills

```bash
skill update              # Update all local skills
skill update my-skill     # Update specific skill
skill update -g           # Update all global skills
```

**Behavior:**
- Re-clones from original source URL
- Runs setup scripts unless `--skip-setup`

### 9. Run Skill Scripts

```bash
skill run my-skill test
skill run my-skill migrate
```

**Looks for scripts in:**
- `<skill>/scripts/<name>.sh`
- `<skill>/scripts/<name>.py`
- `<skill>/<name>.sh`
- `<skill>/<name>.py`

---

## Skill Structure

### Minimal Skill
```
my-skill/
└── SKILL.md
```

### Full Skill
```
my-skill/
├── SKILL.md           # Required: instructions + frontmatter
├── skill.json         # Optional: extended metadata
├── setup.sh           # Optional: runs on install
├── setup.py           # Optional: alternative to .sh
└── scripts/           # Optional: additional scripts
    ├── test.sh
    └── migrate.py
```

### SKILL.md Format
```markdown
---
name: invoice-extractor
description: Parse PDFs and export key fields to CSV
---

# Invoice Extractor

## Overview
Instructions for the AI agent...

## Usage
How to use this skill...
```

### skill.json Format
```json
{
  "name": "invoice-extractor",
  "version": "0.1.0",
  "description": "Parse PDFs and export key fields to CSV",
  "author": {
    "name": "Acme Corp",
    "github": "acme"
  },
  "verticals": ["Finance", "Operations"],
  "tags": ["pdf", "ocr", "csv"],
  "scripts": {
    "setup": "setup.sh",
    "test": "scripts/test.sh"
  }
}
```

---

## Registry

### Data Model

```typescript
interface Skill {
  id: string;                    // kebab-case unique identifier
  name: string;                  // Display name
  summary: string;               // ≤180 chars
  verticals: string[];           // 1-3 categories
  tags?: string[];               // Optional keywords
  author: {
    name: string;
    github?: string;
    url?: string;
  };
  visibility: "public" | "private";
  links: {
    repo?: string;               // GitHub URL
    skill_md?: string;           // Raw SKILL.md URL
    docs?: string;               // Documentation
    demo?: string;               // Demo/video
  };
  installation?: {
    type: "git" | "inline" | "npm";
    command?: string;
    prerequisites?: string[];
  };
  stats?: {
    stars: number;
    installs: number;
  };
  last_updated: string;          // ISO date
}
```

### Registry Sources

| Source | URL | Format |
|--------|-----|--------|
| Skill Index | `data/skills-index.json` | Array of Skill objects |
| Individual | `data/skills/<id>.json` | Single Skill object |

---

## Technical Architecture

```
cli/
├── src/
│   ├── index.ts              # CLI entry point (Commander.js)
│   ├── commands/
│   │   ├── install.ts        # Install from registry/git
│   │   ├── uninstall.ts      # Remove skill
│   │   ├── list.ts           # List installed
│   │   ├── search.ts         # Search registry
│   │   ├── info.ts           # Skill details
│   │   ├── init.ts           # Create new skill
│   │   ├── publish.ts        # Publish workflow
│   │   ├── update.ts         # Update skills
│   │   └── run.ts            # Run skill scripts
│   └── utils/
│       ├── paths.ts          # Directory constants
│       ├── config.ts         # Persistent config (Conf)
│       ├── git.ts            # Git operations (simple-git)
│       ├── scripts.ts        # Script execution (execa)
│       └── registry.ts       # Registry fetch/search
├── package.json
└── tsconfig.json
```

### Dependencies

| Package | Purpose |
|---------|---------|
| commander | CLI framework |
| chalk | Terminal styling |
| ora | Spinners |
| inquirer | Interactive prompts |
| simple-git | Git operations |
| execa | Script execution |
| conf | Persistent config |
| yaml | Parse SKILL.md frontmatter |
| fs-extra | File operations |

---

## Roadmap

### v0.1.0 (MVP) ✅
- [x] Install from git URL
- [x] Install from registry by name
- [x] Local and global scopes
- [x] Uninstall
- [x] List installed
- [x] Search registry
- [x] Skill info
- [x] Init new skill
- [x] Publish workflow
- [x] Update skills
- [x] Run skill scripts
- [x] Setup script execution

### v0.2.0
- [ ] Version pinning (`skill install my-skill@1.0.0`)
- [ ] Lock file for reproducible installs
- [ ] `skill outdated` - check for updates
- [ ] Skill templates (`skill init --template react`)

### v0.3.0
- [ ] Direct API publishing (no GitHub Issue)
- [ ] Private registries (enterprise)
- [ ] Skill dependencies (skill depends on another skill)
- [ ] MCP server skills (auto-configure MCP)

### v1.0.0
- [ ] Skill verification/signing
- [ ] Install analytics
- [ ] Rating/reviews
- [ ] Organizations/teams
- [ ] Paid/premium skills

---

## Success Metrics

| Metric | Target (6 months) |
|--------|-------------------|
| Registry skills | 500+ |
| Monthly installs | 10,000+ |
| CLI downloads | 5,000+ |
| Active publishers | 100+ |

---

## Competitive Landscape

| Tool | Scope | Strengths | Gaps |
|------|-------|-----------|------|
| **skillsmp.com** | Web marketplace | 29k+ skills, AI search | No CLI, no install |
| **anthropics/skills** | Official repo | Anthropic-maintained | Limited skills, no package manager |
| **steipete/agent-rules** | GitHub repo | Well-organized rules | Manual copy, no install |
| **skill CLI (this)** | Package manager | Install/publish/manage | New, smaller registry |

---

## Open Questions

1. **Namespace collisions** - How to handle same skill name from different authors?
2. **Skill validation** - Should we require SKILL.md validation before publish?
3. **Breaking changes** - How to handle skills that break with agent updates?
4. **Monetization** - Premium skills marketplace?

---

## Appendix

### Example Workflow: Install a Skill

```bash
$ skill install invoice-extractor -g

✔ Found Invoice Extractor by Acme Corp
- Cloning https://github.com/acme/invoice-extractor-skill...
✔ Installed invoice-extractor (global)
  → ~/.claude/skills/invoice-extractor
- Running setup script: setup.sh
  Installing dependencies...
  Configuring OCR engine...
✔ Setup completed
```

### Example Workflow: Create and Publish

```bash
$ mkdir my-skill && cd my-skill
$ skill init

? Skill name: my-awesome-skill
? Description: Does awesome things
? Author name: John Doe
? Author GitHub: johndoe
? Verticals: Development, Tools
? Create setup.sh template? Yes

✓ Created SKILL.md
✓ Created skill.json
✓ Created setup.sh

Skill initialized!

$ git init && git add . && git commit -m "Initial commit"
$ gh repo create my-awesome-skill --public --push

$ skill publish

✔ Repository ready

To publish your skill:

  1. Push to GitHub:
     git push -u origin main

  2. Submit to the directory:
     https://github.com/.../issues/new?template=add-skill.yml
```
