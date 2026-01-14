-- Skills Directory Database Schema
-- Supabase Migration: Initial Schema

-- ============================================
-- EXTENSIONS
-- ============================================
create extension if not exists "uuid-ossp" with schema extensions;

-- ============================================
-- TABLES
-- ============================================

-- Authors table (skill creators)
create table public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  github text unique,
  avatar_url text,
  created_at timestamptz default now()
);

-- Verticals (categories)
create table public.verticals (
  id text primary key, -- e.g., 'engineering', 'legal', 'finance'
  name text not null,
  description text,
  icon text, -- lucide icon name
  color text, -- hex color
  created_at timestamptz default now()
);

-- Skills table (the main entity)
create table public.skills (
  id text primary key, -- slug, e.g., 'codex', 'invoice-extractor'
  name text not null,
  summary text not null,
  description text, -- longer markdown description
  author_id uuid references public.authors(id),
  visibility text default 'public' check (visibility in ('public', 'private', 'unlisted')),

  -- Links
  repo_url text,
  skill_md_url text,
  docs_url text,
  demo_url text,

  -- Installation
  install_command text,
  prerequisites text[], -- array of strings

  -- Stats (denormalized for performance)
  stars_count int default 0,
  installs_count int default 0,
  likes_count int default 0,
  comments_count int default 0,

  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  last_synced_at timestamptz -- for GitHub stats sync
);

-- Skill-to-vertical junction table (many-to-many)
create table public.skill_verticals (
  skill_id text references public.skills(id) on delete cascade,
  vertical_id text references public.verticals(id) on delete cascade,
  primary key (skill_id, vertical_id)
);

-- Tags table
create table public.tags (
  id text primary key, -- slug, e.g., 'ai', 'pdf', 'automation'
  name text not null
);

-- Skill-to-tag junction table (many-to-many)
create table public.skill_tags (
  skill_id text references public.skills(id) on delete cascade,
  tag_id text references public.tags(id) on delete cascade,
  primary key (skill_id, tag_id)
);

-- ============================================
-- USER ENGAGEMENT TABLES
-- ============================================

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  github_username text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Likes (users liking skills)
create table public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  skill_id text references public.skills(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique (user_id, skill_id)
);

-- Comments
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  skill_id text references public.skills(id) on delete cascade not null,
  parent_id uuid references public.comments(id) on delete cascade, -- for replies
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Installs tracking (anonymous or authenticated)
create table public.installs (
  id uuid primary key default gen_random_uuid(),
  skill_id text references public.skills(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null, -- nullable for anonymous
  installed_at timestamptz default now(),
  source text -- 'cli', 'web', etc.
);

-- ============================================
-- INDEXES
-- ============================================

create index idx_skills_author on public.skills(author_id);
create index idx_skills_visibility on public.skills(visibility);
create index idx_skills_created_at on public.skills(created_at desc);
create index idx_skills_likes_count on public.skills(likes_count desc);

create index idx_likes_user on public.likes(user_id);
create index idx_likes_skill on public.likes(skill_id);

create index idx_comments_skill on public.comments(skill_id);
create index idx_comments_user on public.comments(user_id);
create index idx_comments_parent on public.comments(parent_id);

create index idx_installs_skill on public.installs(skill_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Increment likes count on skill
create or replace function public.increment_likes_count()
returns trigger as $$
begin
  update public.skills
  set likes_count = likes_count + 1
  where id = new.skill_id;
  return new;
end;
$$ language plpgsql;

-- Decrement likes count on skill
create or replace function public.decrement_likes_count()
returns trigger as $$
begin
  update public.skills
  set likes_count = likes_count - 1
  where id = old.skill_id;
  return old;
end;
$$ language plpgsql;

-- Increment comments count on skill
create or replace function public.increment_comments_count()
returns trigger as $$
begin
  update public.skills
  set comments_count = comments_count + 1
  where id = new.skill_id;
  return new;
end;
$$ language plpgsql;

-- Decrement comments count on skill
create or replace function public.decrement_comments_count()
returns trigger as $$
begin
  update public.skills
  set comments_count = comments_count - 1
  where id = old.skill_id;
  return old;
end;
$$ language plpgsql;

-- Increment installs count on skill
create or replace function public.increment_installs_count()
returns trigger as $$
begin
  update public.skills
  set installs_count = installs_count + 1
  where id = new.skill_id;
  return new;
end;
$$ language plpgsql;

-- Handle new user signup - create profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url, github_username)
  values (
    new.id,
    new.raw_user_meta_data->>'user_name',
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'user_name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- ============================================
-- TRIGGERS
-- ============================================

create trigger on_skills_updated
  before update on public.skills
  for each row execute function public.handle_updated_at();

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger on_comments_updated
  before update on public.comments
  for each row execute function public.handle_updated_at();

create trigger on_like_created
  after insert on public.likes
  for each row execute function public.increment_likes_count();

create trigger on_like_deleted
  after delete on public.likes
  for each row execute function public.decrement_likes_count();

create trigger on_comment_created
  after insert on public.comments
  for each row execute function public.increment_comments_count();

create trigger on_comment_deleted
  after delete on public.comments
  for each row execute function public.decrement_comments_count();

create trigger on_install_created
  after insert on public.installs
  for each row execute function public.increment_installs_count();

-- Auto-create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

alter table public.authors enable row level security;
alter table public.verticals enable row level security;
alter table public.skills enable row level security;
alter table public.skill_verticals enable row level security;
alter table public.tags enable row level security;
alter table public.skill_tags enable row level security;
alter table public.profiles enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;
alter table public.installs enable row level security;

-- Public read access for catalog data
create policy "Public read access" on public.authors for select using (true);
create policy "Public read access" on public.verticals for select using (true);
create policy "Public read access" on public.skills for select using (visibility = 'public');
create policy "Public read access" on public.skill_verticals for select using (true);
create policy "Public read access" on public.tags for select using (true);
create policy "Public read access" on public.skill_tags for select using (true);

-- Profiles: public read, users can update own
create policy "Public profiles are viewable" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Likes: public read, authenticated users can insert/delete own
create policy "Likes are viewable" on public.likes for select using (true);
create policy "Users can like" on public.likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike" on public.likes for delete using (auth.uid() = user_id);

-- Comments: public read, authenticated users can insert, users can update/delete own
create policy "Comments are viewable" on public.comments for select using (true);
create policy "Users can comment" on public.comments for insert with check (auth.uid() = user_id);
create policy "Users can update own comments" on public.comments for update using (auth.uid() = user_id);
create policy "Users can delete own comments" on public.comments for delete using (auth.uid() = user_id);

-- Installs: insert allowed, select restricted
create policy "Anyone can log install" on public.installs for insert with check (true);
create policy "Users can see own installs" on public.installs for select using (auth.uid() = user_id);
