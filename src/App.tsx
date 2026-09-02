import { useCallback, useEffect, useMemo, useState } from 'react'
import { NovaTampinhaModal } from './components/NovaTampinhaModal'
import { SearchBar } from './components/SearchBar'
import { TampinhaGrid } from './components/TampinhaGrid'
import { bandeiraUrl } from './lib/bandeiras'
import { cadastrarTampinha, contarPorOrigem, filtrarTampinhas, listarTampinhas } from './lib/tampinhas'
import { getSupabaseErrorMessage, logSupabaseError } from './lib/supabaseError'
import type { NovaTampinha, Origem, Tampinha } from './types/tampinha'

type TampinhaFormatada = Tampinha & {
  bandeira_url: string
  origem_formatada: string
}

export default function App() {
  const [tampinhas, setTampinhas] = useState<Tampinha[]>([])
  const [busca, setBusca] = useState('')
  
  const [filtroAtivo, setFiltroAtivo] = useState<'Inicial' | 'Todas' | 'Nacional' | 'Internacional'>('Inicial')
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)
  
  const [loading, setLoading] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const [tampinhaZoom, setTampinhaZoom] = useState<TampinhaFormatada | null>(null)

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

  const tampinhasFormatadasParaExibicao = useMemo<TampinhaFormatada[]>(() => {
    return tampinhasFiltradas.map((tampinha) => {
      return {
        ...tampinha,
        bandeira_url: bandeiraUrl(tampinha.pais),
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
      
      {/* CABEÇALHO FIXO */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-lg">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-3 px-3 py-3 sm:px-4 sm:py-4">
          
          <div className="flex w-full flex-row items-center justify-between gap-3 border-b border-[#678fcb]/60 pb-3 pt-1">
            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className="flex items-center gap-3 text-left focus:outline-none group"
              title="Cadastrar nova tampinha"
            >
              <div className="neon-border-cyan float-effect flex-shrink-0 p-0.5 group-hover:scale-105 transition-transform">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tr-surface p-2">
                  <img src="/logo.png" alt="Logo" className="h-full w-full object-contain brightness-110" />
                </div>
              </div>
              <div>
                <h1 className="font-ubuntu flex items-center gap-2 text-lg font-bold uppercase tracking-[0.12em] text-white sm:text-2xl">
                  TR <span className="text-amber-500 font-extrabold">Tampinhas</span>
                </h1>
                <p className="mt-0.5 text-xs tracking-wider text-tr-muted font-normal italic">
                  "A cada tampinha uma história"
                </p>
              </div>
            </button>

            <div className="flex items-center gap-5">
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
              </button>
            </div>
          </div>

          {/* ÁREA DE FILTROS */}
          <div 
            className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
              filtrosAbertos ? 'max-h-[200px] opacity-100 mt-1' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="w-full max-w-2xl mx-auto mb-3">
              <SearchBar value={busca} onChange={setBusca} />
            </div>
            <div className="w-full max-w-2xl mx-auto">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFiltroAtivo('Nacional')}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl border h-10 px-2 font-bold tracking-wider text-xs transition-all duration-200 active:scale-[0.97] ${
                    filtroAtivo === 'Nacional'
                      ? 'border-amber-500/60 text-amber-500 bg-tr-bg shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'border-tr-border text-slate-300 hover:border-amber-500/40 hover:text-white bg-tr-bg'
                  }`}
                >
                  <img src="https://flagcdn.com/w40/br.png" alt="Brasil" className="h-5 w-7 rounded-sm object-cover" />
                  <span className="text-[11px] font-normal text-tr-muted normal-case">{totalNacional} un.</span>
                </button>

                <span className="text-amber-500 text-lg font-bold flex-shrink-0">+</span>

                <button
                  type="button"
                  onClick={() => setFiltroAtivo('Internacional')}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl border h-10 px-2 font-bold tracking-wider text-xs transition-all duration-200 active:scale-[0.97] ${
                    filtroAtivo === 'Internacional'
                      ? 'border-amber-500/60 text-amber-500 bg-tr-bg shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'border-tr-border text-slate-300 hover:border-amber-500/40 hover:text-white bg-tr-bg'
                  }`}
                >
                  <img src="/mundo.png" alt="Internacional" className="w-8 h-8 object-contain" />
                  <span className="text-[11px] font-normal text-tr-muted normal-case">{totalInternacional} un.</span>
                </button>

                <span className="text-amber-500 text-lg font-bold flex-shrink-0">=</span>

                <button
                  type="button"
                  onClick={() => setFiltroAtivo('Todas')}
                  className={`flex-1 flex items-center justify-center rounded-xl border h-10 px-2 font-bold tracking-wider text-xs transition-all duration-200 active:scale-[0.97] ${
                    filtroAtivo === 'Todas'
                      ? 'border-amber-500/60 text-amber-500 bg-tr-bg shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'border-tr-border text-slate-300 hover:border-amber-500/40 hover:text-white bg-tr-bg'
                  }`}
                >
                  <span className="text-[11px] font-normal normal-case">{totalTodas} un.</span>
                </button>
              </div>
            </div>          
          </div>        
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mt-[140px] sm:mt-[130px] mx-auto max-w-5xl px-3 pb-16 sm:px-6">
        {erro && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {erro}
            <button type="button" onClick={carregar} className="ml-2 font-bold text-amber-500 underline hover:text-amber-400">
              Tentar novamente
            </button>
          </div>
        )}

        <TampinhaGrid 
          tampinhas={tampinhasFormatadasParaExibicao as any} 
          loading={loading}
          onSelectTampinha={(tampinha: TampinhaFormatada) => setTampinhaZoom(tampinha)}
        />
      </main>

      <NovaTampinhaModal open={modalAberto} onClose={() => setModalAberto(false)} onSubmit={handleCadastro} />

      {/* POP-UP HUD ZOOM MODAL */}
      {tampinhaZoom && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md transition-all duration-300"
          onClick={() => setTampinhaZoom(null)}
        >
          <div 
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-cyan-500/50 bg-slate-900/90 p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] backdrop-blur-2xl transition-transform duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Brilhos de Fundo */}
            <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-cyan-500/20 blur-2xl pointer-events-none" />
            <div className="absolute -right-16 -bottom-16 h-32 w-32 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />

            {/* Topo do Pop-up */}
            <div className="flex items-center justify-between pb-2">
              <span className="font-mono text-xs font-bold tracking-widest text-cyan-400">
                ID #{String(tampinhaZoom.id || '0000').padStart(4, '0')}
              </span>

              <button
                type="button"
                onClick={() => setTampinhaZoom(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/80 bg-cyan-950/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)] transition-all hover:bg-cyan-500 hover:text-slate-950"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Área da Foto da Tampinha */}
            <div className="my-4 flex items-center justify-center py-2">
              <img
                src={tampinhaZoom.foto_url || '/placeholder.png'}
                alt={tampinhaZoom.nome}
                className="h-48 w-48 object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* 🔴 LINHA DIVISÓRIA FUTURISTA (SEPARA A FOTO DOS DADOS) */}
            <div className="relative my-5 flex items-center justify-center">
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
              <div className="absolute h-1 w-16 rounded-full bg-cyan-400/40 blur-sm pointer-events-none" />
            </div>

            {/* Dados do Cadastro: Nome */}
            <h2 className="text-center font-ubuntu text-2xl font-black uppercase tracking-wider text-white mb-4">
              {tampinhaZoom.nome}
            </h2>

            {/* Dados do Cadastro: Pílulas (País / Origem) */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 border border-slate-700/60 px-3.5 py-1.5 shadow-inner">
                {tampinhaZoom.bandeira_url && (
                  <img src={tampinhaZoom.bandeira_url} alt={tampinhaZoom.pais} className="h-4 w-6 rounded-sm object-cover" />
                )}
                <span className="font-bold text-amber-500 text-xs tracking-wider uppercase">
                  {tampinhaZoom.pais}
                </span>
              </div>

              <div className="rounded-xl bg-slate-800/80 border border-slate-700/60 px-3.5 py-1.5 shadow-inner">
                <span className="font-bold text-slate-300 text-xs tracking-wider uppercase">
                  {tampinhaZoom.origem_formatada}
                </span>
              </div>
            </div>

            {/* Dados do Cadastro: Cidade / Localização */}
            <p className="text-center font-mono text-xs font-semibold tracking-widest text-slate-400 uppercase">
              {tampinhaZoom.cidade ? `${tampinhaZoom.cidade}` : 'ORIGEM NÃO INFORMADA'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}