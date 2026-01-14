# SEO & Paid Search Strategy
## Claude Skills Directory

**Key Insight:** Competitors are NOT running paid ads. This is an uncontested market. CPCs will be $0.10-0.50 instead of $2-5. First-mover advantage is massive.

---

## 1. Keyword Strategy

### Head-to-Head (Steal Their Traffic)
| Keyword | Target | Why |
|---------|--------|-----|
| skillsmp | SkillsMP.com | Direct competitor, 25k+ skills |
| mcp.so | MCP.so | 17k+ servers, adjacent market |
| smithery ai | Smithery.ai | MCP marketplace |
| awesome claude skills | GitHub repo | Curated list |
| pulsemcp | PulseMCP.com | MCP directory |
| glama mcp | Glama.ai | MCP hosting |
| claude code skills | Generic | Core product term |
| mcp servers | Generic | Adjacent market |

### Long-Tail (High Intent, Zero Competition)
| Keyword | Intent |
|---------|--------|
| best claude skills for lawyers | Vertical-specific |
| claude code finance automation | Vertical-specific |
| how to install claude skills | Tutorial seeker |
| claude code devops tools | Vertical-specific |
| free claude code extensions | Price-conscious |
| open source claude skills | Values-aligned |
| claude skills marketplace | Commercial |
| mcp server alternatives | Comparison shopper |

### Brand Defense
- claude skills directory
- skillsdirectory
- [your domain name]

---

## 2. Paid Search Campaign Structure

### Campaign 1: Competitor Conquest (40% budget)
**Goal:** Intercept users searching for competitors

| Ad Group | Keywords | Landing Page |
|----------|----------|--------------|
| SkillsMP | skillsmp, skills mp, skillsmp.com | `/vs/skillsmp` |
| MCP Directories | mcp.so, smithery, pulsemcp, glama mcp | `/vs/mcp` |
| GitHub Lists | awesome claude skills, claude skills github | `/` |

**Ad Copy:**
```
Headline 1: Looking for Claude Skills?
Headline 2: 100% Free & Open Source Directory
Headline 3: No Signup. No Paywall. Just Skills.
Description: Curated Claude Code skills organized by vertical. 
Legal, Finance, DevOps & more. Install in seconds. Community-driven.
```

### Campaign 2: Product (30% budget)
**Goal:** Capture generic product searches

| Ad Group | Keywords |
|----------|----------|
| Claude Skills | claude skills, claude code skills, claude code plugins |
| AI Coding | ai coding assistant, ai developer tools |
| MCP Adjacent | mcp servers, mcp tools, model context protocol |

**Ad Copy:**
```
Headline 1: Claude Skills Directory
Headline 2: Browse 100+ Skills by Category
Headline 3: Legal • Finance • DevOps • More
Description: Open source directory of Claude Code skills. 
Find exactly what you need. No account required. Install with one click.
```

### Campaign 3: Verticals (20% budget)
**Goal:** Capture vertical-specific searches

| Ad Group | Keywords | Landing Page |
|----------|----------|--------------|
| Legal | claude legal skills, ai legal tools, lawyer ai assistant | `/v/legal` |
| Finance | claude finance skills, ai finance tools, trading ai | `/v/finance` |
| DevOps | claude devops skills, ai devops tools, claude ci/cd | `/v/devops` |

### Campaign 4: Brand (10% budget)
**Goal:** Protect brand, cheap clicks

---

## 3. Budget Strategy

### Phase 1: Test (Week 1-2)
| Campaign | Daily | Goal |
|----------|-------|------|
| Competitor | $4 | Find winning keywords |
| Product | $4 | Baseline metrics |
| Verticals | $2 | Test demand |
| **Total** | **$10/day** | **$70/week** |

### Phase 2: Scale Winners (Week 3-4)
- 2x budget on campaigns with CPC < $0.50 and CTR > 3%
- Pause underperformers
- Target: $20/day

### Phase 3: Dominate (Month 2+)
- Max impression share on converting keywords
- Expand to YouTube/Display for remarketing
- Target: $50/day

