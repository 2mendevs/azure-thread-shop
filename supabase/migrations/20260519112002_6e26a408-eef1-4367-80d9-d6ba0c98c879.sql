
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  items jsonb not null,
  total numeric(10,2) not null,
  full_name text not null,
  phone text not null,
  address_line text not null,
  city text not null,
  state text not null,
  pincode text not null,
  payment_method text not null,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Users view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users create own orders" on public.orders for insert with check (auth.uid() = user_id);
