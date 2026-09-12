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
        bandeira_url: bandeiraUrl(tampinha.pais) ?? '',
        origem_formatada: tampinha.origem?.toLowerCase().trim() === 'nacional' ? 'NAC.' : 'INT.'
      }
    })
  }, [tampinhasFiltradas])

  async function handleCadastro(dados: NovaTampinha) {
    await cadastrarTampinha(dados)
    await carregar()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
      fontFamily: "'Cuprum', sans-serif",
      color: 'var(--cyber-text)'
    }}>
      
      {/* CABEÇALHO */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(10, 14, 23, 0.40)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255, 107, 26, 0.5)',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{
          maxWidth: '64rem',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '12px',
          position: 'relative'
        }}
        className="sm:px-4 sm:py-4">
          
          <div style={{
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingBottom: '12px',
            paddingTop: '4px'
          }}>
            <button
              type="button"
              onClick={() => setModalAberto(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                padding: 0
              }}
              title="Cadastrar nova tampinha"
            >
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                flexShrink: 0,
                border: '1px solid rgba(255, 107, 26, 0.20)',
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'border-color 0.3s ease, background 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--cyber-accent)'
                e.currentTarget.style.background = 'rgba(255, 107, 26, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 107, 26, 0.20)'
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.25)'
              }}
              >
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  style={{
                    height: '75%',
                    width: '75%',
                    objectFit: 'contain',
                    filter: 'brightness(1.1)',
                    position: 'relative',
                    zIndex: 10
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
              <div>
                <h1 style={{
                  fontFamily: 'var(--font-chakra)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '18px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: '#ffffff',
                  margin: 0,
                  textShadow: '0 0 8px rgba(255, 255, 255, 0.15)'
                }}
                className="sm:text-2xl">
                  TR <span style={{
                    color: 'var(--cyber-accent)',
                    fontWeight: 800,
                    textShadow: '0 0 14px rgba(255, 107, 26, 0.35)'
                  }}>Tampinhas</span>
                </h1>
                <p style={{
                  fontFamily: 'var(--font-chakra)',
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  color: 'rgba(148, 163, 184, 0.80)',
                  fontStyle: 'italic',
                  marginTop: '2px',
                  marginBottom: 0
                }}>
                  "A cada tampinha uma história"
                </p>
              </div>
            </button>
            
            <button
              onClick={() => setFiltrosAbertos(!filtrosAbertos)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                border: '1px solid rgba(255, 107, 26, 0.20)',
                background: 'rgba(0, 0, 0, 0.20)',
                color: 'var(--cyber-accent)',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--cyber-accent)'
                e.currentTarget.style.background = 'rgba(255, 107, 26, 0.12)'
                e.currentTarget.style.color = 'var(--cyber-accent-light)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 107, 26, 0.20)'
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.20)'
                e.currentTarget.style.color = 'var(--cyber-accent)'
              }}
              title={filtrosAbertos ? "Fechar menu" : "Abrir menu"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
          
          <div style={{
            width: '100%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 107, 26, 0.18), rgba(255, 107, 26, 0.35), rgba(255, 107, 26, 0.18), transparent)',
            borderRadius: '1px'
          }}></div>
          
          <div 
            style={{
              width: '100%',
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
              maxHeight: filtrosAbertos ? '220px' : '0',
              opacity: filtrosAbertos ? 1 : 0,
              marginTop: filtrosAbertos ? '8px' : '0'
            }}
          >
            <div style={{
              width: '100%',
              maxWidth: '42rem',
              margin: '0 auto 12px'
            }}>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                height: '42px',
                border: '1px solid rgba(255, 107, 26, 0.18)',
                background: 'rgba(0, 0, 0, 0.20)',
                padding: '0 14px',
                borderRadius: '10px',
                transition: 'border-color 0.25s ease, background 0.25s ease'
              }}>
                <svg 
                  style={{
                    color: 'var(--cyber-accent)',
                    marginRight: '10px',
                    flexShrink: 0
                  }} 
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <SearchBar value={busca} onChange={setBusca} />
              </div>
            </div>
            
            <div style={{
              width: '100%',
              maxWidth: '42rem',
              margin: '0 auto'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <button
                  type="button"
                  onClick={() => setFiltroAtivo('Nacional')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    height: '40px',
                    padding: '0 10px',
                    border: `1px solid ${filtroAtivo === 'Nacional' ? 'var(--cyber-accent)' : 'rgba(255, 107, 26, 0.18)'}`,
                    background: filtroAtivo === 'Nacional' ? 'rgba(255, 107, 26, 0.12)' : 'rgba(0, 0, 0, 0.18)',
                    fontFamily: 'var(--font-chakra)',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: filtroAtivo === 'Nacional' ? 'var(--cyber-accent-light)' : 'rgba(148, 163, 184, 0.80)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: filtroAtivo === 'Nacional' ? '0 0 14px rgba(255, 107, 26, 0.15)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (filtroAtivo !== 'Nacional') {
                      e.currentTarget.style.borderColor = 'var(--cyber-accent-light)'
                      e.currentTarget.style.background = 'rgba(255, 107, 26, 0.08)'
                      e.currentTarget.style.color = '#ffffff'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filtroAtivo !== 'Nacional') {
                      e.currentTarget.style.borderColor = 'rgba(255, 107, 26, 0.18)'
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.18)'
                      e.currentTarget.style.color = 'rgba(148, 163, 184, 0.80)'
                    }
                  }}
                >
                  <img 
                    src="https://flagcdn.com/w160/br.png" 
                    alt="Brasil" 
                    style={{
                      height: '20px',
                      width: '28px',
                      borderRadius: '2px',
                      objectFit: 'cover'
                    }} 
                  />
                  <span>NAC.</span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 400,
                    color: 'rgba(148, 163, 184, 0.70)',
                    letterSpacing: '0.05em',
                    textTransform: 'none'
                  }}>{totalNacional} un.</span>
                </button>
                
                <span style={{
                  color: 'var(--cyber-accent)',
                  fontFamily: 'var(--font-chakra)',
                  fontWeight: 700,
                  fontSize: '16px',
                  flexShrink: 0,
                  opacity: 0.7
                }}>+</span>
                
                <button
                  type="button"
                  onClick={() => setFiltroAtivo('Internacional')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    height: '40px',
                    padding: '0 10px',
                    border: `1px solid ${filtroAtivo === 'Internacional' ? 'var(--cyber-accent)' : 'rgba(255, 107, 26, 0.18)'}`,
                    background: filtroAtivo === 'Internacional' ? 'rgba(255, 107, 26, 0.12)' : 'rgba(0, 0, 0, 0.18)',
                    fontFamily: 'var(--font-chakra)',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: filtroAtivo === 'Internacional' ? 'var(--cyber-accent-light)' : 'rgba(148, 163, 184, 0.80)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: filtroAtivo === 'Internacional' ? '0 0 14px rgba(255, 107, 26, 0.15)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (filtroAtivo !== 'Internacional') {
                      e.currentTarget.style.borderColor = 'var(--cyber-accent-light)'
                      e.currentTarget.style.background = 'rgba(255, 107, 26, 0.08)'
                      e.currentTarget.style.color = '#ffffff'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filtroAtivo !== 'Internacional') {
                      e.currentTarget.style.borderColor = 'rgba(255, 107, 26, 0.18)'
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.18)'
                      e.currentTarget.style.color = 'rgba(148, 163, 184, 0.80)'
                    }
                  }}
                >
                  <img 
                    src="/mundo.png" 
                    alt="Internacional" 
                    style={{
                      width: '28px',
                      height: '28px',
                      objectFit: 'contain'
                    }} 
                  />
                  <span>INT.</span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 400,
                    color: 'rgba(148, 163, 184, 0.70)',
                    letterSpacing: '0.05em',
                    textTransform: 'none'
                  }}>{totalInternacional} un.</span>
                </button>
                
                <span style={{
                  color: 'var(--cyber-accent)',
                  fontFamily: 'var(--font-chakra)',
                  fontWeight: 700,
                  fontSize: '16px',
                  flexShrink: 0,
                  opacity: 0.7
                }}>=</span>
                
                <button
                  type="button"
                  onClick={() => setFiltroAtivo('Todas')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    height: '40px',
                    padding: '0 10px',
                    border: `1px solid ${filtroAtivo === 'Todas' ? 'var(--cyber-accent)' : 'rgba(255, 107, 26, 0.18)'}`,
                    background: filtroAtivo === 'Todas' ? 'rgba(255, 107, 26, 0.12)' : 'rgba(0, 0, 0, 0.18)',
                    fontFamily: 'var(--font-chakra)',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: filtroAtivo === 'Todas' ? 'var(--cyber-accent-light)' : 'rgba(148, 163, 184, 0.80)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: filtroAtivo === 'Todas' ? '0 0 14px rgba(255, 107, 26, 0.15)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (filtroAtivo !== 'Todas') {
                      e.currentTarget.style.borderColor = 'var(--cyber-accent-light)'
                      e.currentTarget.style.background = 'rgba(255, 107, 26, 0.08)'
                      e.currentTarget.style.color = '#ffffff'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filtroAtivo !== 'Todas') {
                      e.currentTarget.style.borderColor = 'rgba(255, 107, 26, 0.18)'
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.18)'
                      e.currentTarget.style.color = 'rgba(148, 163, 184, 0.80)'
                    }
                  }}
                >
                  <span>TODAS</span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 400,
                    color: 'rgba(148, 163, 184, 0.70)',
                    letterSpacing: '0.05em',
                    textTransform: 'none'
                  }}>{totalTodas} un.</span>
                </button>
              </div>
            </div>          
          </div>        
        </div>
      </header>

      <main style={{
        marginTop: '140px',
        maxWidth: '64rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: '12px',
        paddingRight: '12px',
        paddingBottom: '64px',
        background: 'transparent'
      }}
      className="sm:mt-[130px] sm:px-6">
        {erro && (
          <div style={{
            marginBottom: '24px',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            background: 'rgba(127, 29, 29, 0.25)',
            fontSize: '13px',
            color: 'rgba(252, 165, 165, 0.95)'
          }}>
            {erro}
            <button 
              type="button" 
              onClick={carregar} 
              style={{
                marginLeft: '8px',
                fontWeight: 700,
                color: 'var(--cyber-accent)',
                textDecoration: 'underline',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
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

      {/* MODAL DE ZOOM */}
      {tampinhaZoom && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(5, 8, 14, 0.92)',
            backdropFilter: 'blur(8px)'
          }}
          onClick={() => setTampinhaZoom(null)}
        >
          <div 
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '340px',
              background: 'rgba(15, 21, 32, 0.75)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 107, 26, 0.4)',
              borderRadius: '16px',
              padding: '14px 12px 12px',
              fontFamily: "'JetBrains Mono', monospace",
              color: '#FFFFFF',
              maxHeight: '92vh',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setTampinhaZoom(null)}
              aria-label="Fechar"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 107, 26, 0.4)',
                background: 'rgba(255, 107, 26, 0.12)',
                color: 'var(--cyber-accent)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--cyber-accent)'
                e.currentTarget.style.background = 'rgba(255, 107, 26, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 107, 26, 0.4)'
                e.currentTarget.style.background = 'rgba(255, 107, 26, 0.12)'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: 'rgba(255, 107, 26, 0.7)'
            }}>
              ID #{String(tampinhaZoom.id || '000').padStart(3, '0')}
            </div>

            <div style={{
              width: '100%',
              textAlign: 'center',
              paddingBottom: '8px',
              marginTop: '24px',
              borderBottom: '1px solid rgba(255, 107, 26, 0.25)'
            }}>
              <span style={{
                fontSize: '20px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.10em',
                color: '#FFFFFF'
              }}>
                {String(tampinhaZoom.nome || '').toUpperCase()}
              </span>
            </div>

            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1 / 1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '10px 0',
              flexShrink: 0
            }}>
              <div style={{
                position: 'absolute',
                top: '40px',
                left: '40px',
                width: '16px',
                height: '16px',
                borderTop: '1px solid var(--cyber-accent)',
                borderLeft: '1px solid var(--cyber-accent)',
                zIndex: 3
              }}></div>
              <div style={{
                position: 'absolute',
                top: '40px',
                right: '40px',
                width: '16px',
                height: '16px',
                borderTop: '1px solid var(--cyber-accent)',
                borderRight: '1px solid var(--cyber-accent)',
                zIndex: 3
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '40px',
                width: '16px',
                height: '16px',
                borderBottom: '1px solid var(--cyber-accent)',
                borderLeft: '1px solid var(--cyber-accent)',
                zIndex: 3
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '40px',
                right: '40px',
                width: '16px',
                height: '16px',
                borderBottom: '1px solid var(--cyber-accent)',
                borderRight: '1px solid var(--cyber-accent)',
                zIndex: 3
              }}></div>

              <img
                src={tampinhaZoom.foto_url || '/placeholder.png'}
                alt={tampinhaZoom.nome}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 16px 10px rgba(0, 0, 0, 0.9))',
                  position: 'relative',
                  zIndex: 2
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              paddingTop: '10px',
              borderTop: '1px solid rgba(255, 107, 26, 0.15)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {tampinhaZoom.bandeira_url && (
                  <img
                    src={tampinhaZoom.bandeira_url}
                    alt={tampinhaZoom.pais}
                    style={{
                      height: '24px',
                      width: '30px',
                      borderRadius: '1px',
                      objectFit: 'cover'
                    }}
                  />
                )}
                <span style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--cyber-text)',
                }}>
                  {String(tampinhaZoom.pais || '').toUpperCase()}
                </span>
              </div>
              <span style={{
                fontSize: '16px',
                fontWeight: 400,
                textTransform: 'uppercase',
                letterSpacing: '0.10em',
                color: 'var(--cyber-accent)'
              }}>
                {tampinhaZoom.cidade || '—'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}