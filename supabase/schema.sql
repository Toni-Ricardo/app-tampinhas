-- Tabela de tampinhas (estrutura completa usada pelo app)
create table if not exists public.tampinhas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  pais text not null,
  origem text not null default 'Nacional' check (origem in ('Nacional', 'Internacional')),
  foto_url text not null,
  created_at timestamptz not null default now()
);

-- Índice para busca por nome
create index if not exists tampinhas_nome_idx on public.tampinhas using gin (to_tsvector('portuguese', nome));

-- Habilitar RLS
alter table public.tampinhas enable row level security;

create policy "Permitir leitura pública"
  on public.tampinhas for select
  using (true);

create policy "Permitir inserção pública"
  on public.tampinhas for insert
  with check (true);

create policy "Permitir atualização pública"
  on public.tampinhas for update
  using (true);

create policy "Permitir exclusão pública"
  on public.tampinhas for delete
  using (true);

-- Bucket de storage para fotos das tampinhas
insert into storage.buckets (id, name, public)
values ('fotos-tampinhas', 'fotos-tampinhas', true)
on conflict (id) do nothing;

create policy "Fotos visíveis publicamente"
  on storage.objects for select
  using (bucket_id = 'fotos-tampinhas');

create policy "Upload de fotos permitido"
  on storage.objects for insert
  with check (bucket_id = 'fotos-tampinhas');

create policy "Atualização de fotos permitida"
  on storage.objects for update
  using (bucket_id = 'fotos-tampinhas');

create policy "Exclusão de fotos permitida"
  on storage.objects for delete
  using (bucket_id = 'fotos-tampinhas');
