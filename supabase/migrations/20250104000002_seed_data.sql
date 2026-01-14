-- Skills Directory Seed Data
-- Run this after the initial schema migration

-- ============================================
-- VERTICALS
-- ============================================

insert into public.verticals (id, name, icon, color) values
  ('legal', 'Legal', 'scale', '#6366f1'),
  ('finance', 'Finance', 'dollar-sign', '#10b981'),
  ('sales', 'Sales', 'briefcase', '#f59e0b'),
  ('marketing', 'Marketing', 'megaphone', '#ec4899'),
  ('support', 'Support', 'headphones', '#8b5cf6'),
  ('hr', 'HR', 'users', '#14b8a6'),
  ('engineering', 'Engineering', 'wrench', '#3b82f6'),
  ('operations', 'Operations', 'settings', '#64748b'),
  ('data', 'Data', 'bar-chart-2', '#06b6d4'),
  ('design', 'Design', 'palette', '#f43f5e')
on conflict (id) do nothing;

-- ============================================
-- AUTHORS
-- ============================================

insert into public.authors (id, name, github) values
  ('a0000000-0000-0000-0000-000000000001', 'Skills Directory', 'skills-directory'),
  ('a0000000-0000-0000-0000-000000000002', 'Acme Legal Tech', 'acme-legal'),
  ('a0000000-0000-0000-0000-000000000003', 'FinanceAI', 'finance-ai'),
  ('a0000000-0000-0000-0000-000000000004', 'SupportOps', 'supportops')
on conflict (id) do nothing;

-- ============================================
-- TAGS
-- ============================================

insert into public.tags (id, name) values
  ('ai', 'AI'),
  ('code-analysis', 'Code Analysis'),
  ('refactoring', 'Refactoring'),
  ('automation', 'Automation'),
  ('openai', 'OpenAI'),
  ('case-law', 'Case Law'),
  ('citations', 'Citations'),
  ('research', 'Research'),
  ('briefs', 'Briefs'),
  ('litigation', 'Litigation'),
  ('pdf', 'PDF'),
  ('ocr', 'OCR'),
  ('csv', 'CSV'),
  ('receivables', 'Receivables'),
  ('accounting', 'Accounting'),
  ('classification', 'Classification'),
  ('routing', 'Routing'),
  ('support', 'Support'),
  ('customer-service', 'Customer Service')
on conflict (id) do nothing;

-- ============================================
-- SKILLS
-- ============================================

insert into public.skills (
  id, name, summary, author_id, visibility,
  repo_url, skill_md_url, docs_url, demo_url,
  install_command, prerequisites,
  stars_count, installs_count, likes_count,
  created_at, updated_at
) values
  (
    'codex',
    'Codex Integration',
    'Integrate OpenAI Codex CLI for automated code analysis, refactoring, and editing workflows with model selection and session management.',
    'a0000000-0000-0000-0000-000000000001',
    'public',
    'https://github.com/skills-directory/skill-codex',
    'https://raw.githubusercontent.com/skills-directory/skill-codex/main/SKILL.md',
    'https://skills-directory.github.io/skill-codex',
    null,
    'npx @skills/cli add codex',
    array['Codex CLI installed and available on PATH', 'Valid Codex credentials configured'],
    42, 1284, 0,
    '2025-12-20', '2025-12-20'
  ),
  (
    'legal-research-assistant',
    'Legal Research Assistant',
    'Search precedents and assemble citations for motions and briefs.',
    'a0000000-0000-0000-0000-000000000002',
    'public',
    'https://github.com/acme-legal/legal-research-skill',
    'https://raw.githubusercontent.com/acme-legal/legal-research-skill/main/SKILL.md',
    'https://acme-legal.dev/docs/legal-research',
    null,
    'npx @skills/cli add legal-research-assistant',
    null,
    156, 2847, 0,
    '2025-12-18', '2025-12-18'
  ),
  (
    'invoice-extractor',
    'Invoice Extractor',
    'Parse PDFs and export key fields to CSV for AR teams.',
    'a0000000-0000-0000-0000-000000000003',
    'public',
    'https://github.com/finance-ai/invoice-extractor-skill',
    'https://raw.githubusercontent.com/finance-ai/invoice-extractor-skill/main/SKILL.md',
    null,
    null,
    'npx @skills/cli add invoice-extractor',
    null,
    89, 987, 0,
    '2025-12-15', '2025-12-15'
  ),
  (
    'cs-ticket-triage',
    'CS Ticket Triage',
    'Classify and route support tickets to the right queues with reasons.',
    'a0000000-0000-0000-0000-000000000004',
    'public',
    'https://github.com/supportops/cs-ticket-triage-skill',
    null,
    null,
    'https://supportops.dev/demo',
    'npx @skills/cli add cs-ticket-triage',
    array['API key for your helpdesk platform'],
    34, 456, 0,
    '2025-12-10', '2025-12-10'
  )
on conflict (id) do nothing;

-- ============================================
-- SKILL <-> VERTICAL RELATIONSHIPS
-- ============================================

insert into public.skill_verticals (skill_id, vertical_id) values
  ('codex', 'engineering'),
  ('legal-research-assistant', 'legal'),
  ('invoice-extractor', 'finance'),
  ('invoice-extractor', 'operations'),
  ('cs-ticket-triage', 'support'),
  ('cs-ticket-triage', 'operations')
on conflict do nothing;

-- ============================================
-- SKILL <-> TAG RELATIONSHIPS
-- ============================================

insert into public.skill_tags (skill_id, tag_id) values
  ('codex', 'ai'),
  ('codex', 'code-analysis'),
  ('codex', 'refactoring'),
  ('codex', 'automation'),
  ('codex', 'openai'),
  ('legal-research-assistant', 'case-law'),
  ('legal-research-assistant', 'citations'),
  ('legal-research-assistant', 'research'),
  ('legal-research-assistant', 'briefs'),
  ('legal-research-assistant', 'litigation'),
  ('invoice-extractor', 'pdf'),
  ('invoice-extractor', 'ocr'),
  ('invoice-extractor', 'csv'),
  ('invoice-extractor', 'receivables'),
  ('invoice-extractor', 'accounting'),
  ('cs-ticket-triage', 'classification'),
  ('cs-ticket-triage', 'routing'),
  ('cs-ticket-triage', 'support'),
  ('cs-ticket-triage', 'customer-service')
on conflict do nothing;
