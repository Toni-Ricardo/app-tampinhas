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
  
  const [filtroAtivo, setFiltroAtivo] = useState<'Inicial' | 'Todas' | 'Nacional' | 'Internacional'>('Inicial')
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)
  
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
      
      {/* ✅ CABEÇALHO FIXO */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-3 px-3 py-3 sm:px-4 sm:py-4">
          
          {/* ✅ LINHA SUPERIOR: LOGO + TÍTULO + BOTÃO ADICIONAR + BOTÃO MENU */}
          <div className="flex w-full flex-row items-center justify-between gap-3 border-b border-tr-border/40 pb-3 pt-1">
            
            {/* LADO ESQUERDO - LOGO E TÍTULO */}
            <div className="flex items-center gap-3">
              <div className="holographic-border float-effect flex-shrink-0 p-0.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tr-surface p-2">
                  <img src="/logo.png" alt="Logo" className="h-full w-full object-contain brightness-110" />
                </div>
              </div>

              <div className="text-left">
                <h1 className="font-ubuntu flex items-center gap-2 text-lg font-bold uppercase tracking-[0.12em] text-white sm:text-2xl">
                  TR <span className="text-amber-500 font-extrabold">Tampinhas</span>
                </h1>
                <p className="mt-0.5 text-xs tracking-wider text-tr-muted font-normal italic">
                  "A cada tampinha uma história"
                </p>
              </div>
            </div>

            {/* ✅ LADO DIREITO: BOTÃO ADICIONAR + BOTÃO MENU */}
            <div className="flex items-center gap-5 text-amber-500 text-2xl font-normal leading-none select-none -mt-1">
              {/* Botão Adicionar - igual estilo do botão Menu */}
              <button
                type="button"
                onClick={() => setModalAberto(true)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-tr-border/70 text-tr-muted transition-all duration-200 hover:border-amber-500/50 hover:text-amber-500 hover:bg-tr-surface"
                title="Adicionar tampinha"
              >
                <span className="text-amber-500 text-2xl font-normal leading-none select-none -mt-1">+</span>
              </button>

              {/* ✅ Botão de Menu — ÍCONE LARANJA, BORDA INALTERADA */}
              <button
                onClick={() => setFiltrosAbertos(!filtrosAbertos)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-tr-border/70 text-amber-400 transition-all duration-200 hover:border-amber-500/50 hover:text-amber-400 hover:bg-tr-surface"
                title={filtrosAbertos ? "Fechar menu" : "Abrir menu"}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>            </div>
          </div>

          {/* ✅ ÁREA OCULTA: PESQUISA + BOTÕES DE FILTRO NA MESMA LINHA */}
          <div 
            className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
              filtrosAbertos ? 'max-h-[200px] opacity-100 mt-1' : 'max-h-0 opacity-0'
            }`}
          >
            {/* Barra de Pesquisa */}
            <div className="w-full max-w-2xl mx-auto mb-3">
              <SearchBar value={busca} onChange={setBusca} />
            </div>

            {/* ✅ TRÊS BOTÕES NA MESMA LINHA - ÍCONES AUMENTADOS */}
            <div className="w-full max-w-2xl mx-auto">
              <div className="grid grid-cols-3 gap-2">
                
                {/* BOTÃO NACIONAL - BANDEIRA DO BRASIL (MAIOR) */}
                <button
                  type="button"
                  onClick={() => setFiltroAtivo('Nacional')}
                  className={`flex items-center justify-between gap-1.5 rounded-xl border h-10 px-3 font-bold tracking-wider text-xs transition-all duration-200 active:scale-[0.97] ${
                    filtroAtivo === 'Nacional'
                      ? 'border-amber-500/60 text-amber-500 bg-tr-bg'
                      : 'border-tr-border text-slate-300 hover:border-amber-500/40 hover:text-white bg-tr-bg'
                  }`}
                >
                  <span className="flex items-center justify-center text-amber-500 text-base leading-none h-full">+</span>
                  {/* ✅ Bandeira aumentada */}
                  <img src="https://flagcdn.com/w40/br.png" alt="Brasil" className="h-5 w-7 rounded-sm object-cover" />
                  <span className="text-[11px] font-normal text-tr-muted normal-case">{totalNacional} un.</span>
                </button>

                {/* BOTÃO INTERNACIONAL - IMAGEM MUNDO 32x32px */}
                <button
                  type="button"
                  onClick={() => setFiltroAtivo('Internacional')}
                  className={`flex items-center justify-between gap-1.5 rounded-xl border h-10 px-3 font-bold tracking-wider text-xs transition-all duration-200 active:scale-[0.97] ${
                    filtroAtivo === 'Internacional'
                      ? 'border-amber-500/60 text-amber-500 bg-tr-bg'
                      : 'border-tr-border text-slate-300 hover:border-amber-500/40 hover:text-white bg-tr-bg'
                  }`}
                >
                  <span className="flex items-center justify-center text-amber-500 text-base leading-none h-full">+</span>
                  {/* ✅ Imagem mundo.png no tamanho exato 32×32px */}
                  <img src="/mundo.png" alt="Internacional" className="w-8 h-8 object-contain" />
                  <span className="text-[11px] font-normal text-tr-muted normal-case">{totalInternacional} un.</span>
                </button>
                {/* BOTÃO TODAS */}
                <button
                  type="button"
                  onClick={() => setFiltroAtivo('Todas')}
                  className={`flex items-center justify-between gap-1.5 rounded-xl border h-10 px-3 font-bold tracking-wider text-xs transition-all duration-200 active:scale-[0.97] ${
                    filtroAtivo === 'Todas'
                      ? 'border-amber-500/60 text-amber-500 bg-tr-bg'
                      : 'border-tr-border text-slate-300 hover:border-amber-500/40 hover:text-white bg-tr-bg'
                  }`}
                >
                  <span className="flex items-center justify-center text-amber-500 text-base leading-none h-full">+</span>
                  TODAS
                  <span className="text-[11px] font-normal text-tr-muted normal-case">{totalTodas} un.</span>
                </button>
              </div>
            </div>          </div>        
        </div>
      </header>

      {/* ✅ ESPAÇO PARA O CONTEÚDO NÃO FICAR POR BAIXO DO CABEÇALHO */}
      <main className="mt-[140px] sm:mt-[130px] mx-auto max-w-5xl px-3 pb-16 sm:px-6">
        {erro && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {erro}
            <button type="button" onClick={carregar} className="ml-2 font-bold text-amber-500 underline hover:text-amber-400">
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