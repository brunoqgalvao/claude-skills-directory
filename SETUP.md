# Setup Instructions

## Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

## Quick Start

### 1. Install Dependencies

```bash
cd claude-skills-directory
pnpm install
```

### 2. Update Configuration

Edit `lib/constants.ts` and replace `YOUR_GH_USER` with your GitHub username:

```typescript
export const REPO_SLUG = "your-username/claude-skills-directory";
```

Also update the GitHub link in `app/layout.tsx` (footer).

### 3. Validate Data

```bash
pnpm validate
```

Expected output:
```
✓ invoice-extractor.json
✓ legal-research-assistant.json
✓ cs-ticket-triage.json

✅ 3 skills validated
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit http://localhost:3000

### 5. Test Features

- Search: Type in the search box or press `Cmd/Ctrl + K`
- Verticals: Click on vertical pills to filter
- Skill Detail: Click any skill card
- Add Skill: Navigate to `/add` to see the Issue Form link

### 6. Build Static Site

```bash
pnpm export
```

This creates an `out/` directory ready for deployment.

## Deployment Options

### GitHub Pages

1. Push to GitHub
2. Go to Settings → Pages
3. Source: GitHub Actions
4. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm export
      - uses: actions/upload-pages-artifact@v3
        with: { path: out }
      - uses: actions/deploy-pages@v4
```

### Netlify

```bash
# Install Netlify CLI
pnpm add -g netlify-cli

# Deploy
netlify deploy --prod --dir=out
```

### Vercel

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod
```

## Adding Skills

### Via GitHub Issues (Recommended)

1. Users click "Add Skill" on the site
2. Fill out the Issue Form
3. Maintainer reviews and adds JSON to `data/skills/`
4. Run `pnpm validate` before merging

### Manually

1. Create `data/skills/your-skill-id.json`:

```json
{
  "id": "your-skill-id",
  "name": "Your Skill Name",
  "summary": "Short description under 180 characters",
  "verticals": ["Engineering", "Data"],
  "tags": ["automation", "python"],
  "links": {
    "repo": "https://github.com/you/your-skill"
  },
  "last_updated": "2025-10-19"
}
```

2. Run `pnpm validate`
3. Commit and push

## File Structure

```
claude-skills-directory/
├── app/                    # Next.js pages
│   ├── page.tsx           # Home page
│   ├── v/[vertical]/      # Vertical filter pages
│   ├── skill/[slug]/      # Skill detail pages
│   └── add/               # Add skill info page
├── components/            # React components
├── lib/                   # Utilities & data loading
├── data/                  # JSON data source
│   ├── verticals.json
│   └── skills/*.json
├── scripts/               # Validation script
└── .github/               # Issue templates
```

## Customization

### Add New Verticals

Edit `data/verticals.json`:

```json
[
  { "name": "New Vertical", "emoji": "🚀" }
]
```

### Styling

- Colors: `tailwind.config.ts` → `theme.extend.colors.brand`
- Fonts: `app/layout.tsx` → Font imports
- Background: `app/globals.css` → Aurora gradient

### Analytics (Optional)

Add to `app/layout.tsx`:

```tsx
<Script src="https://analytics.example.com/script.js" />
```

## Troubleshooting

### Build Errors

```bash
# Clear cache
rm -rf .next out node_modules
pnpm install
pnpm build
```

### Validation Fails

- Check filename matches `id` field
- Ensure at least one link is provided
- Verify URLs start with `http://` or `https://`
- Check summary is ≤180 chars

### Types Not Working

```bash
# Regenerate Next.js types
pnpm next dev
# Wait for "ready" message, then stop
```

## Next Steps

1. Update `REPO_SLUG` in `lib/constants.ts`
2. Add your own skills to `data/skills/`
3. Customize branding (logo, colors, copy)
4. Deploy to your platform of choice
5. Share with the community!

## Support

- Issues: GitHub Issues
- Discussions: GitHub Discussions
- Docs: README.md
