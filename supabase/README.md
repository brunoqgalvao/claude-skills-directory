# Supabase Setup

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from Settings > API

## 2. Run Migrations

In the Supabase Dashboard:

1. Go to **SQL Editor**
2. Run `migrations/001_initial_schema.sql` first
3. Then run `migrations/002_seed_data.sql`

Or use the Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

## 3. Enable GitHub OAuth

1. Go to **Authentication > Providers**
2. Enable **GitHub**
3. Create a GitHub OAuth App at https://github.com/settings/developers
   - Homepage URL: `https://your-app.vercel.app`
   - Callback URL: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret to Supabase

## 4. Environment Variables

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

For Vercel:
1. Go to your Vercel project settings
2. Add these environment variables
3. Redeploy

## 5. Install Supabase Client

```bash
pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs
```

## Database Schema

```
┌─────────────────┐     ┌─────────────────┐
│    authors      │     │    verticals    │
├─────────────────┤     ├─────────────────┤
│ id (uuid)       │     │ id (text)       │
│ name            │     │ name            │
│ github          │     │ icon            │
│ avatar_url      │     │ color           │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────┐
│               skills                     │
├─────────────────────────────────────────┤
│ id (text, PK)                           │
│ name, summary, description              │
│ author_id → authors                     │
│ repo_url, skill_md_url, docs_url        │
│ install_command, prerequisites[]        │
│ stars_count, installs_count, likes_count│
└─────────────────┬───────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             ▼             ▼
┌────────┐  ┌──────────┐  ┌──────────┐
│ likes  │  │ comments │  │ installs │
├────────┤  ├──────────┤  ├──────────┤
│user_id │  │ user_id  │  │ skill_id │
│skill_id│  │ skill_id │  │ user_id? │
└────────┘  │ content  │  │ source   │
            │ parent_id│  └──────────┘
            └──────────┘

┌─────────────────┐
│    profiles     │ ← auto-created on signup
├─────────────────┤
│ id → auth.users │
│ username        │
│ display_name    │
│ avatar_url      │
│ github_username │
└─────────────────┘
```

## Row Level Security

- **Skills, Authors, Verticals, Tags**: Public read access
- **Profiles**: Public read, users can update their own
- **Likes**: Public read, authenticated users can add/remove their own
- **Comments**: Public read, authenticated users can create, update/delete their own
- **Installs**: Anyone can log an install, users can see their own history

## Useful Queries

### Get skills with author and verticals
```sql
select
  s.*,
  a.name as author_name,
  a.github as author_github,
  array_agg(distinct v.name) as verticals,
  array_agg(distinct t.name) as tags
from skills s
left join authors a on s.author_id = a.id
left join skill_verticals sv on s.id = sv.skill_id
left join verticals v on sv.vertical_id = v.id
left join skill_tags st on s.id = st.skill_id
left join tags t on st.tag_id = t.id
where s.visibility = 'public'
group by s.id, a.id
order by s.likes_count desc;
```

### Check if user liked a skill
```sql
select exists(
  select 1 from likes
  where user_id = 'USER_UUID' and skill_id = 'skill-slug'
);
```
