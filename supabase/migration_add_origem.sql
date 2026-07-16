-- ============================================================
-- EXECUTE NO SQL EDITOR DO SUPABASE
-- ============================================================

-- 1. Cria a coluna cidade se ela não existir
alter table public.tampinhas
  add column if not exists cidade text;

-- 2. Define um valor padrão para registros que já existem, para evitar erro de not null
update public.tampinhas
  set cidade = 'Nao informada'
  where cidade is null;

-- 3. Define a coluna como obrigatória (opcional, remova se preferir deixar opcional)
alter table public.tampinhas
  alter column cidade set not null;

-- 4. Mantém as colunas de origem e pais (já existentes)
alter table public.tampinhas
  add column if not exists origem text default 'Nacional';

alter table public.tampinhas
  add column if not exists pais text default 'Nao informado';

-- 5. Recarrega o cache do PostgREST (PASSO MAIS IMPORTANTE)
notify pgrst, 'reload schema';