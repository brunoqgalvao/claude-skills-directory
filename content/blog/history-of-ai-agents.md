---
title: "The History of AI Agents: From ELIZA to Agentic Skills"
date: "2025-12-25"
excerpt: "How AI evolved from simple chatbots to autonomous agents that use skills to accomplish complex tasks - and why this changes everything for developers."
author: "Skills Directory"
image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80"
sources:
  - title: "ELIZA - MIT Computer Science"
    url: "https://en.wikipedia.org/wiki/ELIZA"
  - title: "Expert Systems and AI History - Stanford"
    url: "https://plato.stanford.edu/entries/artificial-intelligence/"
  - title: "Toolformer: Language Models Can Teach Themselves to Use Tools"
    url: "https://arxiv.org/abs/2302.04761"
  - title: "ReAct: Synergizing Reasoning and Acting in Language Models"
    url: "https://arxiv.org/abs/2210.03629"
  - title: "Anthropic's Model Context Protocol"
    url: "https://modelcontextprotocol.io/"
  - title: "Claude Code Documentation"
    url: "https://docs.anthropic.com/en/docs/claude-code"
socialQuotes:
  - author: "Swyx"
    handle: "swyx"
    quote: "The most underrated unlock in AI right now is 'agent skills' - reusable, composable capabilities that any agent can pick up and use."
    platform: "X"
  - author: "Simon Willison"
    handle: "simonw"
    quote: "MCP is basically 'skills for agents' - standardized ways to give LLMs new capabilities without retraining."
    platform: "X"
  - author: "Harrison Chase"
    handle: "hwchase17"
    quote: "The future isn't just agents, it's agents with portable, shareable skills that compose together."
    platform: "X"
---

The landscape of Artificial Intelligence has undergone a profound transformation. What started as simple pattern matching has evolved into autonomous systems that can reason, plan, and execute complex workflows using **skills**.

## The Early Days: Pattern Matching (1960s-1980s)

In 1966, Joseph Weizenbaum created [ELIZA](https://en.wikipedia.org/wiki/ELIZA) at MIT. This simple chatbot used pattern matching to simulate a Rogerian psychotherapist. When you typed "I feel sad," ELIZA would respond "Why do you feel sad?" - not through understanding, but through text substitution rules.

ELIZA wasn't intelligent, but it demonstrated something important: **humans will anthropomorphize even simple systems**. This insight would prove foundational.

The 1970s and 80s brought **Expert Systems** - programs like MYCIN that encoded human expertise as if-then rules for medical diagnosis. These systems worked well in narrow domains but were:

- Brittle (couldn't handle edge cases)
- Expensive to maintain (required constant rule updates)
- Unable to learn or adapt

## The Machine Learning Revolution (1990s-2010s)

The shift from hand-coded rules to **learned patterns** changed everything. IBM's Deep Blue beat Kasparov in 1997, but it was IBM Watson's 2011 Jeopardy! victory that showed AI could handle unstructured, ambiguous data.

Key breakthroughs:
- **Neural networks** for pattern recognition
- **Deep learning** for hierarchical feature extraction
- **Transformers** (2017) for sequence modeling

But these systems still had a critical limitation: they could only work with data they were trained on. They couldn't **take action** in the real world.

## The Tool Use Breakthrough (2022-2023)

The game changed when researchers figured out how to give language models **tools**. Meta's [Toolformer](https://arxiv.org/abs/2302.04761) (2023) showed that models could learn to decide *when* and *how* to call external APIs.

Then came [ReAct](https://arxiv.org/abs/2210.03629) - a pattern where models reason about what to do, act using tools, observe the result, and iterate. This was the birth of **agentic AI**:

```
Thought: I need to find the current weather in Tokyo
Action: weather_api(location="Tokyo")
Observation: 15°C, partly cloudy
Thought: I have the information the user needs
Answer: It's currently 15°C and partly cloudy in Tokyo
```

## The Era of Agent Skills (2024-Present)

Today we're witnessing the emergence of **Agent Skills** - standardized, portable capabilities that any AI agent can use. Think of them as plugins, but for AI reasoning.

### What Makes a Skill?

A skill is:
1. **A defined capability** (e.g., "search GitHub issues")
2. **With a standard interface** (inputs, outputs, errors)
3. **That any compliant agent can use**

Anthropic's [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) provides the standard. Tools like [Claude Code](https://docs.anthropic.com/en/docs/claude-code) are the runtime.

### Why Skills Matter

Before skills, every AI integration was custom:
- Want Claude to use Slack? Write a custom integration.
- Want it to query your database? Write another integration.
- Switching AI providers? Rewrite everything.

With skills:
- Download a "Slack" skill → any MCP-compatible agent can use it
- Skills are **portable** across tools (Claude Code, Cursor, custom agents)
- The community can build and share skills

### Real-World Example

Here's how skills work in practice with Claude Code:

```bash
# Install a skill
claude mcp add linear-issues

# Now Claude can create, query, and manage Linear issues
# The skill defines what Claude can do and how
```

The skill provides Claude with:
- Knowledge of Linear's API
- Permission boundaries
- Error handling
- Best practices for the domain

## The Skills Pattern

The agent skills pattern is becoming the **standard architecture** for AI applications:

```
User Request
    ↓
Agent (LLM) ← Skills Registry
    ↓
Reasoning + Skill Selection
    ↓
Skill Execution
    ↓
Result + Learning
```

This pattern enables:

- **Composability**: Combine skills for complex workflows
- **Safety**: Skills define permission boundaries
- **Portability**: Same skills work across different agents
- **Community**: Developers can share and improve skills

## What's Next?

The trajectory is clear:

1. **More sophisticated skills** - Skills that can orchestrate other skills
2. **Skill marketplaces** - Discovering and installing skills becomes trivial
3. **Domain-specific skill collections** - "Legal skills," "DevOps skills," etc.
4. **Self-improving skills** - Skills that learn from usage

We're building the infrastructure for this future. The [Skills Directory](/) is a step toward making agent capabilities discoverable, installable, and shareable.

The question isn't whether AI agents will use skills - they already do. The question is: **what skills will you build?**
