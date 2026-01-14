# AITMPL (Claude Code Templates) - Reverse-Engineered Product Spec

> Competitive intelligence analysis as of 2026-01-02

## TL;DR

AITMPL is a **configuration marketplace + CLI tool** for Claude Code. Think "npm for Claude Code configs" — users browse pre-built components (agents, commands, settings, hooks, MCPs, skills), build custom "stacks", and deploy everything with one `npx` command.

**URL:** https://www.aitmpl.com
**GitHub:** https://github.com/davila7/claude-code-templates
**Stats:** 14.4k ⭐ | 1.2k forks
**License:** MIT
**Backed by:** Z.AI, Vercel OSS Program

---

## Product Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AITMPL ECOSYSTEM                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐              │
│  │   Website   │    │  CLI Tool   │    │   GitHub    │              │
│  │ aitmpl.com  │    │  npx ...    │    │    Repo     │              │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘              │
│         │                  │                  │                      │
│         └──────────────────┼──────────────────┘                      │
│                            ▼                                         │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    Component Registry                        │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │    │
│  │  │ Agents  │ │Commands │ │Settings │ │  Hooks  │            │    │
│  │  │  🤖     │ │   ⚡    │ │   ⚙️    │ │   🪝    │            │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘            │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐                        │    │
│  │  │  MCPs   │ │ Plugins │ │ Skills  │                        │    │
│  │  │   🔌    │ │   📦    │ │ 🎨 NEW  │                        │    │
│  │  └─────────┘ └─────────┘ └─────────┘                        │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                            │                                         │
│                            ▼                                         │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     User's Project                           │    │
│  │  .claude/                                                    │    │
│  │  ├── agents/          # AI specialist definitions            │    │
│  │  ├── commands/        # Custom slash commands                │    │
│  │  ├── settings.local.json                                     │    │
│  │  └── ...                                                     │    │
│  │  CLAUDE.md            # Framework-specific instructions      │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Types

### 1. Agents 🤖
**What:** AI specialists for specific domains
**Examples:**
- Security auditor
- React optimizer
- Frontend developer
- Performance analyst

**How they work:** Agents are persona definitions that give Claude specific expertise, constraints, and behaviors for domain-specific tasks.

### 2. Commands ⚡
**What:** Custom slash commands for Claude Code
**Examples:**
- `/generate-tests` — Auto-generate test files
- `/optimize-bundle` — Bundle size optimization
- `/check-security` — Security vulnerability scan

**How they work:** Pre-defined prompts triggered by slash commands in Claude Code.

### 3. Settings ⚙️
**What:** Claude Code configuration presets
**Examples:**
- Timeout configurations
- Memory settings
- Output style preferences

**How they work:** JSON configuration files that customize Claude Code behavior.

### 4. Hooks 🪝
**What:** Automation triggers for Claude Code
**Examples:**
- Pre-commit validation
- Post-generation linting
- Auto-formatting triggers

**How they work:** Event-driven scripts that run at specific points in the Claude Code workflow.

### 5. MCPs 🔌 (Model Context Protocols)
**What:** External service integrations
**Examples:**
- GitHub
- PostgreSQL
- Stripe
- AWS
- OpenAI
- 30+ platform integrations

**How they work:** Pre-configured MCP server definitions that connect Claude to external services.

### 6. Plugins 📦
**What:** Extended functionality modules
**Features:**
- Plugin Dashboard for visual management
- Enable/disable plugins
- Monitor component status
- Marketplace browsing

### 7. Skills 🎨 (NEW)
**What:** Reusable capabilities with progressive disclosure
**Source:** Aggregated from K-Dense AI (139 skills), Anthropic official, community contributions

**How they work:** Modular skill files that teach Claude specific capabilities.

---

## CLI Tool

### Installation
```bash
npx claude-code-templates@latest
```

### Core Commands

