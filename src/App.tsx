import { useCallback, useEffect, useMemo, useState } from 'react'
import { NovaTampinhaModal } from './components/NovaTampinhaModal'
import { LoginModal } from './components/LoginModal'
import { SearchBar } from './components/SearchBar'
import { TampinhaGrid } from './components/TampinhaGrid'
// PÁGINA DE CONTATO
import { ContatoPage } from "./components/ContatoPage";
import { bandeiraUrl } from './lib/bandeiras'
import { cadastrarTampinha, contarPorOrigem, filtrarTampinhas, listarTampinhas } from './lib/tampinhas'
import { getSupabaseErrorMessage, logSupabaseError } from './lib/supabaseError'
import type { NovaTampinha, Origem, Tampinha } from './types/tampinha'
import { supabase } from './lib/supabase'

type TampinhaFormatada = Tampinha & {
  bandeira_url: string
  origem_formatada: string
}

// ✅ Fonte Share Tech Mono incorporada
const FONTE_SHARE_TECH_BASE64 = `data:font/woff2;charset=utf-8;base64,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`

// ✅ Função auxiliar para formatar números com 3 dígitos
function formatarContador(num: number): string {
  return String(num).padStart(3, '0')
}

export default function App() {
  // ✅ CONTROLE DE TELA
  const [paginaContato, setPaginaContato] = useState(false)
  const [usuario, setUsuario] = useState<{ id: string; email?: string } | null>(null)
  const [verificandoLogin, setVerificandoLogin] = useState(true)
  const [loginModalAberto, setLoginModalAberto] = useState(false)
  
  // ✅ ESTADOS
  const [carregando, setCarregando] = useState(true)
  const [contadores, setContadores] = useState({ nacional: 0, internacional: 0 })
  const [tampinhas, setTampinhas] = useState<Tampinha[]>([])
  const [erro, setErro] = useState<string | null>(null)
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)
  const [filtroAtivo, setFiltroAtivo] = useState<Origem | 'Todas' | null>(null)
  const [tampinhaZoom, setTampinhaZoom] = useState<TampinhaFormatada | null>(null)
  
  // ✅ SIMPLES: se está logado = pode tentar cadastrar → Supabase decide se permite
  const estaLogado = !!usuario
  const podeCadastrar = estaLogado

  // ✅ DETECTAR LOGIN
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔑 Sessão encontrada:', session?.user?.email ?? 'NENHUMA')
      setUsuario(session?.user ? { id: session.user.id, email: session.user.email } : null)
      setVerificandoLogin(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      console.log('🔄 Login alterado:', session?.user?.email ?? 'Deslogado')
      setUsuario(session?.user ? { id: session.user.id, email: session.user.email } : null)
      setVerificandoLogin(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  // ✅ CARREGAR TAMPINHAS
  const carregar = useCallback(async () => {
    try {
      setCarregando(true)
      setErro(null)
      const dados = await listarTampinhas()
      setTampinhas(dados)
      setContadores({
        nacional: contarPorOrigem(dados, 'Nacional'),
        internacional: contarPorOrigem(dados, 'Internacional')
      })
    } catch (err) {
      setErro(getSupabaseErrorMessage(err))
      logSupabaseError('Falha ao carregar tampinhas', err)
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  // ✅ FILTROS
  const totalTodas = tampinhas.length
  const totalNacional = contadores.nacional
  const totalInternacional = contadores.internacional

  const colecaoAtivaParaFiltro = useMemo<Origem | null>(() => {
    if (filtroAtivo === 'Nacional') return 'Nacional'
    if (filtroAtivo === 'Internacional') return 'Internacional'
    return null
  }, [filtroAtivo])

  const tampinhasFiltradas = useMemo(() => {
    return filtrarTampinhas(tampinhas, busca, colecaoAtivaParaFiltro)
  }, [tampinhas, busca, colecaoAtivaParaFiltro])

  const tampinhasFormatadasParaExibicao = useMemo<TampinhaFormatada[]>(() => {
    return tampinhasFiltradas.map((tampinha) => ({
      ...tampinha,
      bandeira_url: bandeiraUrl(tampinha.pais) ?? '',
      origem_formatada: tampinha.origem?.toLowerCase().trim() === 'nacional' ? 'NAC.' : 'INT.'
    }))
  }, [tampinhasFiltradas])

  // ✅ FUNÇÃO DE CADASTRO
  async function handleCadastro(dados: NovaTampinha) {
    if (!podeCadastrar) {
      alert('🔒 Faça login para cadastrar!')
      return
    }
    try {
      await cadastrarTampinha(dados)
      await carregar()
    } catch (err) {
      const msg = getSupabaseErrorMessage(err)
      if (msg.includes('permission') || msg.includes('policy') || msg.includes('unauthorized')) {
        alert('🔒 Acesso restrito: apenas o administrador pode cadastrar!')
      } else {
        setErro(msg)
      }
      throw err
    }
  }

  // ✅ CLIQUE NO BOTÃO DE CADASTRO
  function handleCliqueCadastro() {
    if (verificandoLogin) return
    if (!podeCadastrar) {
      setLoginModalAberto(true)
    } else {
      setModalAberto(true)
    }
  }

  // ✅ LOGOUT
  async function handleLogout() {
    await supabase.auth.signOut()
    setUsuario(null)
  }

  // ✅ SE ESTIVER NA PÁGINA DE CONTATO
  if (paginaContato) {
    return (
      <div style={{ minHeight: '100vh', fontFamily: "'Cuprum', sans-serif" }}>
        <ContatoPage onFechar={() => setPaginaContato(false)} />
      </div>
    )
  }

  // ✅ Estilos base dos botões de contador — AJUSTADOS PARA FONTE 12px
  const estiloBotaoBase = (ativo: boolean): React.CSSProperties => ({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    height: '36px', // ✅ Altura reduzida para acompanhar fonte 12px
    padding: '0 12px',
    border: `1px solid ${ativo ? '#ff5500' : 'rgba(255, 85, 0, 0.35)'}`,
    background: ativo ? 'rgba(255, 85, 0, 0.08)' : '#0a0a0a',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: ativo 
      ? '0 0 14px rgba(255, 85, 0, 0.55), inset 0 0 6px rgba(255, 85, 0, 0.28)' 
      : '0 0 8px rgba(255, 85, 0, 0.27), inset 0 0 4px rgba(255, 85, 0, 0.13)',
    outline: 'none'
  })

  const estiloIcone: React.CSSProperties = {
    width: '18px', // ✅ Ícone menor
    height: '18px',
    stroke: '#ff5500',
    strokeWidth: 1.5,
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    filter: 'drop-shadow(0 0 3px rgba(255, 85, 0, 0.67))',
    transition: 'all 0.15s ease',
    flexShrink: 0
  }

  const estiloContador: React.CSSProperties = {
    fontFamily: "'Share Tech Mono Local', 'Share Tech Mono', monospace",
    fontSize: '12px', // ✅ Fonte 12px conforme solicitado
    lineHeight: 1,
    letterSpacing: '1px',
    color: '#ff5500',
    textShadow: '0 0 8px rgba(255, 85, 0, 1), 0 0 2px rgba(255, 85, 0, 0.67)',
    transition: 'all 0.15s ease'
  }

  const estiloSeparador: React.CSSProperties = {
    color: '#ff5500',
    fontFamily: "'Share Tech Mono Local', monospace",
    fontWeight: 700,
    fontSize: '12px', // ✅ Separador também ajustado
    flexShrink: 0,
    opacity: 0.8,
    textShadow: '0 0 6px rgba(255, 85, 0, 0.6)'
  }

  // ✅ PÁGINA PRINCIPAL
  return (
    <>
      {/* ✅ Injeta a fonte Share Tech Mono Local */}
      <style>{`
        @font-face {
          font-family: 'Share Tech Mono Local';
          font-style: normal;
          font-weight: 400;
          font-display: block;
          src: url(${FONTE_SHARE_TECH_BASE64}) format('woff2');
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'transparent',
        fontFamily: "'Cuprum', sans-serif",
        color: 'var(--cyber-text)'
      }}>
        
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
              
              {/* LOGO / CADASTRO */}
              <button
                type="button"
                onClick={handleCliqueCadastro}
                disabled={verificandoLogin}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  cursor: verificandoLogin ? 'wait' : 'pointer',
                  outline: 'none',
                  padding: 0,
                  opacity: verificandoLogin ? 0.5 : 1,
                  transition: 'opacity 0.25s ease'
                }}
                title={
                  verificandoLogin ? "Verificando acesso..." :
                  estaLogado ? "Cadastrar nova tampinha" : "🔑 Fazer login"
                }
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
                    {verificandoLogin ? "Verificando acesso..." :
                     estaLogado ? '"A cada tampinha uma história"' : "A cada tampinha uma história"}
                  </p>
                </div>
              </button>
              
              {/* ✅ BOTÕES DE AÇÃO: CONTATO + MENU + LOGOUT */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                
                {/* ✅ BOTÃO CONTATO */}
                <button
                  onClick={() => setPaginaContato(true)}
                  title="Contato"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '44px',
                    height: '44px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--cyber-accent)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 107, 26, 0.12)'
                    e.currentTarget.style.color = 'var(--cyber-accent-light)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--cyber-accent)'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </button>
                
                {/* BOTÃO DE LOGOUT (só logado) */}
                {estaLogado && (
                  <button
                    onClick={handleLogout}
                    title="Sair"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '44px',
                      height: '44px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      background: 'rgba(239, 68, 68, 0.08)',
                      color: 'rgba(248, 113, 113, 0.9)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.7)'
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                )}
                
                {/* BOTÃO MENU */}
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
                  {!filtrosAbertos ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <div style={{
              width: '100%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255, 107, 26, 0.18), rgba(255, 107, 26, 0.35), rgba(255, 107, 26, 0.18), transparent)',
              borderRadius: '1px'
            }}></div>
            
            {/* FILTROS */}
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
              <div style={{ width: '100%', maxWidth: '42rem', margin: '0 auto 12px' }}>
                <div className="cyber-search">
                  <svg className="cyber-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <SearchBar value={busca} onChange={setBusca} />
                  {busca.trim() !== '' && (
                    <button type="button" className="cyber-search-clear" onClick={() => setBusca('')} aria-label="Limpar pesquisa">×</button>
                  )}
                </div>
              </div>
              
              <div style={{ width: '100%', maxWidth: '42rem', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  
                  {/* ✅ BOTÃO NACIONAL */}
                  <button
                    type="button"
                    onClick={() => setFiltroAtivo(filtroAtivo === 'Nacional' ? null : 'Nacional')}
                    style={estiloBotaoBase(filtroAtivo === 'Nacional')}
                    onMouseEnter={(e) => {
                      if (filtroAtivo !== 'Nacional') {
                        e.currentTarget.style.background = 'rgba(255, 85, 0, 0.07)'
                        e.currentTarget.style.boxShadow = '0 0 14px rgba(255, 85, 0, 0.55), inset 0 0 6px rgba(255, 85, 0, 0.28)'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filtroAtivo !== 'Nacional') {
                        e.currentTarget.style.background = '#0a0a0a'
                        e.currentTarget.style.boxShadow = '0 0 8px rgba(255, 85, 0, 0.27), inset 0 0 4px rgba(255, 85, 0, 0.13)'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }
                    }}
                  >
                    <svg style={estiloIcone} viewBox="0 0 24 24">
                      <path d="M12 2C7.5 2 4 5.5 4 10c0 5.25 8 12 8 12s8-6.75 8-12c0-4.5-3.5-8-8-8z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span style={estiloContador}>{formatarContador(totalNacional)}</span>
                  </button>
                  
                  <span style={estiloSeparador}>+</span>
                  
                  {/* ✅ BOTÃO INTERNACIONAL */}
                  <button
                    type="button"
                    onClick={() => setFiltroAtivo(filtroAtivo === 'Internacional' ? null : 'Internacional')}
                    style={estiloBotaoBase(filtroAtivo === 'Internacional')}
                    onMouseEnter={(e) => {
                      if (filtroAtivo !== 'Internacional') {
                        e.currentTarget.style.background = 'rgba(255, 85, 0, 0.07)'
                        e.currentTarget.style.boxShadow = '0 0 14px rgba(255, 85, 0, 0.55), inset 0 0 6px rgba(255, 85, 0, 0.28)'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filtroAtivo !== 'Internacional') {
                        e.currentTarget.style.background = '#0a0a0a'
                        e.currentTarget.style.boxShadow = '0 0 8px rgba(255, 85, 0, 0.27), inset 0 0 4px rgba(255, 85, 0, 0.13)'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }
                    }}
                  >
                    <svg style={estiloIcone} viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    <span style={estiloContador}>{formatarContador(totalInternacional)}</span>
                  </button>
                  
                  <span style={estiloSeparador}>=</span>
                  
                  {/* ✅ BOTÃO TODAS */}
                  <button
                    type="button"
                    onClick={() => setFiltroAtivo(filtroAtivo === 'Todas' ? null : 'Todas')}
                    style={estiloBotaoBase(!filtroAtivo || filtroAtivo === 'Todas')}
                    onMouseEnter={(e) => {
                      if (filtroAtivo && filtroAtivo !== 'Todas') {
                        e.currentTarget.style.background = 'rgba(255, 85, 0, 0.07)'
                        e.currentTarget.style.boxShadow = '0 0 14px rgba(255, 85, 0, 0.55), inset 0 0 6px rgba(255, 85, 0, 0.28)'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filtroAtivo && filtroAtivo !== 'Todas') {
                        e.currentTarget.style.background = '#0a0a0a'
                        e.currentTarget.style.boxShadow = '0 0 8px rgba(255, 85, 0, 0.27), inset 0 0 4px rgba(255, 85, 0, 0.13)'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }
                    }}
                  >
                    <svg style={estiloIcone} viewBox="0 0 24 24">
                      <line x1="5" y1="9" x2="19" y2="9" />
                      <line x1="5" y1="15" x2="19" y2="15" />
                    </svg>
                    <span style={estiloContador}>{formatarContador(totalTodas)}</span>
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
          
          {carregando && <div style={{ textAlign: 'center', padding: '20px', color: 'var(--cyber-accent)' }}>Carregando tampinhas...</div>}
          
          <TampinhaGrid 
            tampinhas={tampinhasFormatadasParaExibicao} 
            onSelectTampinha={(tampinha) => setTampinhaZoom(tampinha)}
          />
        </main>
        
        {/* MODAL DE CADASTRO */}
        <NovaTampinhaModal 
          open={modalAberto} 
          onClose={() => setModalAberto(false)} 
          onSubmit={handleCadastro} 
        />
        
        {/* MODAL DE LOGIN */}
        <LoginModal 
          open={loginModalAberto} 
          onClose={() => setLoginModalAberto(false)}
        />
        
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
                fontFamily: "Trebuchet MS",
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
              >
                ×
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
                <div style={{ position: 'absolute', top: '40px', left: '40px', width: '16px', height: '16px', borderTop: '1px solid var(--cyber-accent)', borderLeft: '1px solid var(--cyber-accent)', zIndex: 3 }}></div>
                <div style={{ position: 'absolute', top: '40px', right: '40px', width: '16px', height: '16px', borderTop: '1px solid var(--cyber-accent)', borderRight: '1px solid var(--cyber-accent)', zIndex: 3 }}></div>
                <div style={{ position: 'absolute', bottom: '40px', left: '40px', width: '16px', height: '16px', borderBottom: '1px solid var(--cyber-accent)', borderLeft: '1px solid var(--cyber-accent)', zIndex: 3 }}></div>
                <div style={{ position: 'absolute', bottom: '40px', right: '40px', width: '16px', height: '16px', borderBottom: '1px solid var(--cyber-accent)', borderRight: '1px solid var(--cyber-accent)', zIndex: 3 }}></div>
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
                borderTop: '1px solid rgba(255, 107, 26, 0.20)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {tampinhaZoom.bandeira_url && (
                    <img
                      src={tampinhaZoom.bandeira_url}
                      alt={tampinhaZoom.pais}
                      style={{ height: '24px', width: '30px', borderRadius: '1px', objectFit: 'cover' }}
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
                  color: 'var(--cyber-accent)',
                  fontFamily: '"JetBrains Mono", monospace'
                }}>
                  {tampinhaZoom.cidade || '—'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}