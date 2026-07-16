import { invalidarCacheColunas, obterColunaOrigem } from './colunasTampinhas'
import { supabase } from './supabase'
import { criarErroSupabase } from './supabaseError'
import type { NovaTampinha, Origem, Tampinha } from '../types/tampinha'

const BUCKET = 'fotos-tampinhas'

function normalizarOrigem(valor: string): Origem {
  return valor === 'Internacional' ? 'Internacional' : 'Nacional'
}

function lerOrigemDaLinha(row: Record<string, unknown>, colunaOrigem: string | null): Origem {
  if (!colunaOrigem) return 'Nacional'
  return normalizarOrigem(String(row[colunaOrigem] ?? 'Nacional'))
}

function normalizarTampinha(
  row: Record<string, unknown>,
  colunaOrigem: string | null,
): Tampinha {
  return {
    id: String(row.id ?? ''),
    nome: String(row.nome ?? ''),
    cidade: String(row.cidade ?? ''), // Adicione esta linha
    pais: String(row.pais ?? ''),
    origem: lerOrigemDaLinha(row, colunaOrigem),
    foto_url: String(row.foto_url ?? ''),
    created_at: String(row.created_at ?? new Date().toISOString()),
  }
}
function montarPayloadInsert(
  dados: { nome: string; cidade: string; pais: string; origem: Origem; foto_url: string },
  colunaOrigem: string | null,
): Record<string, string> {
  const payload: Record<string, string> = {
    nome: dados.nome,
    cidade: dados.cidade, // Adicione esta linha
    pais: dados.pais,
    foto_url: dados.foto_url,
  }

  if (colunaOrigem) {
    payload[colunaOrigem] = dados.origem
  }

  return payload
}
function erroColunaInexistente(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const err = error as Record<string, unknown>
  return err.code === 'PGRST204'
}

export async function listarTampinhas(): Promise<Tampinha[]> {
  const colunaOrigem = await obterColunaOrigem()

  const { data, error } = await supabase
    .from('tampinhas')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw criarErroSupabase('listarTampinhas', error)

  return (data ?? []).map((row) =>
    normalizarTampinha(row as Record<string, unknown>, colunaOrigem),
  )
}

export async function cadastrarTampinha(nova: NovaTampinha): Promise<Tampinha> {
  const nome = nova.nome.trim()
  const pais = nova.pais.trim()
  const cidade = nova.cidade.trim() // Captura
  const origem = normalizarOrigem(nova.origem)

  if (!nome) throw new Error('O campo nome é obrigatório.')
  if (!pais) throw new Error('O campo pais é obrigatório.')
  if (!cidade) throw new Error('O campo cidade é obrigatório.')

  const extensao = nova.foto.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const caminho = `${crypto.randomUUID()}.${extensao}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(caminho, nova.foto, {
      cacheControl: '3600',
      upsert: false,
      contentType: nova.foto.type || `image/${extensao}`,
    })

  if (uploadError) throw criarErroSupabase('cadastrarTampinha:upload', uploadError, { caminho })

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(caminho)

  let colunaOrigem = await obterColunaOrigem()
  let payload = montarPayloadInsert(
    { nome, cidade, pais, origem, foto_url: urlData.publicUrl }, // Incluindo cidade
    colunaOrigem,
  )

  let { data, error } = await supabase
    .from('tampinhas')
    .insert(payload)
    .select('*')
    .maybeSingle()

  if (error && erroColunaInexistente(error) && colunaOrigem) {
    console.warn('[cadastrarTampinha] Coluna origem inválida, tentando sem ela...')
    invalidarCacheColunas()
    colunaOrigem = await obterColunaOrigem(true)
    payload = montarPayloadInsert(
      { nome, cidade, pais, origem, foto_url: urlData.publicUrl }, // Incluindo cidade aqui também
      colunaOrigem,
    )
    ;({ data, error } = await supabase
      .from('tampinhas')
      .insert(payload)
      .select('*')
      .maybeSingle())
  }

  if (error) throw criarErroSupabase('cadastrarTampinha:insert', error, payload)

  if (data) return normalizarTampinha(data as Record<string, unknown>, colunaOrigem)
  
  throw new Error('Erro ao salvar tampinha: retorno vazio do banco.')
}

/** Indica se o banco tem coluna para persistir Nacional/Internacional. */
export async function origemPersistivel(): Promise<boolean> {
  return (await obterColunaOrigem()) !== null
}

export function filtrarTampinhas(
  tampinhas: Tampinha[],
  termo: string,
  origem?: Origem | null,
): Tampinha[] {
  let resultado = tampinhas

  if (origem) {
    resultado = resultado.filter((t) => t.origem === origem)
  }

  const busca = termo.trim().toLowerCase()
  if (!busca) return resultado

  return resultado.filter(
    (t) =>
      t.nome.toLowerCase().includes(busca) ||
      t.pais.toLowerCase().includes(busca) ||
      t.cidade.toLowerCase().includes(busca),
  )
} // <--- ESTA CHAVETA FECHA A FUNÇÃO filtrarTampinhas

export function contarPorOrigem(tampinhas: Tampinha[], origem: Origem): number {
  return tampinhas.filter((t) => t.origem === origem).length
}