| Command | Description |
|---------|-------------|
| `npx claude-code-templates@latest` | Interactive setup wizard |
| `--agent [name]` | Install specific agent |
| `--skill [name]` | Install specific skill |
| `--mcp [name]` | Install specific MCP |
| `--yes` | Auto-confirm (non-interactive) |
| `--analytics` | Real-time monitoring dashboard |
| `--health-check` | System diagnostics |
| `--plugins` | Plugin dashboard |
| `--chats` | Conversation monitor |

### Global Agents (IMPORTANT - Execution Layer!)

**This is their execution feature.** They can create agents that run GLOBALLY:

```bash
# Create a global agent
npx claude-code-templates@latest --create-agent customer-support

# RUN the agent directly (not just install!)
customer-support "Help me with ticket #12345"
api-security-audit "analyze endpoints"
react-performance-optimization "optimize components"
database-optimization "improve queries"
```

| Command | Description |
|---------|-------------|
| `--create-agent [name]` | Create new global agent |
| `--list-agents` | List installed agents |
| `--update-agent [name]` | Update agent |
| `--remove-agent [name]` | Remove agent |

**Key insight:** These aren't just configs — they're SDK-powered executables you can invoke from anywhere.

### Skills Installation

```bash
# Individual skills
npx claude-code-templates@latest --skill pdf-processing-pro
npx claude-code-templates@latest --skill algorithmic-art
npx claude-code-templates@latest --skill mcp-builder

# Multiple at once
npx claude-code-templates@latest --skill pdf-anthropic,docx,xlsx,pptx
```

**Available skill categories:**
- **Creative:** algorithmic-art, canvas-design, slack-gif-creator
- **Development:** mcp-builder, artifacts-builder, webapp-testing, skill-creator
- **Documents:** pdf-processing-pro, pdf-anthropic, docx, xlsx, pptx
- **Enterprise:** brand-guidelines, internal-comms, theme-factory

---

## Monitoring & Diagnostics

### Analytics Dashboard
Real-time monitoring of AI development sessions:
- Token consumption tracking
- Session performance metrics
- Usage patterns over time

### Conversation Monitor
Mobile-optimized interface for viewing Claude responses:
- Remote access via tunnel support
- Real-time response streaming
- Session history

### Health Check
Installation diagnostics:
- Configuration validation
- Integration status
- Optimization recommendations

---

## UX Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. DISCOVER          2. SELECT           3. BUILD              │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │  Browse by  │ ──▶ │  Add to     │ ──▶ │   Stack     │       │
│  │  category   │     │  cart       │     │   Builder   │       │
│  │  or company │     │             │     │   sidebar   │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│                                                  │               │
│                                                  ▼               │
│  4. GENERATE          5. INSTALL          6. USE                │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │  Copy npx   │ ──▶ │  Run in     │ ──▶ │  Claude     │       │
│  │  command    │     │  terminal   │     │  Code ready │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key UX Features:**
- Shopping cart metaphor for "Stack Builder"
- Filter by company/platform (Stripe, AWS, GitHub, etc.)
- One-command deployment
- Social sharing of stacks

---

## Technical Stack

| Technology | Usage |
|------------|-------|
| Python (52.2%) | Backend API, component processing |
| JavaScript (24.8%) | CLI tool, frontend interactions |
| HTML/CSS (12.8%) | Web interface |

### Project Structure
```
claude-code-templates/
├── .claude-plugin/     # Plugin configuration
├── .claude/            # Claude settings
│   ├── agents/         # Agent definitions (6 built-in)
│   │   ├── agent-expert.md
│   │   ├── cli-ui-designer.md
│   │   ├── command-expert.md
│   │   ├── docusaurus-expert.md
│   │   ├── frontend-developer.md
│   │   └── mcp-expert.md
│   ├── commands/       # Command definitions
│   └── settings.local.json
├── api/                # Backend API
├── cli-tool/           # CLI implementation
│   ├── bin/            # Executables
│   ├── src/
│   │   ├── agents.js           # Agent runtime
│   │   ├── analytics.js        # Usage tracking
│   │   ├── chats-mobile.js     # Mobile chat UI
│   │   ├── claude-api-proxy.js # API proxy layer
│   │   ├── plugin-dashboard.js # Plugin management
│   │   ├── skill-dashboard.js  # Skills UI
│   │   ├── sandbox-server.js   # ⚠️ EXECUTION SANDBOX
│   │   ├── session-sharing.js  # Share sessions
│   │   ├── security-audit.js   # Security scanning
│   │   └── sdk/                # ⚠️ AGENT SDK
│   ├── components/     # Reusable modules
│   ├── templates/      # Config templates
│   └── tests/          # Test files
├── docs/               # Documentation
├── database/           # Migrations
└── scripts/            # Utility scripts
```

