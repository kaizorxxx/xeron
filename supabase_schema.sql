-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
-- Stores public user information linked to auth.users
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  
  constraint username_length check (char_length(username) >= 3)
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- USER BALANCES TABLE
-- Persistent storage for user balances (Source of Truth for Redis)
create table public.user_balances (
  user_id uuid references auth.users not null primary key,
  balance bigint default 0 check (balance >= 0),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS for balances
alter table public.user_balances enable row level security;

create policy "Users can view own balance."
  on public.user_balances for select
  using ( auth.uid() = user_id );

-- TRANSACTIONS TABLE
-- Stores history of deposits and usage
create table public.transactions (
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

create policy "Users can view own transactions."
  on public.transactions for select
  using ( auth.uid() = user_id );

-- AUTOMATION: Handle New User Signup
-- Automatically creates profile and balance entries when a user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Create profile
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id, 
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'avatar_url'
  );
  
  -- Initialize balance
  insert into public.user_balances (user_id, balance)
  values (new.id, 0);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function on every new user insert in auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
