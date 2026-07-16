# TR TAMPINHAS

Aplicativo web pessoal para catalogar tampinhas de garrafa com fotos, nome, país e origem (Nacional/Internacional). Integrado com **Supabase** (banco de dados + storage).

## Funcionalidades

- Listagem com coleções Nacional e Internacional
- Barra de pesquisa por marca ou nome
- Formulário modal para cadastrar com foto, nome, país e origem

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Supabase (PostgreSQL + Storage)

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. No **SQL Editor**, execute o script `supabase/schema.sql`
3. Copie `.env.example` para `.env` e preencha:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

As credenciais ficam em **Project Settings → API**.

### 3. Rodar o projeto

```bash
npm run dev
```

Acesse `http://localhost:5173`.

## Estrutura do projeto

```
src/
├── components/       # UI (cards, busca, modal)
├── lib/              # Cliente Supabase e funções de dados
├── types/            # Tipos TypeScript
├── App.tsx           # Página principal
└── main.tsx          # Entry point
supabase/
└── schema.sql        # Tabela, RLS e bucket de storage
```

## Banco de dados

Tabela `tampinhas`:

| Coluna      | Tipo        | Descrição              |
|-------------|-------------|------------------------|
| id          | uuid        | Identificador único    |
| nome        | text        | Nome da tampinha       |
| pais        | text        | País da cerveja        |
| origem      | text        | Nacional ou Internacional |
| foto_url    | text        | URL pública da foto    |
| created_at  | timestamptz | Data de cadastro       |

Fotos são armazenadas no bucket `fotos-tampinhas` do Supabase Storage.

Se a tabela já existir sem a coluna `origem`, execute `supabase/migration_add_origem.sql` no SQL Editor do Supabase.

## Scripts

| Comando         | Descrição              |
|-----------------|------------------------|
| `npm run dev`   | Servidor de desenvolvimento |
| `npm run build` | Build de produção      |
| `npm run preview` | Preview do build     |

## Próximos passos (sugestões)

- Autenticação para uso privado
- Edição e exclusão de tampinhas
- Filtro por país
- Visualização em detalhe
 
