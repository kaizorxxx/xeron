-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
-- Stores public user information linked to auth.users
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  email text,
  avatar_url text,
  status text default 'active',
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  
  constraint username_length check (char_length(username) >= 3)
);

-- Ensure columns exist (idempotent updates for existing tables)
do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'email') then
    alter table public.profiles add column email text;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'status') then
    alter table public.profiles add column status text default 'active';
  end if;
end $$;

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Policies (Drop first to avoid error on re-run)
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- USER BALANCES TABLE
-- Persistent storage for user balances (Source of Truth for Redis)
create table if not exists public.user_balances (
  user_id uuid references auth.users not null primary key,
  balance bigint default 0 check (balance >= 0),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS for balances
alter table public.user_balances enable row level security;

drop policy if exists "Users can view own balance." on public.user_balances;
create policy "Users can view own balance."
  on public.user_balances for select
  using ( auth.uid() = user_id );

-- TRANSACTIONS TABLE
-- Stores history of deposits and usage
create table if not exists public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  amount bigint not null,
  type text check (type in ('deposit', 'usage', 'refund')) not null,
  description text,
  status text default 'completed',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS for transactions
alter table public.transactions enable row level security;

drop policy if exists "Users can view own transactions." on public.transactions;
create policy "Users can view own transactions."
  on public.transactions for select
  using ( auth.uid() = user_id );

-- AUTOMATION: Handle New User Signup
-- Automatically creates profile and balance entries when a user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Create profile
  insert into public.profiles (id, username, email, avatar_url)
  values (
    new.id, 
    new.raw_user_meta_data->>'username',
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  
  -- Initialize balance
  insert into public.user_balances (user_id, balance)
  values (new.id, 0);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function on every new user insert in auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
