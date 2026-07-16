import { useCallback, useEffect, useMemo, useState } from 'react'
import { NovaTampinhaModal } from './components/NovaTampinhaModal'
import { SearchBar } from './components/SearchBar'
import { TampinhaGrid } from './components/TampinhaGrid'
import { cadastrarTampinha, contarPorOrigem, filtrarTampinhas, listarTampinhas } from './lib/tampinhas'
import { getSupabaseErrorMessage, logSupabaseError } from './lib/supabaseError'
import type { NovaTampinha, Origem, Tampinha } from './types/tampinha'

const MAPA_BANDEIRAS: Record<string, string> = {
    'brasil': 'br', 'argentina': 'ar', 'uruguai': 'uy', 'paraguai': 'py',
    'chile': 'cl', 'colômbia': 'co', 'colombia': 'co', 'peru': 'pe',
    'venezuela': 've', 'equador': 'ec', 'bolívia': 'bo', 'bolivia': 'bo',
    'estados unidos': 'us', 'eua': 'us', 'usa': 'us', 'canadá': 'ca',
    'canada': 'ca', 'méxico': 'mx', 'mexico': 'mx', 'cuba': 'cu',
    'alemanha': 'de', 'itália': 'it', 'italia': 'it', 'portugal': 'pt',
    'espanha': 'es', 'frança': 'fr', 'franca': 'fr', 'reino unido': 'gb',
    'inglaterra': 'gb', 'bélgica': 'be', 'belgica': 'be', 'países baixos': 'nl',
    'holanda': 'nl', 'irlanda': 'ie', 'escócia': 'gb-sct', 'república tcheca': 'cz',
    'republica tcheca': 'cz', 'polônia': 'pl', 'polonia': 'pl', 'suíça': 'ch',
    'suica': 'ch', 'áustria': 'at', 'austria': 'at', 'dinamarca': 'dk',
    'suécia': 'se', 'suecia': 'se', 'noruega': 'no', 'grécia': 'gr',
    'grecia': 'gr', 'japão': 'jp', 'japao': 'jp', 'china': 'cn',
    'coreia do sul': 'kr', 'austrália': 'au', 'australia': 'au',
    'nova zelândia': 'nz', 'nova zelandia': 'nz', 'áfrica do sul': 'za',
    'africa do sul': 'za', 'egito': 'eg', 'marrocos': 'ma',
}

