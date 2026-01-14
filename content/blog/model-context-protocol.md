---
title: "Understanding MCP: The Protocol That Makes Agent Skills Portable"
date: "2025-12-23"
excerpt: "The Model Context Protocol (MCP) is the open standard that makes it possible to write an AI skill once and use it everywhere. Here's how it works."
author: "Skills Directory"
image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80"
sources:
  - title: "Model Context Protocol Official Site"
    url: "https://modelcontextprotocol.io/"
  - title: "MCP Specification"
    url: "https://spec.modelcontextprotocol.io/"
  - title: "Anthropic MCP Announcement"
    url: "https://www.anthropic.com/news/model-context-protocol"
  - title: "Claude Code MCP Integration"
    url: "https://docs.anthropic.com/en/docs/claude-code"
  - title: "MCP GitHub Repository"
    url: "https://github.com/modelcontextprotocol"
  - title: "Building MCP Servers - Anthropic Docs"
    url: "https://docs.anthropic.com/en/docs/agents-and-tools/mcp"
socialQuotes:
  - author: "Alex Albert"
    handle: "alexalbert__"
    quote: "MCP is what USB did for peripherals - suddenly everything just works together."
    platform: "X"
  - author: "Shreya Rajpal"
    handle: "shreaborb"
    quote: "Been building with MCP for a week. The portability is real - same skills work in Claude Desktop and my custom agent."
    platform: "X"
  - author: "Thorsten Ball"
    handle: "thorstenball"
    quote: "MCP + Claude Code is the most productive coding setup I've ever used. Adding new capabilities is trivial now."
    platform: "X"
---

One of the biggest challenges in building AI agents has been the **integration problem**. Every tool, database, and API required a custom integration. Want Claude to access your Google Drive? Build an integration. Slack? Another integration. GitHub? Yet another.

The **Model Context Protocol (MCP)** changes this. It's an open standard that lets you write an AI capability once and use it with any MCP-compatible agent.

## What is MCP?

MCP is a protocol for connecting AI assistants to external systems. Developed by [Anthropic](https://www.anthropic.com/news/model-context-protocol) and released as an open standard, it defines:

1. **How tools advertise capabilities** - What the tool can do
2. **How agents invoke tools** - Standardized request/response format
3. **How resources are shared** - Files, data, context
4. **How prompts are managed** - System prompts, templates

Think of it like **HTTP for AI agents**. HTTP standardized how web browsers talk to servers. MCP standardizes how AI agents talk to tools.

## The Problem MCP Solves

Before MCP, if you built a tool for one AI system, it only worked with that system:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Claude Code │     │   Cursor    │     │ Custom Agent│
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       ▼                   ▼                   ▼
 ┌───────────┐      ┌───────────┐      ┌───────────┐
 │ GitHub    │      │ GitHub    │      │ GitHub    │
 │ Plugin v1 │      │ Plugin v2 │      │ Plugin v3 │
 └───────────┘      └───────────┘      └───────────┘
       │                   │                   │
       └───────────────────┴───────────────────┘
                           │
                    ┌──────▼──────┐
                    │ GitHub API  │
                    └─────────────┘
```

**Three different plugins for the same API.** Maintenance nightmare.

With MCP:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Claude Code │     │   Cursor    │     │ Custom Agent│
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┴───────────────────┘
                           │
                    ┌──────▼──────┐
                    │ MCP Server: │
                    │   GitHub    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ GitHub API  │
                    └─────────────┘
```

**One skill. Works everywhere.**

## MCP Architecture

An MCP setup has three components:

### 1. MCP Host (The Agent)

The AI application that wants to use tools. Examples:
- Claude Code
- Claude Desktop
- Cursor (with MCP support)
- Custom agents you build

### 2. MCP Server (The Skill)

A program that exposes capabilities via the MCP protocol. It:
- Advertises what it can do (tools, resources, prompts)
- Handles requests from hosts
- Returns structured responses

### 3. Transport Layer

How the host and server communicate:
- **stdio** - Standard input/output (most common)
- **HTTP/SSE** - For remote servers
- **WebSocket** - For real-time applications

## MCP Capabilities

MCP servers can expose three types of capabilities:

### Tools

Functions the AI can call:

```json
{
  "name": "create_issue",
  "description": "Create a new GitHub issue",
  "inputSchema": {
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "body": { "type": "string" },
      "labels": { "type": "array", "items": { "type": "string" } }
    },
    "required": ["title"]
  }
}
```

### Resources

Data the AI can read:

```json
{
  "uri": "github://repo/issues/123",
  "mimeType": "application/json",
  "description": "Issue #123 details"
}
```

### Prompts

Templates for common interactions:

```json
{
  "name": "bug_report",
  "description": "Template for filing bug reports",
  "arguments": [
    { "name": "component", "required": true },
    { "name": "steps", "required": true }
  ]
}
```

## Building an MCP Skill

Here's a minimal MCP server in TypeScript:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "weather-skill",
  version: "1.0.0"
}, {
  capabilities: { tools: {} }
});

