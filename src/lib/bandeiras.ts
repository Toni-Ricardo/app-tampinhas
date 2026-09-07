export const MAPA_BANDEIRAS: Record<string, string> = {
  brasil: 'br',
  argentina: 'ar',
  uruguai: 'uy',
  paraguai: 'py',
  chile: 'cl',
  colômbia: 'co',
  colombia: 'co',
  peru: 'pe',
  venezuela: 've',
  equador: 'ec',
  bolívia: 'bo',
  bolivia: 'bo',
  'estados unidos': 'us',
  eua: 'us',
  usa: 'us',
  canadá: 'ca',
  canada: 'ca',
  méxico: 'mx',
  mexico: 'mx',
  cuba: 'cu',
  alemanha: 'de',
  itália: 'it',
  italia: 'it',
  portugal: 'pt',
  espanha: 'es',
  frança: 'fr',
  franca: 'fr',
  'reino unido': 'gb',
  inglaterra: 'gb',
  bélgica: 'be',
  belgica: 'be',
  'países baixos': 'nl',
  holanda: 'nl',
  irlanda: 'ie',
  escócia: 'gb-sct',
  'república tcheca': 'cz',
  'republica tcheca': 'cz',
  polônia: 'pl',
  polonia: 'pl',
  suíça: 'ch',
  suica: 'ch',
  áustria: 'at',
  austria: 'at',
  dinamarca: 'dk',
  suécia: 'se',
  suecia: 'se',
  noruega: 'no',
  grécia: 'gr',
  grecia: 'gr',
  japão: 'jp',
  japao: 'jp',
  china: 'cn',
  'coreia do sul': 'kr',
  austrália: 'au',
  australia: 'au',
  'nova zelândia': 'nz',
  'nova zelandia': 'nz',
  'áfrica do sul': 'za',
  'africa do sul': 'za',
  egito: 'eg',
  marrocos: 'ma',
}

// ✅ BANDEIRAS — Arquivos locais (com reconhecimento correto pelo nome)
export function bandeiraUrl(codigoPais: string | undefined): string | null {
  if (!codigoPais) return null

  const nomePais = String(codigoPais).trim().toLowerCase()

  // 🔍 Primeiro busca no MAPA para reconhecer o país corretamente
  let codigo = MAPA_BANDEIRAS[nomePais]

  // ↓ Se não encontrou no mapa, usa os 2 primeiros caracteres como reserva
  if (!codigo) {
    codigo = nomePais.slice(0, 2)
  }

  if (!codigo) return null

  // 📁 BANDEIRAS LOCAIS — todas que você já tem na pasta
  if (codigo === 'br') return '/bandeiras/brasil.png'
  if (codigo === 'us') return '/bandeiras/eua.png'
  if (codigo === 'pt') return '/bandeiras/portugal.png'
  if (codigo === 'ar') return '/bandeiras/argentina.png'
  if (codigo === 'bo') return '/bandeiras/bolivia.png'
  if (codigo === 'uy') return '/bandeiras/uruguai.png'
  if (codigo === 'py') return '/bandeiras/paraguai.png'
  if (codigo === 'cl') return '/bandeiras/chile.png'
  if (codigo === 'co') return '/bandeiras/colombia.png'
  if (codigo === 'ec') return '/bandeiras/equador.png'
  if (codigo === 'be') return '/bandeiras/belgica.png'

  // ⏳ Ainda sem imagem local
  return null
}