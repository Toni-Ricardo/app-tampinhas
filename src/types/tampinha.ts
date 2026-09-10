// src/types/tampinha.ts — ÚNICO lugar onde os tipos devem estar!

// Tipo Origem
export type Origem = 'Nacional' | 'Internacional'

// Interface Tampinha
export interface Tampinha {
  id: string
  nome: string
  pais: string
  cidade: string
  origem: Origem
  foto_url: string
  bandeira_url?: string   // ✅ COM UNDERLINE — bandeira_url
  created_at?: string
}

// Interface NovaTampinha (para cadastro)
export interface NovaTampinha {
  nome: string
  pais: string
  cidade: string
  origem: Origem
  foto: File // Arquivo de imagem
}