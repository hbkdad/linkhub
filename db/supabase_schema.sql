create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  slug text unique not null,
  display_name text,
  headline text,
  bio text,
  avatar_url text,
  theme text default 'clean-dark',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  title text not null,
  url text not null,
  kind text default 'link',
  position int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table page_views (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  referrer text,
  user_agent text,
  created_at timestamptz default now()
);

create table link_clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid references links(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  referrer text,
  user_agent text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table links enable row level security;
alter table page_views enable row level security;
alter table link_clicks enable row level security;

create policy "Public profiles are readable" on profiles for select using (true);
create policy "Users manage own profile" on profiles for all using (auth.uid() = id);

create policy "Public links are readable" on links for select using (is_active = true);
create policy "Users manage own links" on links for all using (auth.uid() = profile_id);

create policy "Users view own analytics" on page_views for select using (auth.uid() = profile_id);
create policy "Anyone can insert page views" on page_views for insert with check (true);

create policy "Users view own clicks" on link_clicks for select using (auth.uid() = profile_id);
create policy "Anyone can insert clicks" on link_clicks for insert with check (true);
