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

create trigger if not exists contas_a_pagar_updated_at before update on public.contas_a_pagar
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

-- RLS policies (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'contas_a_pagar'
      AND policyname = 'contas_select_roles'
  ) THEN
    CREATE POLICY contas_select_roles
      ON public.contas_a_pagar
      FOR SELECT
      TO authenticated
      USING ( /* your expression here, e.g. tenant_id = (auth.jwt() ->> 'tenant_id')::uuid */ );
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'contas_a_pagar'
      AND policyname = 'contas_insert_prestador'
  ) THEN
    CREATE POLICY "contas_insert_prestador"
      ON public.contas_a_pagar
      FOR INSERT
      TO authenticated
      WITH CHECK (
        -- put your condition here, for example:
        (SELECT auth.uid()) = prestador_id
      );
  END IF;
END
$$;

-- Replace CREATE POLICY IF NOT EXISTS with DROP IF EXISTS + CREATE for portability
DROP POLICY IF EXISTS "contas_update_roles" ON public.contas_a_pagar;
CREATE POLICY "contas_update_roles"
  ON public.contas_a_pagar
  FOR UPDATE
  TO authenticated
  USING (has_finance_role((SELECT auth.uid())::uuid, 'financeiro') OR has_finance_role((SELECT auth.uid())::uuid, 'admin'));

DROP POLICY IF EXISTS "pagamentos_select_roles" ON public.pagamentos;
CREATE POLICY "pagamentos_select_roles"
  ON public.pagamentos
  FOR SELECT
  TO authenticated
  USING (has_finance_role((SELECT auth.uid())::uuid, 'financeiro') OR has_finance_role((SELECT auth.uid())::uuid, 'admin'));

DROP POLICY IF EXISTS "reembolsos_select_self" ON public.reembolsos;
CREATE POLICY "reembolsos_select_self"
  ON public.reembolsos
  FOR SELECT
  TO authenticated
  USING (prestador_id = (SELECT auth.uid())::uuid OR has_finance_role((SELECT auth.uid())::uuid, 'financeiro') OR has_finance_role((SELECT auth.uid())::uuid, 'admin'));

DROP POLICY IF EXISTS "reembolsos_insert_self" ON public.reembolsos;
CREATE POLICY "reembolsos_insert_self"
  ON public.reembolsos
  FOR INSERT
  TO authenticated
  WITH CHECK (prestador_id = (SELECT auth.uid())::uuid);

DROP POLICY IF EXISTS "reembolsos_update_roles" ON public.reembolsos;
CREATE POLICY "reembolsos_update_roles"
  ON public.reembolsos
  FOR UPDATE
  TO authenticated
  USING (has_finance_role((SELECT auth.uid())::uuid, 'financeiro') OR has_finance_role((SELECT auth.uid())::uuid, 'admin'));

DROP POLICY IF EXISTS "adiantamentos_select_self" ON public.adiantamentos;
CREATE POLICY "adiantamentos_select_self"
  ON public.adiantamentos
  FOR SELECT
  TO authenticated
  USING (prestador_id = (SELECT auth.uid())::uuid OR has_finance_role((SELECT auth.uid())::uuid, 'financeiro') OR has_finance_role((SELECT auth.uid())::uuid, 'admin'));

DROP POLICY IF EXISTS "adiantamentos_insert_self" ON public.adiantamentos;
CREATE POLICY "adiantamentos_insert_self"
  ON public.adiantamentos
  FOR INSERT
  TO authenticated
  WITH CHECK (prestador_id = (SELECT auth.uid())::uuid);

DROP POLICY IF EXISTS "adiantamentos_update_roles" ON public.adiantamentos;
CREATE POLICY "adiantamentos_update_roles"
  ON public.adiantamentos
  FOR UPDATE
  TO authenticated
  USING (has_finance_role((SELECT auth.uid())::uuid, 'financeiro') OR has_finance_role((SELECT auth.uid())::uuid, 'admin'));

DROP POLICY IF EXISTS "nf_select_self" ON public.nf_prestadores;
CREATE POLICY "nf_select_self"
  ON public.nf_prestadores
  FOR SELECT
  TO authenticated
  USING (prestador_id = (SELECT auth.uid())::uuid OR has_finance_role((SELECT auth.uid())::uuid, 'financeiro') OR has_finance_role((SELECT auth.uid())::uuid, 'admin'));

DROP POLICY IF EXISTS "nf_insert_self" ON public.nf_prestadores;
CREATE POLICY "nf_insert_self"
  ON public.nf_prestadores
  FOR INSERT
  TO authenticated
  WITH CHECK (prestador_id = (SELECT auth.uid())::uuid);

-- audit log (resumido)
create table if not exists public.finance_audit_log (
  id uuid primary key default uuid_generate_v4(),
  action text,
  entity text,
  entity_id uuid,
  performed_by uuid default auth.uid(),
  created_at timestamptz default now()
);
