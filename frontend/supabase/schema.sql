-- SpendSense AI — Supabase schema
-- Run this in the Supabase SQL editor to set up tables.

create table audits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  team_size text not null,
  use_case text not null,
  tool_data jsonb not null,
  total_spend numeric not null,
  total_savings numeric not null,
  audit_result jsonb not null
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text not null,
  company_name text,
  role text,
  audit_id uuid references audits(id),
  total_savings numeric,
  notified boolean default false
);

-- Rate limiting: track submissions per IP
create table rate_limits (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  created_at timestamptz default now()
);

create index on rate_limits(ip_hash, created_at);

-- Row Level Security
-- Audits are publicly readable (for share URLs), only insertable
alter table audits enable row level security;
create policy "audits_insert" on audits for insert with check (true);
create policy "audits_select" on audits for select using (true);

-- Leads are insert-only from client
alter table leads enable row level security;
create policy "leads_insert" on leads for insert with check (true);
