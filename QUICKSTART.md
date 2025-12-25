# Quick Start Guide

## 🚀 Get Running in 3 Steps

### Step 1: Update Configuration (2 minutes)

Open `lib/constants.ts` and replace the placeholder:

```typescript
// BEFORE
export const REPO_SLUG = "YOUR_GH_USER/claude-skills-directory";

// AFTER (example)
export const REPO_SLUG = "brunogalvao/claude-skills-directory";
```

### Step 2: Run Development Server

```bash
cd claude-skills-directory

# Start dev server (already has dependencies installed)
npx next dev -p 3333
```

Open http://localhost:3333 in your browser.

### Step 3: Deploy

```bash
# Build is already done! Static files are in out/
# Just deploy the out/ directory to:

# Option 1: Netlify
netlify deploy --prod --dir=out

# Option 2: Vercel
vercel --prod

# Option 3: GitHub Pages
# Push to GitHub and configure Pages to serve from out/
```

---

## 📝 Common Tasks

### Validate Data

```bash
pnpm validate
```

Expected output:
```
✓ cs-ticket-triage.json
✓ invoice-extractor.json
✓ legal-research-assistant.json

✅ 3 skills validated
```

### Add a New Skill

Create `data/skills/my-skill.json`:

```json
{
  "id": "my-skill",
  "name": "My Awesome Skill",
  "summary": "Does something amazing in under 180 characters",
  "verticals": ["Engineering", "Data"],
  "tags": ["automation", "ai"],
  "links": {
    "repo": "https://github.com/you/my-skill"
  },
  "last_updated": "2025-10-19"
}
```

Then validate:

```bash
pnpm validate
```

### Rebuild for Production

```bash
pnpm build
# New static files will be in out/
```

---

## 🎨 Customization

### Change Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  brand: {
    400: "#YOUR_COLOR",  // Primary brand color
    500: "#YOUR_COLOR",  // Darker shade
    // etc.
  }
}
```

### Add/Remove Verticals

Edit `data/verticals.json`:

```json
[
  { "name": "Your Vertical", "emoji": "🚀" }
]
```

### Update Site Title

Edit `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "Your Custom Title",
  description: "Your custom description"
};
```

---

## 🔍 Testing Checklist

- [ ] Home page loads with all 3 skills
- [ ] Search works (try typing "invoice")
- [ ] Press K to focus search
- [ ] Click a vertical pill to filter
- [ ] Click a skill card to see details
- [ ] All skill links open correctly
- [ ] Responsive on mobile (resize browser)
- [ ] "Add Skill" page has correct GitHub link

---

## 📚 More Info

- Full setup guide: `SETUP.md`
- Project status: `STATUS.md`
- Main readme: `README.md`
- License: `LICENSE`

---

**Current Build Status:** ✅ Ready to deploy

**Static Export:** Already generated in `out/` directory

**Validation:** ✅ All 3 skills passing

**Dev Server:** Working on port 3333

Just update `REPO_SLUG` and deploy! 🎉
