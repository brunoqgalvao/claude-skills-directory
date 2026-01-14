# Skills Directory Strategy

## One-Liner

**"NPM for AI Agent Skills"** — Where all skills live. The best ones rise.

---

## The Bet

Be the **default destination**. Not the gatekeeper.

SkillsMP scraped 25k skills but has no engagement layer. Anthropic's official repo is too small. We become the place where:

- **Everything** gets listed (low barrier)
- **The best** gets surfaced (community signals)

Like Reddit: anyone can post, good stuff floats up.

---

## The Model: Social Curation

| Platform | Anyone Can Submit | Quality Surfaces Via |
|----------|-------------------|----------------------|
| Reddit | Yes | Upvotes, comments |
| npm | Yes | Downloads, stars |
| Product Hunt | Yes | Votes, engagement |
| **Us** | Yes | Installs, thumbs up, usage |

We're not the bouncer. We're the algorithm.

---

## Two Modes, One Place

**Discovery mode:** "Show me everything for legal automation"

- Comprehensive listing
- Filter by vertical, tags, agent type
- See all options

**Signal mode:** "Show me what actually works"

- Sort by installs
- Trending (velocity)
- Community thumbs up
- "Verified" badges for tested skills

Same directory. Different lenses.

---

## The Flywheel

```
More skills listed
       ↓
More users browsing
       ↓
More installs + votes
       ↓
Better signal on quality
       ↓
Users trust the directory
       ↓
Authors want to publish here
       ↓
More skills listed
```

---

## What We're Building

1. **Zero-friction listing** — Anyone can submit, minimal review
2. **Rich engagement signals** — Installs, thumbs up, comments, trending
3. **Best-in-class CLI** — The DX moat
4. **Multi-agent support** — Claude, Codex, ChatGPT, whatever's next
5. **Comprehensive coverage** — If a skill exists, it should be here

---

## Strategic Position

| What We Are | What We're Not |
|-------------|----------------|
| Multi-agent (Claude, Codex, ChatGPT+) | Claude-only |
| Community-curated (usage = quality) | Editorial gatekeepers |
| CLI-first DX | Web-only discovery |
| Open to all | Exclusive marketplace |
| Free forever | Revenue-seeking |

---

## The Wedge: Developer Experience

Everyone has a website. Nobody has a good CLI.

```bash
skill install legal-research    # not "clone this repo and copy to..."
skill search invoice            # not "browse our website"
skill update                    # not "check if there's a new version"
skill publish                   # not "submit a PR to our JSON file"
```

The bar is on the floor. We pick it up.

---

## Win Conditions

| Milestone | What It Proves |
|-----------|----------------|
| 500+ skills from community | We're the default place to list |
| Clear "winners" emerge per category | Organic curation is working |
| People check us before building | We're the first stop |
| "Is it on Skills Directory?" | We're the canonical source |

---

## What We're NOT Doing

- Rejecting submissions (except spam/malware)
- Editorial "staff picks" (let usage decide)
- Revenue model
- Limiting to one agent

---

## How We Win: Scrape + Curate + Simple CLI

### The Three Pillars

```
┌─────────────────────────────────────────────────────────────┐
│                      OUR MOAT                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   SCRAPE              CURATE              SIMPLE CLI         │
│   ──────              ──────              ──────────         │
│   Index everything    Surface the best    Do one thing well  │
│   from GitHub         via usage signals   • skill install    │
│                       • installs          • skill search     │
│   OpenSkills has      • ratings           • skill update     │
│   3.9k stars but      • trending                             │
│   no discovery                            Not 7 concepts.    │
│                       AITMPL has zero     Just skills.       │
│   SkillsMP has        curation signals                       │
│   25k skills but                                             │
│   no CLI                                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Why This Beats The Competition

| Competitor | What They Have | What We Add |
|------------|----------------|-------------|
| **SkillsMP** | 25k skills | CLI + curation |
| **OpenSkills** | Great CLI (3.9k stars) | Web discovery + curation |
| **AITMPL** | Slick UX, 14.4k stars | Curation signals + focus |

### What "Strong Curation" Means

Not editorial picks. **Algorithmic surfacing based on real usage:**

- Install counts (what people actually use)
- Thumbs up/down (quality signal)
- Trending (velocity — what's hot this week)
- Verified badges (tested, works as advertised)

The good stuff rises. The junk sinks.

### What "Simple CLI" Means

```bash
skill search pdf          # find skills
skill install pdf-reader  # install one
skill list                # what's installed
skill update              # update all
```

That's it. Not agents, commands, settings, hooks, MCPs, plugins, AND skills.

Just skills.

---

## Phase 2: Agent Execution (Maybe)

Triggered automation is interesting but not decided yet.

If we go there:

| Phase | What |
|-------|------|
| 2a | `skill run` — execute skills locally |
| 2b | Web playground — try in browser |
| 2c | Cloud deploy — scheduled/triggered |

But Phase 1 (scrape + curate + CLI) has to work first.
