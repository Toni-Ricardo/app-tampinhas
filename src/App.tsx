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
/**
 * Componente de código de barras para o modal (mesmo algoritmo do card)
 */
function BarcodeModalSVG({ id }: { id: unknown }) {
  const seed = String(id ?? '0000').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const bars: Array<{ width: number; shade: number }> = []
  let s = seed
  for (let i = 0; i < 52; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    const width = 1 + (s % 5)
    const shade = s % 3
    bars.push({ width, shade })
    s = s >> 1
  }
  
  const shades = [
    'rgba(255,107,26,0.35)',
    'rgba(255,154,60,0.55)',
    '#ff6b1a'
  ]
  
  let x = 2
  const totalWidth = bars.reduce((acc, b) => acc + b.width + 1, 0) + 4
  
  return (
    <svg width="100%" height="40" viewBox={`0 0 ${totalWidth} 40`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {bars.map((bar, i) => {
        const rect = (
          <rect key={i} x={x} y="2" width={bar.width} height="36" fill={shades[bar.shade]} />
        )
        x += bar.width + 1
        return rect
      })}
    </svg>
  )
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
        bandeira_url: bandeiraUrl(tampinha.pais) ?? '', // ✅ CORRIGIDO: converte null para string vazia
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
      {/* CABEÇALHO FIXO CYBERPUNK */}
      <header className="cyber-header fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-3 px-3 py-3 sm:px-4 sm:py-4">
          
          <div className="flex w-full flex-row items-center justify-between gap-3 pb-3 pt-1">
            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className="flex items-center gap-3 text-left focus:outline-none group"
              title="Cadastrar nova tampinha"
            >
              {/* Moldura do logo com cantos recortados */}
              <div className="cyber-logo-frame h-14 w-14 flex-shrink-0">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="h-[75%] w-[75%] object-contain brightness-110 relative z-10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
              <div>
                <h1 className="cyber-title flex items-center gap-2 text-lg font-bold uppercase text-white sm:text-2xl">
                  TR <span className="cyber-title-accent font-extrabold">Tampinhas</span>
                </h1>
                <p className="cyber-tagline mt-0.5">
                  "A cada tampinha uma história"
                </p>
              </div>
            </button>
            
            {/* Botão menu cyberpunk */}
            <button
              onClick={() => setFiltrosAbertos(!filtrosAbertos)}
              className="cyber-menu-btn h-11 w-11"
              title={filtrosAbertos ? "Fechar menu" : "Abrir menu"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>

          {/* Divisor estilizado */}
          <div className="cyber-divider-header w-full"></div>

          {/* ÁREA DE FILTROS */}
          <div 
            className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
              filtrosAbertos ? 'max-h-[220px] opacity-100 mt-2' : 'max-h-0 opacity-0'
            }`}
          >
            {/* Barra de pesquisa cyberpunk */}
            <div className="w-full max-w-2xl mx-auto mb-3">
              <div className="cyber-search">
                <svg className="cyber-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <SearchBar value={busca} onChange={setBusca} />
              </div>
            </div>

            {/* Botões de filtro cyberpunk */}
            <div className="w-full max-w-2xl mx-auto">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFiltroAtivo('Nacional')}
                  className={`cyber-filter-btn flex-1 ${filtroAtivo === 'Nacional' ? 'active' : ''}`}
                >
                  <img src="https://flagcdn.com/w160/br.png" alt="Brasil" className="h-5 w-7 rounded-sm object-cover" />
                  <span>NAC.</span>
                  <span className="cyber-filter-count">{totalNacional} un.</span>
                </button>
                
                <span className="cyber-filter-sep">+</span>
                
                <button
                  type="button"
                  onClick={() => setFiltroAtivo('Internacional')}
                  className={`cyber-filter-btn flex-1 ${filtroAtivo === 'Internacional' ? 'active' : ''}`}
                >
                  <img src="/mundo.png" alt="Internacional" className="w-7 h-7 object-contain" />
                  <span>INT.</span>
                  <span className="cyber-filter-count">{totalInternacional} un.</span>
                </button>
                
                <span className="cyber-filter-sep">=</span>
                
                <button
                  type="button"
                  onClick={() => setFiltroAtivo('Todas')}
                  className={`cyber-filter-btn flex-1 ${filtroAtivo === 'Todas' ? 'active' : ''}`}
                >
                  <span></span>
                  <span className="cyber-filter-count">{totalTodas} un.</span>
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
          tampinhas={tampinhasFormatadasParaExibicao} 
          loading={loading}
          onSelectTampinha={(tampinha) => setTampinhaZoom(tampinha as TampinhaFormatada)}
        />
      </main>

      <NovaTampinhaModal open={modalAberto} onClose={() => setModalAberto(false)} onSubmit={handleCadastro} />

      {/* POP-UP HUD ZOOM MODAL */}
      {/* POP-UP HUD ZOOM MODAL CYBERPUNK */}
      {tampinhaZoom && (
        <div 
          className="cyber-modal-overlay"
          onClick={() => setTampinhaZoom(null)}
        >
          <div 
            className="cyber-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cantos em L */}
            <div className="cyber-corner-tl"></div>
            <div className="cyber-corner-br"></div>

            {/* Topo: ID + Fechar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              <span style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: 'var(--cyber-accent-light)'
              }}>
                ID #{String(tampinhaZoom.id || '0000').padStart(4, '0')}
              </span>
              <button
                type="button"
                onClick={() => setTampinhaZoom(null)}
                className="cyber-modal-close"
                aria-label="Fechar"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Divisor */}
            <div className="cyber-divider" style={{ position: 'relative', zIndex: 1 }}></div>

            {/* Área da imagem */}
            <div className="cyber-modal-image-wrap" style={{ position: 'relative', zIndex: 1 }}>
              <div className="cyber-frame-corner-tl" style={{ width: '16px', height: '16px', top: '4px', left: '4px', borderTop: '1px solid var(--cyber-accent)', borderLeft: '1px solid var(--cyber-accent)', position: 'absolute', zIndex: 2 }}></div>
              <div className="cyber-frame-corner-br" style={{ width: '16px', height: '16px', bottom: '4px', right: '4px', borderBottom: '1px solid var(--cyber-accent)', borderRight: '1px solid var(--cyber-accent)', position: 'absolute', zIndex: 2 }}></div>
              <img
                src={tampinhaZoom.foto_url || '/placeholder.png'}
                alt={tampinhaZoom.nome}
              />
            </div>

            {/* Divisor pontos */}
            <div className="cyber-divider-dots" style={{ position: 'relative', zIndex: 1, margin: '12px 0' }}>
              <span className="dot" style={{ width: '4px', height: '4px', background: 'var(--cyber-accent)', borderRadius: '50%', flexShrink: 0 }}></span>
              <span className="line" style={{ flex: 1, height: '1px', background: 'var(--cyber-border)' }}></span>
              <span className="dot" style={{ width: '4px', height: '4px', background: 'var(--cyber-accent)', borderRadius: '50%', flexShrink: 0 }}></span>
              <span className="line" style={{ flex: 1, height: '1px', background: 'var(--cyber-border)' }}></span>
              <span className="dot" style={{ width: '4px', height: '4px', background: 'var(--cyber-accent)', borderRadius: '50%', flexShrink: 0 }}></span>
            </div>

            {/* Nome da cerveja */}
            <h2 style={{
              textAlign: 'center',
              fontFamily: 'var(--font-chakra)',
              fontSize: '22px',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#ffffff',
              marginBottom: '16px',
              position: 'relative',
              zIndex: 1
            }}>
              {String(tampinhaZoom.nome || '').toUpperCase()}
            </h2>

            {/* Pills: País + Origem */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '12px',
              position: 'relative',
              zIndex: 1,
              flexWrap: 'wrap'
            }}>
              <div className="cyber-modal-pill accent">
                {tampinhaZoom.bandeira_url && (
                  <img src={tampinhaZoom.bandeira_url} alt={tampinhaZoom.pais} />
                )}
                <span>{String(tampinhaZoom.pais || '').toUpperCase()}</span>
              </div>
              <div className="cyber-modal-pill">
                <span style={{ color: 'var(--cyber-muted)' }}>
                  {tampinhaZoom.origem_formatada}
                </span>
              </div>
            </div>

            {/* Cidade */}
            <p style={{
              textAlign: 'center',
              fontFamily: "'Courier New', monospace",
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              color: 'var(--cyber-muted)',
              textTransform: 'uppercase',
              marginBottom: '16px',
              position: 'relative',
              zIndex: 1
            }}>
              {tampinhaZoom.cidade ? String(tampinhaZoom.cidade).toUpperCase() : 'ORIGEM NÃO INFORMADA'}
            </p>

            {/* Divisor */}
            <div className="cyber-divider" style={{ position: 'relative', zIndex: 1 }}></div>

            {/* Código de barras no modal */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="cyber-label">CÓDIGO</span>
                <span style={{
                  fontSize: '10px',
                  color: 'var(--cyber-accent-light)',
                  fontFamily: "'Courier New', monospace"
                }}>*{String(tampinhaZoom.id || '0000').padStart(4, '0')}*</span>
              </div>
              <div className="cyber-barcode-wrap">
                {/* Reutiliza o mesmo padrão de barcode */}
                <BarcodeModalSVG id={tampinhaZoom.id} />
                <div className="cyber-barcode-text" title={String(tampinhaZoom.nome || '').toUpperCase()}>
                  {String(tampinhaZoom.nome || '').toUpperCase()}
                </div>
              </div>
            </div>

            {/* Rodapé */}
            <div className="cyber-footer-code" style={{ position: 'relative', zIndex: 1 }}>
              <span>VCR: 1.0</span>
              <span>STAT: Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}