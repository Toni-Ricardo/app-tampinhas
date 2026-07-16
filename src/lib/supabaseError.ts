/**
 * Extrai mensagem legível de erros do Supabase (PostgrestError, StorageError, etc.).
 * Esses objetos nem sempre são instanceof Error.
 */
export function getSupabaseErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error

  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>
    const partes: string[] = []

    if (typeof err.message === 'string' && err.message) {
      partes.push(err.message)
    }
    if (typeof err.details === 'string' && err.details) {
      partes.push(err.details)
    }
    if (typeof err.hint === 'string' && err.hint) {
      partes.push(`Dica: ${err.hint}`)
    }
    if (typeof err.code === 'string' && err.code) {
      partes.push(`Código: ${err.code}`)

      if (err.code === 'PGRST204') {
        partes.push(
          'A coluna não existe no banco. Execute supabase/migration_add_origem.sql no SQL Editor do Supabase e aguarde ~10 segundos.',
        )
      }
    }
    if (typeof err.statusCode === 'string' || typeof err.statusCode === 'number') {
      partes.push(`HTTP: ${err.statusCode}`)
    }

    if (partes.length > 0) return partes.join(' — ')
  }

  return 'Erro ao comunicar com o Supabase.'
}

export function logSupabaseError(contexto: string, error: unknown, extra?: unknown): void {
  console.error(`[${contexto}] Erro Supabase:`, error)
  console.error(`[${contexto}] Mensagem:`, getSupabaseErrorMessage(error))
  if (extra !== undefined) {
    console.error(`[${contexto}] Contexto extra:`, extra)
  }
  if (error && typeof error === 'object') {
    console.error(`[${contexto}] JSON:`, JSON.stringify(error, null, 2))
  }
}

export function criarErroSupabase(contexto: string, error: unknown, extra?: unknown): Error {
  logSupabaseError(contexto, error, extra)
  return new Error(getSupabaseErrorMessage(error))
}
