create extension if not exists pgcrypto;

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.users(id) on delete cascade,
  receiver_id uuid not null references public.users(id) on delete cascade,
  content text not null check (char_length(trim(content)) > 0),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.messages
  add column if not exists is_read boolean not null default false;

create index if not exists messages_sender_receiver_created_idx
  on public.messages (sender_id, receiver_id, created_at desc);

create index if not exists messages_receiver_sender_created_idx
  on public.messages (receiver_id, sender_id, created_at desc);
