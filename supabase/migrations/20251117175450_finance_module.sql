-- Finance module core tables with RBAC friendly defaults
create extension if not exists "uuid-ossp";

create table if not exists public.prestadores (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  email text,
  tipo text check (tipo in ('fixo','variavel')),
  ativo boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.contas_a_pagar (
  id uuid primary key default uuid_generate_v4(),
  prestador_id uuid references public.prestadores(id),
  tipo text,
  descricao text,
  valor numeric(14,2),
  vencimento date,
  status text check (status in ('pendente','pago','cancelado')) default 'pendente',
  arquivo_url text,
  origem text default 'manual',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.pagamentos (
  id uuid primary key default uuid_generate_v4(),
  conta_id uuid references public.contas_a_pagar(id),
  prestador_id uuid references public.prestadores(id),
  descricao text,
  valor numeric(14,2),
  data_pagamento date,
  comprovante_url text,
  created_at timestamptz default now()
);

create table if not exists public.reembolsos (
  id uuid primary key default uuid_generate_v4(),
  prestador_id uuid references public.prestadores(id),
  descricao text,
  valor numeric(14,2),
  data_referencia date,
  status text check (status in ('aguardando','aprovado','recusado','pago')) default 'aguardando',
  arquivo_url text,
  created_at timestamptz default now()
);

create table if not exists public.adiantamentos (
  id uuid primary key default uuid_generate_v4(),
  prestador_id uuid references public.prestadores(id),
  motivo text,
  valor numeric(14,2),
  data date,
  documento_url text,
  created_at timestamptz default now()
);

create table if not exists public.nf_prestadores (
  id uuid primary key default uuid_generate_v4(),
  prestador_id uuid references public.prestadores(id),
  mes_competencia text,
  descricao text,
  nf_url text,
  created_at timestamptz default now()
);

create or replace function public.finance_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger contas_a_pagar_updated_at before update on public.contas_a_pagar
for each row execute function public.finance_updated_at();

alter table public.contas_a_pagar enable row level security;
alter table public.pagamentos enable row level security;
alter table public.reembolsos enable row level security;
alter table public.adiantamentos enable row level security;
alter table public.nf_prestadores enable row level security;

create table if not exists public.user_roles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  role text check (role in ('prestador','financeiro','admin')) not null,
  unique(user_id, role)
);

create or replace function public.has_finance_role(uid uuid, wanted text)
returns boolean language sql stable as $$
  select exists(select 1 from public.user_roles where user_id = uid and role = wanted);
$$;

-- RLS policies
create policy if not exists "contas_select_roles" on public.contas_a_pagar
for select using (
  has_finance_role(auth.uid(), 'financeiro') or has_finance_role(auth.uid(), 'admin') or prestador_id = auth.uid()
);

create policy if not exists "contas_insert_prestador" on public.contas_a_pagar
for insert with check (
  has_finance_role(auth.uid(), 'financeiro') or has_finance_role(auth.uid(), 'admin')
);

create policy if not exists "contas_update_roles" on public.contas_a_pagar
for update using (has_finance_role(auth.uid(), 'financeiro') or has_finance_role(auth.uid(), 'admin'));

create policy if not exists "pagamentos_select_roles" on public.pagamentos
for select using (has_finance_role(auth.uid(), 'financeiro') or has_finance_role(auth.uid(), 'admin'));

create policy if not exists "reembolsos_select_self" on public.reembolsos
for select using (prestador_id = auth.uid() or has_finance_role(auth.uid(), 'financeiro') or has_finance_role(auth.uid(), 'admin'));

create policy if not exists "reembolsos_insert_self" on public.reembolsos
for insert with check (prestador_id = auth.uid());

create policy if not exists "reembolsos_update_roles" on public.reembolsos
for update using (has_finance_role(auth.uid(), 'financeiro') or has_finance_role(auth.uid(), 'admin'));

create policy if not exists "adiantamentos_select_self" on public.adiantamentos
for select using (prestador_id = auth.uid() or has_finance_role(auth.uid(), 'financeiro') or has_finance_role(auth.uid(), 'admin'));

create policy if not exists "adiantamentos_insert_self" on public.adiantamentos
for insert with check (prestador_id = auth.uid());

create policy if not exists "adiantamentos_update_roles" on public.adiantamentos
for update using (has_finance_role(auth.uid(), 'financeiro') or has_finance_role(auth.uid(), 'admin'));

create policy if not exists "nf_select_self" on public.nf_prestadores
for select using (prestador_id = auth.uid() or has_finance_role(auth.uid(), 'financeiro') or has_finance_role(auth.uid(), 'admin'));

create policy if not exists "nf_insert_self" on public.nf_prestadores
for insert with check (prestador_id = auth.uid());

-- audit log (resumido)
create table if not exists public.finance_audit_log (
  id uuid primary key default uuid_generate_v4(),
  action text,
  entity text,
  entity_id uuid,
  performed_by uuid default auth.uid(),
  created_at timestamptz default now()
);
