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

// ✅ BANDEIRA DO BRASIL — Arquivo local
export function bandeiraUrl(codigoPais: string | undefined): string | null {
  if (!codigoPais) return null
  
  const codigo = String(codigoPais).trim().toLowerCase().slice(0, 2)
  if (!codigo) return null

  // 🇧🇷 Brasil usa arquivo local
if (codigo === 'br') return '/bandeiras/brasil.png'
if (codigo === 'us') return '/bandeiras/eua.png'
if (codigo === 'ar') return '/bandeiras/argentina.png'


  // ← Para os outros países, mantenha o que já usava ou deixe como preferir
  // return `https://flagcdn.com/w160/${codigo}.png`
  return null // ou mantenha a FlagCDN para os demais
}