### Expected Metrics (Uncontested Market)
| Metric | Typical | Our Estimate |
|--------|---------|--------------|
| CPC | $1-3 | $0.10-0.50 |
| CTR | 2-3% | 5-8% |
| Conversion Rate | 2-5% | 3-7% |
| Cost per Install | $5-20 | $1-3 |

---

## 4. Comparison Landing Pages (Critical)

Create these pages to capture competitor traffic:

### `/vs/skillsmp`
```
Title: Claude Skills Directory vs SkillsMP
H1: A Simpler Alternative to SkillsMP

| Feature | Us | SkillsMP |
| Open Source | ✓ | ✗ |
| No Account | ✓ | ? |
| Curated Quality | ✓ | Aggregated |
| Community Driven | ✓ | ✓ |
```

### `/vs/mcp`
```
Title: Claude Skills vs MCP Servers - What's the Difference?
H1: Skills vs MCP: Which Do You Need?

Explain the difference, position skills as simpler for most use cases.
Link to MCP directories for users who need that instead (builds trust).
```

---

## 5. SEO: On-Page Optimization

### Technical (Do First)
- [ ] `next-sitemap` package for sitemap.xml
- [ ] robots.txt allowing all crawlers
- [ ] Dynamic meta tags per skill page
- [ ] JSON-LD structured data (SoftwareApplication schema)
- [ ] OpenGraph images for social sharing

### Content Pages to Create
| Page | Target Keyword | Priority |
|------|----------------|----------|
| `/vs/skillsmp` | skillsmp alternative | High |
| `/vs/mcp` | mcp servers vs skills | High |
| `/v/legal` | claude legal skills | High |
| `/v/finance` | claude finance skills | High |
| `/v/devops` | claude devops skills | High |
| `/blog/getting-started` | how to use claude skills | Medium |
| `/blog/best-skills-2025` | best claude skills | Medium |

---

## 6. Tracking Setup

### Google Ads
```javascript
// Conversion events to track
gtag('event', 'conversion', {
  'send_to': 'AW-XXXXX/XXXXX',
  'event_category': 'skill_install'
});
```

### GA4 Events
| Event | Trigger | Value |
|-------|---------|-------|
| `skill_view` | Skill page load | - |
| `skill_install` | Install button click | Primary conversion |
| `search` | Search performed | - |
| `vertical_click` | Vertical filter used | - |
| `comparison_view` | /vs/* page view | High intent |

---

## 7. Execution Checklist

### This Week
- [ ] Create Google Ads account
- [ ] Set up GA4 with conversion tracking
- [ ] Build `/vs/skillsmp` comparison page
- [ ] Build `/vs/mcp` comparison page
- [ ] Launch Competitor campaign ($15/day)
- [ ] Launch Product campaign ($10/day)

### Next Week
- [ ] Analyze first week data
- [ ] Create vertical landing pages
- [ ] Launch Verticals campaign
- [ ] Add negative keywords from search terms report
- [ ] Set up remarketing audiences

### Month 1 Goals
| Metric | Target |
|--------|--------|
| Impressions | 15,000 |
| Clicks | 750 |
| Avg CPC | < $0.40 |
| Installs | 50 |
| Cost | ~$300 |

---

## 8. Competitive Intelligence

### Monitor These
- Set Google Alerts for competitor brand names
- Check if competitors start bidding (Auction Insights)
- Track their organic rankings (free Ahrefs)
- Watch for new entrants

### If Competitors Start Bidding
- Increase quality score (better landing pages)
- Expand to YouTube pre-roll ads
- Double down on long-tail
- Consider brand bidding truce (reach out)

---

## 9. Quick Reference: Ad Copy Templates

### Competitor Targeting
```
{Competitor} Alternative | 100% Free
Open Source Claude Skills Directory  
No Signup Required - Browse Now
```

### Product Generic
```
Claude Skills Directory | Free
Browse 100+ Skills by Vertical
Legal • Finance • DevOps & More
```

### Vertical Specific
```
Claude Skills for {Vertical}
Curated AI Tools for {Profession}s
Install in One Click - No Account
```

### Long-tail / Tutorial
```
How to Install Claude Skills
Step-by-Step Guide + Directory
Find the Perfect Skill for Your Workflow
```
