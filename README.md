# Claude Skills Directory (MVP)

Open-source, static, searchable directory of Claude Skills grouped by verticals.

## Quick start

```bash
pnpm install
pnpm validate
pnpm dev
# build static site
pnpm export
```

Deploy `out/` to GitHub Pages, Netlify, or Vercel static.

## Contribute a Skill

- Use the **Issue Form**: [Add a Skill](../../issues/new?template=add-skill.yml)
- Maintainers will review and add a JSON manifest to `/data/skills/<id>.json`.

## Data schema (minimal)

```json
{
  "id": "kebab-case-id",
  "name": "Skill Name",
  "summary": "≤180 chars",
  "verticals": ["Legal", "Finance"], // 1..3
  "tags": ["optional", "tags"],
  "links": {
    "repo": "https://...",       // any of these
    "skill_md": "https://...",   // at least one required
    "docs": "https://...",
    "demo": "https://..."
  },
  "last_updated": "YYYY-MM-DD"
}
```

## Local validation

Run `pnpm validate` to check schema, filename = id, duplicate ids, and link shape.

## Notes

- Day-1 scope: no auth, no ratings, no server API, rebuild on merge.
- Static export (`next export`) enabled in `next.config.mjs`.
- Update `lib/constants.ts` with your repo slug for "Add Skill".

## License

MIT
