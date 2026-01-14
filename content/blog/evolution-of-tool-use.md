---
title: "The Evolution of Tool Use in LLMs: From Prompt Hacks to Agent Skills"
date: "2025-12-24"
excerpt: "How language models learned to use tools - and how the 'skills' pattern is becoming the standard way to extend AI capabilities."
author: "Skills Directory"
image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80"
sources:
  - title: "Toolformer: Language Models Can Teach Themselves to Use Tools"
    url: "https://arxiv.org/abs/2302.04761"
  - title: "OpenAI Function Calling Documentation"
    url: "https://platform.openai.com/docs/guides/function-calling"
  - title: "Gorilla: Large Language Model Connected with APIs"
    url: "https://arxiv.org/abs/2305.15334"
  - title: "Model Context Protocol Specification"
    url: "https://spec.modelcontextprotocol.io/"
  - title: "Claude Code Skills Documentation"
    url: "https://docs.anthropic.com/en/docs/claude-code"
  - title: "LangChain Tools and Agents"
    url: "https://python.langchain.com/docs/modules/agents/"
socialQuotes:
  - author: "Andrej Karpathy"
    handle: "karpathy"
    quote: "LLMs are starting to look less like chatbots and more like operating systems. Tools/skills are the apps."
    platform: "X"
  - author: "Amelia Wattenberger"
    handle: "wikiDeli"
    quote: "The real power of AI isn't in the model - it's in what the model can DO. Skills are the missing piece."
    platform: "X"
  - author: "Logan Kilpatrick"
    handle: "logankilpatrick"
    quote: "Function calling changed how we build with LLMs. Skills are changing how LLMs work WITH us."
    platform: "X"
---

Large Language Models are incredibly knowledgeable - but for years, they were trapped. Limited to their training data. Unable to check today's weather, query a database, or send an email. The evolution of **tool use** broke them free.

## Phase 1: Prompt Engineering (2020-2022)

The first "tool use" was really just clever prompting. Developers would stuff examples into the context:

```
Example API call:
User: What's the weather in NYC?
Assistant: <API>weather(location="NYC")</API>
Result: 45°F, cloudy

Now answer this:
User: What's the weather in Tokyo?
```

This worked... sometimes. The model might output `<API>weather(location="Tokyo")</API>` and you could parse it. But it was fragile:

- Models would hallucinate API formats
- No guarantee of valid JSON
- Couldn't handle complex tool chains
- Required extensive prompt engineering per tool

## Phase 2: Fine-Tuned Tool Use (2023)

Meta's [Toolformer](https://arxiv.org/abs/2302.04761) paper changed the game. Instead of hoping models would format tool calls correctly, researchers **trained models to use tools**.

The key insight: you could automatically generate training data by:
1. Finding places in text where a tool call would help
2. Inserting candidate API calls
3. Keeping only calls that improved the model's predictions

Toolformer could use calculators, search engines, translators, and calendars - deciding on its own when to use each.

But there was a problem: **every new tool required retraining**.

## Phase 3: Function Calling (2023-2024)

[OpenAI's function calling](https://platform.openai.com/docs/guides/function-calling) and similar features from Anthropic solved the retraining problem. Instead of baking tools into the model, you describe tools at runtime:

```json
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name"
      }
    },
    "required": ["location"]
  }
}
```

The model learns to output structured calls to *any* function you describe. This was a massive unlock:

- **No retraining** - add tools dynamically
- **Structured output** - guaranteed valid JSON
- **Clear contracts** - models know what tools expect

But function calling still had limitations:
- Each app defined its own tools
- No standardization between providers
- Tools weren't shareable or portable

## Phase 4: The Skills Pattern (2024-Present)

The latest evolution is **Agent Skills** - standardized, portable tool definitions that work across different AI systems.

### What's Different About Skills?

Skills aren't just functions - they're **complete capability packages**:

| Function Calling | Agent Skills |
|-----------------|--------------|
| Single API endpoint | Complete capability with context |
| No state management | Can maintain state across calls |
| App-specific | Portable across tools |
| Developer-defined | Community-shareable |
| Just the call | Includes best practices, prompts, examples |

### Anatomy of a Skill

A skill includes:

1. **Capability Definition** - What it can do
2. **Interface Contract** - Inputs, outputs, errors
3. **Context/Prompts** - How to use it well
4. **Examples** - Common patterns
5. **Permission Boundaries** - What it's allowed to access

```yaml
# Example: GitHub Issues Skill
name: github-issues
description: Search, create, and manage GitHub issues
capabilities:
  - search_issues
  - create_issue
  - update_issue
  - add_comment
permissions:
  - read:issues
  - write:issues
prompts:
  system: "When searching issues, prefer specific queries over broad ones..."
examples:
  - user: "Find all open bugs in the auth module"
    assistant: "I'll search for open issues labeled 'bug' in paths containing 'auth'..."
```

### The MCP Standard

Anthropic's [Model Context Protocol (MCP)](https://spec.modelcontextprotocol.io/) is emerging as the standard for defining skills. It specifies:

- How tools advertise their capabilities
- How agents discover and invoke tools
- How to handle resources (files, data)
- How to manage prompts and context

With MCP, a skill written once works everywhere:
- Claude Code
- Claude Desktop
- Cursor (with MCP support)
- Any MCP-compatible agent

### Real-World Skills in Action

Here's how modern AI coding tools use skills:

**Claude Code:**
```bash
# Add a skill
claude mcp add nano-banana

# Now Claude can generate images
# The skill handles API calls, error handling, file management
```

**The Skill Provides:**
- Image generation API integration
- Automatic file saving with organized naming
- Error handling and retry logic
- Best practices for prompts

**Without the skill**, you'd write hundreds of lines of integration code. **With the skill**, it just works.

## The Skills Ecosystem

We're seeing the emergence of a skills ecosystem:

### Categories of Skills

1. **Data Skills** - Query databases, fetch APIs, parse files
2. **Action Skills** - Create tickets, send messages, deploy code
3. **Analysis Skills** - Run calculations, generate reports
4. **Creative Skills** - Generate images, write content
5. **Orchestration Skills** - Coordinate other skills

### Skill Discovery

The next challenge is **discovering the right skill**. That's why we built the [Skills Directory](/) - a searchable catalog of agent skills organized by:

- Use case (DevOps, Marketing, Legal, etc.)
- Capability (search, create, analyze, etc.)
- Compatibility (Claude Code, MCP, etc.)

## Building Skills

Want to create your own skill? The pattern is straightforward:

1. **Define the capability** - What problem does it solve?
2. **Implement the interface** - MCP server with tool definitions
3. **Add context** - Prompts, examples, best practices
4. **Test with real agents** - Claude Code, Cursor, etc.
5. **Share it** - Publish to the directory

Example MCP server structure:
```typescript
const server = new MCPServer({
  name: "my-skill",
  tools: [
    {
      name: "do_something",
      description: "Does something useful",
      inputSchema: { /* JSON Schema */ },
      handler: async (input) => { /* implementation */ }
    }
  ]
});
```

## What's Next?

The skills pattern is just getting started. We're seeing:

1. **Skill composition** - Skills that use other skills
2. **Learning skills** - Skills that improve from feedback
3. **Domain skill packs** - Curated collections for specific industries
4. **Skill marketplaces** - Easy installation and updates

The question is no longer "can AI use tools?" It's "what skills should AI have?" - and the answer is: **whatever skills you give it**.

Browse the [Skills Directory](/) to find skills for your workflow, or [add your own](/add) to share with the community.