server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "get_weather",
    description: "Get current weather for a location",
    inputSchema: {
      type: "object",
      properties: {
        location: { type: "string", description: "City name" }
      },
      required: ["location"]
    }
  }]
}));

server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "get_weather") {
    const { location } = request.params.arguments;
    const weather = await fetchWeather(location);
    return { content: [{ type: "text", text: JSON.stringify(weather) }] };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

## Using MCP Skills

### In Claude Code

```bash
# Add an MCP skill
claude mcp add github-skill

# Or with configuration
claude mcp add-json "weather" '{"command":"npx","args":["weather-mcp"]}'

# List installed skills
claude mcp list
```

### In Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["github-mcp-server"]
    }
  }
}
```

## Real-World MCP Skills

Some popular MCP skills available today:

### Data & APIs
- **Postgres** - Query databases, run analytics
- **Fetch** - Make HTTP requests, scrape pages
- **Google Drive** - Read and search documents

### Developer Tools
- **GitHub** - Issues, PRs, repositories
- **Linear** - Project management
- **Sentry** - Error tracking

### Creative
- **Nano Banana** - AI image generation with Gemini
- **ElevenLabs** - Text-to-speech

### Productivity
- **Slack** - Send messages, search channels
- **Google Calendar** - Events and scheduling
- **Obsidian** - Note-taking integration

## The Skills Pattern with MCP

MCP enables the **Agent Skills pattern** we've discussed in other posts:

```
User Request
    ↓
Agent (Claude, etc.)
    ↓
MCP Discovery → What skills are available?
    ↓
Tool Selection → Which skill helps here?
    ↓
MCP Call → Execute the skill
    ↓
Response Processing
    ↓
Result to User
```

This pattern is **composable** - skills can call other skills. A "project setup" skill might use the GitHub skill, the Slack skill, and the Linear skill to set up a new project across all your tools.

## Why MCP Matters for Skills

MCP solves the key problems that prevented skills from being truly portable:

| Problem | MCP Solution |
|---------|--------------|
| Different APIs per tool | Standardized protocol |
| No capability discovery | `tools/list` endpoint |
| Inconsistent error handling | Structured error responses |
| No resource sharing | Resource URIs and types |
| Context management | Prompt templates |

## Building for the MCP Ecosystem

If you're building AI tools, MCP should be your integration standard:

1. **Expose your API as MCP** - Let any agent use your service
2. **Consume MCP skills** - Give your agent access to the ecosystem
3. **Contribute skills** - Build for the community

The [Skills Directory](/) catalogs MCP-compatible skills. Browse by category, search by capability, and find the skills your agents need.

## Getting Started

1. **Install Claude Code** - `npm install -g @anthropic-ai/claude-code`
2. **Add a skill** - `claude mcp add <skill-name>`
3. **Use it** - Ask Claude to use the skill's capabilities

Or build your own:
1. Use the [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk)
2. Define your tools, resources, and prompts
3. Test with Claude Code or Claude Desktop
4. [Share it](/add) with the community

The future of AI agents is **skills-based**, and MCP is the foundation. Write once, use everywhere.