### Execution Infrastructure (Key Finding!)

They have more than configs — they have **execution capabilities**:

| Component | What It Does |
|-----------|--------------|
| `sandbox-server.js` | Sandboxed execution environment for running agents |
| `sdk/` | Agent SDK for building executable agents |
| `claude-api-proxy.js` | API proxy for Claude calls |
| `session-sharing.js` | Share/export agent sessions |
| `tracking-service.js` | Usage analytics |

This means they can **run** agents, not just **install** them.

---

## Business Model

| Aspect | Details |
|--------|---------|
| **Pricing** | Free, open source |
| **License** | MIT |
| **Revenue** | None (sponsored by Z.AI) |
| **Distribution** | npm, GitHub |

---

## What They Do Well

1. **Unified platform** — All Claude Code config types in one place
2. **Great DX** — One-command deployment via npx
3. **Visual UX** — Shopping cart metaphor, stack builder
4. **Company integrations** — 30+ pre-built platform stacks
5. **Monitoring suite** — Analytics, health checks, conversation monitor
6. **Active community** — Discord, GitHub with 14.4k stars
7. **Strong backing** — Z.AI sponsorship, Vercel OSS program

---

## What They Lack (Our Opportunities)

| Gap | Opportunity |
|-----|-------------|
| No catalog size metrics | Show total counts, growth velocity |
| No community curation signals | Stars, downloads, ratings, trending |
| No GitHub-based discovery | Pull from GitHub, not closed registry |
| Skills are bolted-on ("NEW") | Skills-first focus, deep expertise |
| ~~Static configs only~~ | ⚠️ WRONG — they have execution |
| Developer-only audience | Business automation (web playground) |
| No cloud deploy/scheduling | Hosted agents, triggers, automation |

---

## Strategic Comparison

| Dimension | AITMPL | Us (Target) |
|-----------|--------|-------------|
| **Focus** | Everything store | Skills-first |
| **Model** | Curated registry | GitHub aggregation + curation |
| **Signals** | None visible | Installs, votes, trending |
| **Execution** | ✅ Global agents, SDK, sandbox | Need to match or exceed |
| **Cloud deploy** | ❌ Not yet | Future differentiator |
| **Audience** | Developers | Developers → Business users |
| **Moat** | First-mover, 14.4k stars, Z.AI backing | CLI DX + social curation |

---

## Key Takeaways

1. **They're further ahead than I initially thought** — They have execution infrastructure (sandbox, SDK, global agents)
2. **They're our direct competitor** — Same space, similar approach, better traction (14.4k stars)
3. **Skills are still their afterthought** — Marked "NEW", we can own this vertical
4. **We differentiate on curation** — Community signals, not just browsing
5. **Cloud deploy is the gap** — They run locally, nobody does hosted agent automation yet

**Threat Level: HIGH** for Phase 1 (directory) — they have first-mover advantage
**Threat Level: MEDIUM** for Phase 2 (agent execution) — ⚠️ they ARE building this
**Threat Level: LOW** for Phase 3 (cloud deploy) — nobody's there yet

---

## Revised Competitive Position

```
                         EXECUTION CAPABILITY
                                ↑
                                |
         AITMPL ●               |
         (sandbox, SDK,         |
          global agents)        |
                                |
    ────────────────────────────┼────────────────────→ CURATION
    NO CURATION                 |                      (signals, trending)
                                |
                                |         ● Us (target)
         SkillsMP ●             |           (curation + execution + cloud)
         (browse only)          |
                                |
                                ↓
                         NO EXECUTION
```

