-- Skill Overrides Table
-- Allows curators to override scraped data without modifying source

-- ============================================
-- OVERRIDE / CURATION TABLE
-- ============================================

-- Skill sources (where we scraped from)
create table public.skill_sources (
  id uuid primary key default gen_random_uuid(),
  skill_id text references public.skills(id) on delete cascade not null,
  source_type text not null check (source_type in ('github', 'skillsmp', 'mcp.so', 'manual', 'awesome-list')),
  source_url text not null,
  source_repo text, -- e.g., 'anthropics/skills'
  source_path text, -- e.g., 'skills/mcp-builder'
  raw_data jsonb, -- original scraped data
  scraped_at timestamptz default now(),
  unique (skill_id, source_url)
);

-- Skill overrides (curator edits)
create table public.skill_overrides (
  id uuid primary key default gen_random_uuid(),
  skill_id text references public.skills(id) on delete cascade not null unique,

  -- Fields that can be overridden (null = use original)
  name text,
  summary text,
  description text,

  -- Curation flags
  quality_tier text check (quality_tier in ('A', 'B', 'C')),
  is_featured boolean default false,
  is_verified boolean default false,
  is_excluded boolean default false, -- hide from directory
  exclusion_reason text,

  -- Curator notes (internal)
  curator_notes text,

  -- Who and when
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- INDEXES
-- ============================================

create index idx_skill_sources_skill on public.skill_sources(skill_id);
create index idx_skill_sources_type on public.skill_sources(source_type);
create index idx_skill_overrides_featured on public.skill_overrides(is_featured) where is_featured = true;
create index idx_skill_overrides_excluded on public.skill_overrides(is_excluded) where is_excluded = true;

-- ============================================
-- TRIGGERS
-- ============================================

create trigger on_skill_overrides_updated
  before update on public.skill_overrides
  for each row execute function public.handle_updated_at();

-- ============================================
-- RLS POLICIES
-- ============================================

alter table public.skill_sources enable row level security;
alter table public.skill_overrides enable row level security;

-- Public can read sources
create policy "Public read access" on public.skill_sources for select using (true);

-- Public can read overrides (for frontend display)
create policy "Public read access" on public.skill_overrides for select using (true);

-- Only authenticated users with curator role can modify (TODO: add roles table)
-- For now, any authenticated user can create overrides
create policy "Authenticated users can create overrides"
  on public.skill_overrides for insert
  with check (auth.uid() is not null);

create policy "Creators can update own overrides"
  on public.skill_overrides for update
  using (auth.uid() = created_by);

-- ============================================
-- HELPER VIEW: Skills with overrides applied
-- ============================================

create or replace view public.skills_curated as
select
  s.id,
  coalesce(o.name, s.name) as name,
  coalesce(o.summary, s.summary) as summary,
  coalesce(o.description, s.description) as description,
  s.author_id,
  s.visibility,
  s.repo_url,
  s.skill_md_url,
  s.docs_url,
  s.demo_url,
  s.install_command,
  s.prerequisites,
  s.stars_count,
  s.installs_count,
  s.likes_count,
  s.comments_count,
  s.created_at,
  s.updated_at,
  -- Override metadata
  coalesce(o.quality_tier, 'C') as quality_tier,
  coalesce(o.is_featured, false) as is_featured,
  coalesce(o.is_verified, false) as is_verified,
  coalesce(o.is_excluded, false) as is_excluded
from public.skills s
left join public.skill_overrides o on s.id = o.skill_id
where s.visibility = 'public'
  and coalesce(o.is_excluded, false) = false;
