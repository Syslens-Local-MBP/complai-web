-- Profiles
create table public.profiles (
  id uuid references auth.users primary key,
  email text,
  company text,
  persona text default 'learner',
  onboarding_completed boolean default false,
  preferred_language text default 'de',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Gamification
create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  total_points integer default 0,
  level integer default 1,
  streak_days integer default 0,
  last_activity_date date,
  badges jsonb default '[]'::jsonb,
  articles_read integer default 0,
  assessments_completed integer default 0,
  created_at timestamptz default now()
);

-- Article reads
create table public.article_reads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  article_number integer not null,
  read_at timestamptz default now(),
  points_earned integer default 10
);

-- Highlights
create table public.highlights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  article_number integer not null,
  start_offset integer not null,
  end_offset integer not null,
  selected_text text,
  color text default 'yellow',
  note text,
  created_at timestamptz default now()
);

-- Assessments
create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  ai_system_name text not null,
  description text,
  answers jsonb,
  risk_level text,
  result_title text,
  ai_analysis jsonb,
  requirements_met integer default 0,
  total_requirements integer default 0,
  shared_with jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.article_reads enable row level security;
alter table public.highlights enable row level security;
alter table public.assessments enable row level security;

create policy "profiles: own" on public.profiles for all using (auth.uid() = id);
create policy "progress: own" on public.user_progress for all using (auth.uid() = user_id);
create policy "reads: own" on public.article_reads for all using (auth.uid() = user_id);
create policy "highlights: own" on public.highlights for all using (auth.uid() = user_id);
create policy "assessments: own" on public.assessments for all using (auth.uid() = user_id);

-- Trigger: create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, persona)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'persona', 'learner')
  );
  insert into public.user_progress (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