**The real race:** Who gets to cloud-deployed, scheduled, triggered agents first?

---

## ⚠️ DEEP DIVE: Their Cloud Execution (sandbox-server.js)

They already have cloud execution — just not scheduled/triggered automation.

### Cloud Sandbox Options

From their component pages and CLI:

| Provider | Command | Description |
|----------|---------|-------------|
| **E2B** | Primary | Full-featured cloud sandbox |
| **Cloudflare Workers** | `--cf-worker` | Serverless/edge |
| **Docker** | `--docker` | Local containers |

### How E2B Execution Works

```
┌─────────────────────────────────────────────────────────────┐
│                    EXECUTION FLOW                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User: customer-support "Help with ticket #12345"           │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────┐                    │
│  │  /api/execute (mode: 'cloud')       │                    │
│  │  ├── Check agent exists locally     │                    │
│  │  ├── Auto-install if missing        │                    │
│  │  └── Spawn Python subprocess        │                    │
│  └─────────────────────────────────────┘                    │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────┐                    │
│  │  e2b-launcher.py                    │                    │
│  │  ├── E2B_API_KEY                    │                    │
│  │  ├── ANTHROPIC_API_KEY              │                    │
│  │  └── Agent params + prompt          │                    │
│  └─────────────────────────────────────┘                    │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────┐                    │
│  │  Real-time progress tracking        │                    │
│  │  ├── "Sandbox created"              │                    │
│  │  ├── "Installing..."                │                    │
│  │  └── "Execution completed"          │                    │
│  └─────────────────────────────────────┘                    │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────┐                    │
│  │  Poll /api/task/:taskId             │                    │
│  │  ├── sandbox_id                     │                    │
│  │  ├── output_logs                    │                    │
│  │  └── status: completed/failed       │                    │
│  └─────────────────────────────────────┘                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Agent Definition Format (from frontend-developer.md)

```markdown
---
name: frontend-developer
description: React development specialist
color: blue
model: claude-sonnet
tools: [Read, Write, Edit, Bash]
---

## Primary Role
Frontend development for React applications and responsive design.

## Technical Focus Areas
- React component patterns using hooks and context
- Responsive design with Tailwind CSS or CSS-in-JS
- State management (Redux, Zustand, Context API)
- Performance optimization (lazy loading, code splitting, memoization)
- WCAG-compliant accessibility with ARIA attributes

## Methodology
- Component-first thinking (reusability, composition)
- Mobile-first responsive design
- Performance budgets: sub-3s load times
- Semantic HTML with proper ARIA labeling

## Deliverables
- Complete React components with TypeScript prop interfaces
- Styling implementations
- State management solutions
- Unit test templates
- Accessibility checklists
- Performance recommendations
```

### What They Have vs. Don't Have

| Feature | Status |
|---------|--------|
| Install configs | ✅ |
| Global CLI agents | ✅ |
| Local execution | ✅ |
| Cloud sandbox (E2B) | ✅ |
| Real-time progress | ✅ |
| Session sharing | ✅ |
| Scheduled runs | ❌ |
| Webhook triggers | ❌ |
| Web playground (no CLI) | ❌ |
| Multi-agent orchestration | ❌ |

**Key insight:** They're at "run on demand in cloud sandbox." Nobody's at "scheduled, triggered, autonomous agents as a service" yet.

---

## Final Assessment

AITMPL is a serious, well-executed competitor with:
- 14.4k GitHub stars
- Z.AI + Vercel backing
- Full execution infrastructure
- 30+ platform integrations

**They're winning on:**
- First-mover advantage
- Community size
- Polish and UX
- Breadth of component types

**We can win on:**
- **GitHub scraping + aggregation** — Open ecosystem vs. closed registry. We index everything.
- **Strong curation** — Usage signals, trending, ratings. They have zero.
- **Simple, good CLI** — Do one thing well. Not 7 component types, just skills.