export default function App() {
  const [tampinhas, setTampinhas] = useState<Tampinha[]>([])
  const [busca, setBusca] = useState('')
  
  /* Mantido em 'Inicial' para limpar o destaque laranja na abertura */
  const [filtroAtivo, setFiltroAtivo] = useState<'Inicial' | 'Todas' | 'Nacional' | 'Internacional'>('Inicial')
  
  const [loading, setLoading] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      const dados = await listarTampinhas()
      setTampinhas(dados)
    } catch (err) {
      logSupabaseError('App:carregar', err)
      setErro(getSupabaseErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  const totalTodas = tampinhas.length
  const totalNacional = useMemo(() => contarPorOrigem(tampinhas, 'Nacional'), [tampinhas])
  const totalInternacional = useMemo(() => contarPorOrigem(tampinhas, 'Internacional'), [tampinhas])
  
  const colecaoAtivaParaFiltro = useMemo<Origem | null>(() => {
    if (filtroAtivo === 'Nacional') return 'Nacional'
    if (filtroAtivo === 'Internacional') return 'Internacional'
    return null 
  }, [filtroAtivo])

  const tampinhasFiltradas = useMemo(() => {
    return filtrarTampinhas(tampinhas, busca, colecaoAtivaParaFiltro)
  }, [tampinhas, busca, colecaoAtivaParaFiltro])

  const tampinhasFormatadasParaExibicao = useMemo(() => {
    return tampinhasFiltradas.map((tampinha) => {
      const nomePais = tampinha.pais?.toLowerCase().trim() || ''
      const codigoIso = MAPA_BANDEIRAS[nomePais] || null
      return {
        ...tampinha,
        bandeira_url: codigoIso ? `https://flagcdn.com/w20/${codigoIso}.png` : null,
        origem_formatada: tampinha.origem?.toLowerCase().trim() === 'nacional' ? 'NAC.' : 'INT.'
      }
    })
  }, [tampinhasFiltradas])

  async function handleCadastro(dados: NovaTampinha) {
    await cadastrarTampinha(dados)
    await carregar()
  }

  return (
    <div className="min-h-screen bg-tr-bg text-slate-100 selection:bg-amber-500/20">
      
      {/* BARRA FIXA SUPERIOR COMPACTA */}
      <header className="border-b border-tr-border bg-tr-surface/75 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-3 px-4 py-3 sm:py-4">
          
          {/* IDENTIDADE LOGO + TÍTULO EM LINHA HRIZONTAL */}
          <div className="flex w-full flex-row items-center justify-center gap-4 border-b border-tr-border/40 pb-4 pt-1">
            
            {/* Box do Logotipo (Fundo Preto Absoluto) */}
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-amber-500/40 p-2.5 shadow-md shadow-amber-500/15">
              <img src="/logo.png" alt="Logo" className="h-full w-full object-contain brightness-110" />
            </div>

            {/* Bloco de Textos (Alinhado à esquerda em relação ao logo) */}
            <div className="text-left">
              {/* Título Estilizado */}
              <h1 className="font-ubuntu flex items-center gap-2 text-xl font-bold uppercase tracking-[0.15em] text-white sm:text-2xl">
                TR <span className="text-amber-500 font-extrabold">Tampinhas</span>
              </h1>

              {/* Slogan */}
              <p className="mt-0.5 text-sm tracking-wider text-tr-muted font-normal"><i>
                "A cada tampinha, uma história"</i>
              </p>
            </div>
          </div>

          {/* BARRA DE PESQUISA */}
          <div className="w-full max-w-2xl">
            <SearchBar value={busca} onChange={setBusca} />
          </div>

{/* SELETOR DE ABAS / BOTÕES EM DESTAQUE */}
          <div className="w-full max-w-2xl pt-0.5">
            <div className="grid grid-cols-3 gap-2.5">
              
              {/* BOTÃO: TODAS */}
              <button
                type="button"
                onClick={() => setFiltroAtivo('Todas')}
                className={`flex items-center justify-center gap-1.5 rounded-xl border bg-tr-bg h-11 font-bold uppercase tracking-wider text-xs sm:text-sm transition-all duration-200 active:scale-[0.98] ${
                  filtroAtivo === 'Todas'
                    ? 'border-amber-500/50 text-amber-500 shadow-sm shadow-white/10'
                    : 'border-tr-border text-slate-400 hover:bg-tr-surface-elevated hover:text-white hover:border-white/30'
                }`}
              >
                <span className={`${filtroAtivo === 'Todas' ? 'text-white' : 'text-amber-500'} text-base leading-none relative -top-[2px]`}>+</span>
                Todas
              </button>

              {/* BOTÃO: NACIONAL */}
              <button
                type="button"
                onClick={() => setFiltroAtivo('Nacional')}
                className={`flex items-center justify-center gap-1.5 rounded-xl border bg-tr-bg h-11 font-bold uppercase tracking-wider text-xs sm:text-sm transition-all duration-200 active:scale-[0.98] ${
                  filtroAtivo === 'Nacional'
                    ? 'border-amber-500/50 text-amber-500 shadow-sm shadow-white/10'
                    : 'border-tr-border text-slate-400 hover:bg-tr-surface-elevated hover:text-white hover:border-white/30'
                }`}
              >
                <span className={`${filtroAtivo === 'Nacional' ? 'text-white' : 'text-amber-500'} text-base leading-none relative -top-[2px]`}>+</span>
                Nacional
              </button>

              {/* BOTÃO: INTERNACIONAL */}
              <button
                type="button"
                onClick={() => setFiltroAtivo('Internacional')}
                className={`flex items-center justify-center gap-1.5 rounded-xl border bg-tr-bg h-11 font-bold uppercase tracking-wider text-xs sm:text-sm transition-all duration-200 active:scale-[0.98] ${
                  filtroAtivo === 'Internacional'
                    ? 'border-amber-500/50 text-amber-500 shadow-sm shadow-white/10'
                    : 'border-tr-border text-slate-400 hover:bg-tr-surface-elevated hover:text-white hover:border-white/30'
                }`}
              >
                <span className={`${filtroAtivo === 'Internacional' ? 'text-white' : 'text-amber-500'} text-base leading-none relative -top-[2px]`}>+</span>
                Internacional
              </button>

            </div>
            
            {/* LINHA DOS CONTADORES */}
            <div className="grid grid-cols-3 gap-2.5 text-center mt-1.5">
              <span className={`text-[11px] font-semibold tracking-wider ${filtroAtivo === 'Todas' ? 'text-white font-bold' : 'text-tr-muted'}`}>
                {totalTodas} un.
              </span>
              <span className={`text-[11px] font-semibold tracking-wider ${filtroAtivo === 'Nacional' ? 'text-white font-bold' : 'text-tr-muted'}`}>
                {totalNacional} un.
              </span>
              <span className={`text-[11px] font-semibold tracking-wider ${filtroAtivo === 'Internacional' ? 'text-white font-bold' : 'text-tr-muted'}`}>
                {totalInternacional} un.
              </span>
            </div>
          </div>        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL DO GRID */}
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6">
        
        {/* Botão Adicionar */}
        <div className="mb-8 flex justify-center">
          <button
            type="button"
            onClick={() => setModalAberto(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-tr-border bg-tr-surface px-8 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-200 shadow-sm transition-all duration-200 hover:border-amber-500/50 hover:text-amber-500 hover:bg-tr-surface-elevated active:scale-[0.98]"
          >
            <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Adicionar
          </button>
        </div>

        {erro && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
            {erro}
            <button type="button" onClick={carregar} className="ml-2 font-bold text-amber-500 underline">
              Tentar novamente
            </button>
          </div>
        )}

        <TampinhaGrid tampinhas={tampinhasFormatadasParaExibicao as any} loading={loading} />
      </main>

      <NovaTampinhaModal open={modalAberto} onClose={() => setModalAberto(false)} onSubmit={handleCadastro} />
    </div>
  )
}