# Competitors Analysis

Last updated: 2026-01-04

## Skills Marketplaces / Directories

| Name | URL | Description | Size |
|------|-----|-------------|------|
| **SkillsMP** | https://skillsmp.com | Independent community project aggregating agent skills from GitHub. Supports Claude Code, Codex CLI, and ChatGPT | 25,000+ skills |
| **awesome-claude-skills** | https://github.com/travisvn/awesome-claude-skills | Curated list of Claude Skills, resources, and tools | Community curated |
| **obra/superpowers** | https://github.com/obra/superpowers | Core skills library for Claude Code with 20+ battle-tested skills (TDD, debugging, collaboration) | 20+ skills |
| **daymade/claude-code-skills** | https://github.com/daymade/claude-code-skills | Professional Claude Code skills marketplace with production-ready skills | 25 skills |
| **anthropics/skills** | https://github.com/anthropics/skills | Official Anthropic skills repository | Official |
| **mcpservers.org** | https://mcpservers.org/claude-skills | Claude Skills Library section on MCP Servers | - |

## Skills Loaders & Frameworks

| Name | URL | Description | Stats |
|------|-----|-------------|-------|
| **OpenSkills** | https://github.com/numman-ali/openskills | Universal skills loader for AI coding agents (Claude Code, Cursor, Windsurf, Aider). CLI-based, 100% compatible with Claude's skill format. Install via `npm i -g openskills` | 3.9k stars, 288 forks |
| **OpenSkills (BandarLabs)** | https://github.com/BandarLabs/open-skills | Run Claude Skills locally on Mac in isolated sandbox. MCP server that works with Claude Desktop, Gemini CLI, Qwen CLI | 275 stars |
| **Skillkit** | https://github.com/maxvaega/skillkit | Python library enabling Agent Skills for any LLM. Progressive disclosure, script execution, framework-agnostic. Works standalone or with LangChain | 83 stars |
| **Claude Skill Kit** | https://github.com/rfxlamia/claude-skillkit | Research-driven framework for creating/validating Claude Code skills. 12-step creation process, 9 automation scripts, quality scoring | 4 stars |
| **Skillpacks (AgentSea)** | https://github.com/agentsea/skillpacks | Python library for fine-tuning agents on tools with hot-swappable learned skills at inference time | 8 stars |
| **Skillpacks (tachyon-beep)** | https://github.com/tachyon-beep/skillpacks | Curated marketplace of 23 skillpacks with 160+ skills across 6 professional domains (Dev, AI/ML, Game Dev, UX, Security, Docs) | Community |

### OpenSkills Deep Dive

**What they do well:**
- Universal loader that works across Claude Code, Cursor, Windsurf, Aider
- CLI-first approach with beautiful terminal UI
- 100% compatible with Claude's skill format (SKILL.md, .claude/skills/)
- Progressive disclosure - metadata-first loading
- Support for GitHub repos, local paths, private git
- 3.9k stars = significant community traction

**What they lack:**
- No web directory/discovery
- No community curation signals (likes, comments, ratings)
- No hosted marketplace
- CLI-only, no GUI

**Threat level: HIGH** — They've nailed the CLI/loader space. We need to differentiate on discovery, curation, and community.

### Skillkit Deep Dive

**What they do well:**
- Framework-agnostic (works with LangChain or standalone)
- Model-agnostic (any LLM)
- Advanced caching (<1ms response times)
- Security features (path validation, timeouts, sandboxing)
- Script execution in Python, Shell, JS, Ruby, Perl

**What they lack:**
- Python-only
- No marketplace/directory
- No community features
- Lower traction (83 stars)

**Threat level: MEDIUM** — Good tech but different focus (framework vs. marketplace)

## Claude Code Configuration Platforms

| Name | URL | Description | Model |
|------|-----|-------------|-------|
| **AITMPL** | https://www.aitmpl.com | Template/config repo for Claude Code. Offers agents, commands, settings, hooks, MCPs, plugins, and skills as modular components. Users build "development stacks" and deploy via `npx claude-code-templates@latest` | Free, MIT License, npm distributed |

### AITMPL Deep Dive

**What they do well:**
- Unified platform for ALL Claude Code config types (agents, commands, settings, hooks, MCPs, plugins, skills)
- One-command deployment of entire stacks
- Clean "shopping cart" UX for building personalized setups
- 30+ platform integrations (OpenAI, Stripe, AWS, GitHub, etc.)
- Real-time monitoring tools (analytics, health checks)
- Backed by Z.AI, Vercel OSS program
- Active Discord community

**What they lack:**
- No visible catalog size/growth metrics
- No community curation signals (stars, downloads, ratings)
- No GitHub-based discovery (pulls from their own registry)
- Skills are "recently added" - seems like an afterthought

**Threat level: MEDIUM-HIGH** — They're building the "everything store" for Claude Code config. If they nail the skills angle, they become our direct competitor.

