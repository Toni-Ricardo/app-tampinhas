export type Origem = 'Nacional' | 'Internacional'

export interface Tampinha {
  id: string
  nome: string
  cidade: string // Adicionado para consistência
  pais: string
  origem: Origem
  foto_url: string
  created_at: string
}

export interface NovaTampinha {
  nome: string
  cidade: string
  pais: string
  origem: Origem
  foto: File
}