import { supabase } from './supabase'

const CANDIDATAS_ORIGEM = [
  'origem',
  'categoria',
  'tipo',
  'colecao',
  'tipo_colecao',
] as const

let colunaOrigemCache: string | null | undefined

/** Lê VITE_COLUNA_ORIGEM se definida manualmente no .env */
function colunaOrigemDoEnv(): string | null {
  const valor = import.meta.env.VITE_COLUNA_ORIGEM?.trim()
  return valor || null
}

async function colunaExiste(nome: string): Promise<boolean> {
  const { error } = await supabase.from('tampinhas').select(nome).limit(1)
  return !error
}

/**
 * Descobre qual coluna do banco armazena Nacional/Internacional.
 * Retorna null se nenhuma coluna compatível existir.
 */
export async function obterColunaOrigem(force = false): Promise<string | null> {
  if (!force && colunaOrigemCache !== undefined) {
    return colunaOrigemCache
  }

  const doEnv = colunaOrigemDoEnv()
  if (doEnv) {
    const existe = await colunaExiste(doEnv)
    if (existe) {
      colunaOrigemCache = doEnv
      console.log(`[tampinhas] Coluna origem (via .env): ${doEnv}`)
      return doEnv
    }
    console.warn(`[tampinhas] VITE_COLUNA_ORIGEM="${doEnv}" não existe na tabela.`)
  }

  for (const candidata of CANDIDATAS_ORIGEM) {
    if (await colunaExiste(candidata)) {
      colunaOrigemCache = candidata
      console.log(`[tampinhas] Coluna origem detectada: ${candidata}`)
      return candidata
    }
  }

  colunaOrigemCache = null
  console.warn(
    '[tampinhas] Nenhuma coluna de origem encontrada (origem, categoria, tipo...). ' +
      'Execute supabase/migration_add_origem.sql no Supabase.',
  )
  return null
}

export function invalidarCacheColunas(): void {
  colunaOrigemCache = undefined
}

export async function colunasBaseExistem(): Promise<boolean> {
  const { error } = await supabase
    .from('tampinhas')
    .select('id, nome, pais, foto_url')
    .limit(1)

  return !error
}