## MCP Server Directories

| Name | URL | Description | Size |
|------|-----|-------------|------|
| **MCP.so** | https://mcp.so | Community-driven third-party MCP marketplace | 17,227+ servers |
| **Smithery** | https://smithery.ai | Largest open marketplace of MCP servers with hosting options | - |
| **Glama** | https://glama.ai/mcp/servers | MCP hosting platform with security ranking and usage stats | Large collection |
| **PulseMCP** | https://pulsemcp.com/servers | Daily-updated MCP server directory | 7,470+ servers |
| **MCPMarket** | https://mcpmarket.com | Directory of MCP servers and clients for AI agents | - |
| **LobeHub MCP** | https://lobehub.com/mcp | MCP marketplace with multidimensional ratings | - |
| **ClaudeMCP** | https://claudemcp.com/servers | Claude-focused MCP server discovery | - |
| **mcpservers.org** | https://mcpservers.org | Awesome MCP Servers directory | - |
| **awesome-mcp-servers** | https://github.com/punkpeye/awesome-mcp-servers | GitHub curated collection of MCP servers | Community curated |
| **modelcontextprotocol/servers** | https://github.com/modelcontextprotocol/servers | Official MCP servers repository | Official |

## MCP Tools / Integration Platforms

| Name | URL | Description |
|------|-----|-------------|
| **Composio** | https://composio.dev | Universal MCP server (Rube) with 8000+ app integrations. Handles auth, context, execution |
| **Clinde** | https://clinde.ai | One-click MCP servers marketplace |
| **ClaudeMind** | - | Curated MCP marketplace (628 reviewed, 233 listed) |

## Strategic Gaps We Exploit

| Competitor | What They Have | What They Lack |
|------------|----------------|----------------|
| **SkillsMP** | 25k+ skills, multi-agent | No CLI, no install, no engagement signals |
| **OpenSkills** | 3.9k stars, universal loader, CLI | No web discovery, no curation, no community |
| **AITMPL** | Full config stack, npx deploy, slick UX | No catalog metrics, no GitHub discovery, skills are bolted-on |
| **Skillkit** | Framework-agnostic, model-agnostic | Python-only, no marketplace |
| **Smithery** | CLI tool, hosting | MCP-only, not skills-focused |
| **Glama** | Security rankings, stats | MCP-only, no community curation |
| **anthropics/skills** | Official credibility | Tiny catalog, no package manager |
| **awesome-X repos** | Community trust | Static lists, manual install |

## Our Position vs. The Field

```
                    HIGH CATALOG SIZE
                          ↑
                          |
       SkillsMP ●         |
       (25k skills)       |
                          |
    ──────────────────────┼────────────────────→ GREAT DX
    LOW DX                |  ● OpenSkills      (CLI + engagement)
                          |    (3.9k stars, CLI)
       awesome-X ●        |         ● AITMPL
       (curated lists)    |         (full stack, npx)
                          |                ● Us (target)
       Skillkit ●         |                  (web + CLI + community)
       (framework)        |
       anthropics ●       |
       (official but tiny)|
                          ↓
                    LOW CATALOG SIZE
```

**SkillsMP** owns top-left on catalog size but has no DX.
**OpenSkills** has great CLI/loader but no discovery or community features.
**AITMPL** has great DX but skills are an afterthought — they're playing the "everything store" game.
**We** go for top-right on both: comprehensive catalog + best-in-class CLI + social curation + skills-first focus.

## Key Differentiators

1. **SkillsMP** - Largest skills aggregator (25k+), cross-platform (Claude, Codex, ChatGPT)
2. **OpenSkills** - Best CLI/loader with 3.9k stars, universal agent support
3. **Smithery** - Offers both local and hosted MCP, has CLI tool
4. **Glama** - Security/compatibility ranking, usage statistics
5. **PulseMCP** - Daily updates, large collection
6. **Composio** - Integration layer with OAuth handling for 8000+ apps
7. **Skillkit** - Best Python framework for building skills programmatically

## Domain Name Landscape

Several competitors have claimed key domain names in this space:

| Brand | Domains Taken | What They Do |
|-------|---------------|--------------|
| skillhub | skillhub.com, skillshub.com | Resume builders, eLearning |
| skillmarket | skillmarket.com, aiskill.market | Healthcare IT, AI skills marketplace |
| skillagent | skillagents.ai | AI learning platform |
| openskills | openskillsnetwork.org | Skills taxonomy, workforce |
| skillforge | skillforge.com, skillforge.in | Training companies |
| skillbase | skills-base.com, skillbase.hks.harvard.edu | Enterprise software, Harvard |

**Available domains worth considering:**
- skillmanager.dev ($12)
- skillagent.dev ($12)
- agentskills.app ($14)
- agentskills.org ($12)
