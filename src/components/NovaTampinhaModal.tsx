import { useEffect, useMemo, useRef, useState, type DragEvent, type FormEvent } from 'react'
import { bandeiraUrl } from '../lib/bandeiras'
import { getSupabaseErrorMessage } from '../lib/supabaseError'
import type { NovaTampinha, Origem } from '../types/tampinha'
import { TampinhaCard } from './TampinhaCard'

interface NovaTampinhaModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (dados: NovaTampinha) => Promise<void>
}

function arquivoImagemValido(file: File): boolean {
  if (file.type.startsWith('image/')) return true
  return /\.(png|jpe?g|webp|gif)$/i.test(file.name)
}

function SecaoLabel({ numero, titulo }: { numero: string; titulo: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: 'var(--cyber-accent)'
    }}>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '18px',
        height: '18px',
        border: '1px solid var(--cyber-accent)',
        background: 'var(--cyber-accent-soft)',
        fontFamily: "'Courier New', monospace",
        fontSize: '10px',
        fontWeight: 700,
        color: 'var(--cyber-accent-light)',
        borderRadius: '4px'
      }}>
        {numero}
      </span>
      <span>{titulo}</span>
    </div>
  )
}

function BotaoOrigem({ 
  label, 
  ativo, 
  onClick 
}: { 
  label: Origem; 
  ativo: boolean; 
  onClick: () => void 
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        height: '40px',
        border: `1px solid ${ativo ? 'var(--cyber-accent)' : 'var(--cyber-border)'}`,
        background: ativo ? 'var(--cyber-accent-soft)' : 'rgba(0, 0, 0, 0.3)',
        fontFamily: 'var(--font-chakra)',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        color: ativo ? 'var(--cyber-accent-light)' : 'var(--cyber-muted)',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        borderRadius: '8px',
        clipPath: 'none'
      }}
      onMouseEnter={(e) => {
        if (!ativo) {
          e.currentTarget.style.borderColor = 'var(--cyber-accent-light)'
          e.currentTarget.style.color = 'var(--cyber-text)'
        }
      }}
      onMouseLeave={(e) => {
        if (!ativo) {
          e.currentTarget.style.borderColor = 'var(--cyber-border)'
          e.currentTarget.style.color = 'var(--cyber-muted)'
        }
      }}
    >
      <span style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        border: `2px solid ${ativo ? 'var(--cyber-accent)' : 'var(--cyber-muted)'}`,
        background: ativo ? 'var(--cyber-accent)' : 'transparent',
        transition: 'all 0.25s ease',
        boxShadow: ativo ? '0 0 8px var(--cyber-accent)' : 'none'
      }} />
      {label}
    </button>
  )
}

export function NovaTampinhaModal({ open, onClose, onSubmit }: NovaTampinhaModalProps) {
  const [nome, setNome] = useState('')
  const [pais, setPais] = useState('')
  const [cidade, setCidade] = useState('')
  const [origem, setOrigem] = useState<Origem | null>(null)
  const [foto, setFoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [arrastando, setArrastando] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const inputFotoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) {
      setNome('')
      setPais('')
      setCidade('')
      setOrigem(null)
      setFoto(null)
      setPreview(null)
      setArrastando(false)
      setErro(null)
      setEnviando(false)
    }
  }, [open])

  useEffect(() => {
    if (!foto) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(foto)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [foto])

  const tampinhaPreview = useMemo(
    () => ({
      id: 'PREVIEW',
      nome: nome.trim().toUpperCase(),
      pais: pais.trim().toUpperCase(),
      cidade: cidade.trim().toUpperCase(),
      origem: origem ?? 'Nacional',
      origem_formatada: origem === 'Internacional' ? 'INT.' : origem === 'Nacional' ? 'NAC.' : 'NAC./INT.',
      foto_url: preview ?? '',
      bandeira_url: bandeiraUrl(pais) ?? '',
      created_at: new Date().toISOString(),
    }),
    [nome, pais, cidade, origem, preview],
  )

  if (!open) return null

  function aplicarArquivo(file: File | undefined | null) {
    if (!file) return
    if (!arquivoImagemValido(file)) {
      setErro('Selecione uma imagem PNG.')
      return
    }
    setErro(null)
    setFoto(file)
  }

  function handleDrop(e: DragEvent<HTMLButtonElement>) {
    e.preventDefault()
    setArrastando(false)
    aplicarArquivo(e.dataTransfer.files?.[0])
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    if (!foto) {
      setErro('Selecione uma foto da tampinha.')
      return
    }
    if (!nome.trim()) {
      setErro('O nome é obrigatório.')
      return
    }
    if (!pais.trim()) {
      setErro('O país é obrigatório.')
      return
    }
    if (!cidade.trim()) {
      setErro('A cidade é obrigatória.')
      return
    }
    if (!origem) {
      setErro('Selecione o tipo de coleção.')
      return
    }
    setEnviando(true)
    try {
      await onSubmit({
        nome: nome.trim().toUpperCase(),
        pais: pais.trim().toUpperCase(),
        cidade: cidade.trim().toUpperCase(),
        origem,
        foto,
      })
      onClose()
    } catch (err) {
      setErro(getSupabaseErrorMessage(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px',
      background: 'rgba(5, 8, 14, 0.88)',
      backdropFilter: 'blur(6px)'
    }}>
      <button 
        type="button" 
        aria-label="Fechar" 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          border: 'none',
          cursor: 'pointer'
        }}
        onClick={onClose} 
      />
      
      {/* ✅ CONTAINER PRINCIPAL — ESTRUTURA REFEITA */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'min(92vh, 920px)',
        width: '100%',
        maxWidth: '56rem',
        background: 'var(--cyber-card)',
        border: '1px solid var(--cyber-accent)',
        borderRadius: '16px',
        fontFamily: "'Cuprum', sans-serif",
        color: 'var(--cyber-text)',
        overflow: 'hidden' /* ✅ Apenas o container externo controla overflow */
      }}>
        {/* Padrão de pontos sutil no fundo */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, var(--cyber-border) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
          opacity: 0.04,
          pointerEvents: 'none',
          borderRadius: '16px',
          zIndex: 0
        }}></div>

        {/* ✅ CABEÇALHO — FIXO */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '16px 20px',
          borderBottom: '1px solid var(--cyber-border)',
          flexShrink: 0 /* ✅ Não encolhe */
        }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            flexShrink: 0,
            border: '1px solid var(--cyber-border-light)',
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <img 
              src="/logo.png" 
              alt="Logo" 
              style={{
                height: '75%',
                width: '75%',
                objectFit: 'contain',
                filter: 'brightness(1.1)'
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontFamily: 'var(--font-chakra)',
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--cyber-accent-light)',
              margin: 0
            }}>
              Nova Tampinha
            </h2>
            <p style={{
              fontSize: '10px',
              color: 'var(--cyber-muted)',
              letterSpacing: '0.05em',
              marginTop: '2px',
              marginBottom: 0
            }}>
              Cadastre uma nova tampinha.
            </p>
          </div>
        </div>

        {/* ✅ FORMULÁRIO — ENVOLVE TUDO */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          position: 'relative',
          zIndex: 1
        }}>
          
          {/* ✅ ÁREA DE CONTEÚDO ROLÁVEL — UMA ÚNICA BARRA */}
          <div style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto', /* ✅ ÚNICA BARRA DE ROLAGEM */
            display: 'grid',
            gridTemplateColumns: '1fr'
          }}
          className="md:grid-cols-2">
            
            {/* COLUNA ESQUERDA: FORMULÁRIO — SEM overflowY */}
            <div style={{
              padding: '18px 20px',
              borderBottom: '1px solid var(--cyber-border)'
            }}
            className="md:border-b-0 md:border-r">
              
              {/* Seção 1: Foto */}
              <section style={{ marginBottom: '18px' }}>
                <SecaoLabel numero="1" titulo="Foto da Tampinha" />
                <button
                  type="button"
                  onClick={() => inputFotoRef.current?.click()}
                  onDragEnter={(e) => {
                    e.preventDefault()
                    setArrastando(true)
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setArrastando(true)
                  }}
                  onDragLeave={() => setArrastando(false)}
                  onDrop={handleDrop}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    minHeight: '130px',
                    padding: '18px 14px',
                    border: `1px ${arrastando ? 'solid' : 'dashed'} var(--cyber-${arrastando ? 'accent-light' : 'border'})`,
                    background: arrastando ? 'var(--cyber-accent-soft)' : 'rgba(0, 0, 0, 0.25)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    borderRadius: '10px',
                    clipPath: 'none'
                  }}
                >
                  {preview ? (
                    <img 
                      src={preview} 
                      alt="Preview" 
                      style={{
                        maxHeight: '90px',
                        width: 'auto',
                        maxWidth: '100%',
                        borderRadius: '4px',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <>
                      <span style={{
                        fontSize: '10px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: arrastando ? 'var(--cyber-accent-light)' : 'var(--cyber-muted)',
                        textAlign: 'center'
                      }}>
                        Clique aqui
                      </span>
                      <span style={{
                        fontSize: '9px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'rgba(100, 116, 139, 0.6)'
                      }}>
                        Inserir uma foto da tampinha .png
                      </span>
                    </>
                  )}
                </button>
                <input
                  ref={inputFotoRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
                  style={{ display: 'none' }}
                  onChange={(e) => aplicarArquivo(e.target.files?.[0] ?? null)}
                />
              </section>

              {/* Seção 2: Nome */}
              <section style={{ marginBottom: '18px' }}>
                <SecaoLabel numero="2" titulo="Nome da Cerveja / Tampinha" />
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex.: Brahma"
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 14px',
                    border: '1px solid var(--cyber-border)',
                    background: 'rgba(0, 0, 0, 0.35)',
                    color: 'var(--cyber-text)',
                    fontFamily: 'var(--font-chakra)',
                    fontSize: '12px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    outline: 'none',
                    transition: 'border-color 0.25s ease',
                    borderRadius: '8px',
                    clipPath: 'none'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--cyber-accent)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--cyber-border)'
                  }}
                />
              </section>

              {/* Seção 3: País */}
              <section style={{ marginBottom: '18px' }}>
                <SecaoLabel numero="3" titulo="País" />
                <input
                  id="pais"
                  type="text"
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                  placeholder="Ex.: Brasil"
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 14px',
                    border: '1px solid var(--cyber-border)',
                    background: 'rgba(0, 0, 0, 0.35)',
                    color: 'var(--cyber-text)',
                    fontFamily: 'var(--font-chakra)',
                    fontSize: '12px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    outline: 'none',
                    transition: 'border-color 0.25s ease',
                    borderRadius: '8px',
                    clipPath: 'none'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--cyber-accent)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--cyber-border)'
                  }}
                />
              </section>

              {/* Seção 4: Cidade */}
              <section style={{ marginBottom: '18px' }}>
                <SecaoLabel numero="4" titulo="Cidade" />
                <input
                  id="cidade"
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Ex.: São Paulo"
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 14px',
                    border: '1px solid var(--cyber-border)',
                    background: 'rgba(0, 0, 0, 0.35)',
                    color: 'var(--cyber-text)',
                    fontFamily: 'var(--font-chakra)',
                    fontSize: '12px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    outline: 'none',
                    transition: 'border-color 0.25s ease',
                    borderRadius: '8px',
                    clipPath: 'none'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--cyber-accent)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--cyber-border)'
                  }}
                />
              </section>

              {/* Seção 5: Categoria */}
              <section style={{ marginBottom: '18px' }}>
                <SecaoLabel numero="5" titulo="Categoria" />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <BotaoOrigem 
                    label="Nacional" 
                    ativo={origem === 'Nacional'} 
                    onClick={() => setOrigem('Nacional')} 
                  />
                  <BotaoOrigem 
                    label="Internacional" 
                    ativo={origem === 'Internacional'} 
                    onClick={() => setOrigem('Internacional')} 
                  />
                </div>
              </section>

              {/* Mensagem de ERRO */}
              {erro && (
                <div style={{
                  padding: '10px 14px',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  background: 'rgba(127, 29, 29, 0.25)',
                  color: 'rgba(252, 165, 165, 0.95)',
                  fontSize: '11px',
                  letterSpacing: '0.03em',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  {erro}
                </div>
              )}
            </div>

            {/* COLUNA DIREITA: PREVIEW — SEM overflowY */}
            <div style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '12px',
              background: 'rgba(0, 0, 0, 0.15)'
            }}>
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--cyber-accent)'
              }}>
                Preview da Carta
              </span>
              <div style={{ width: '100%', maxWidth: '260px' }}>
                <TampinhaCard tampinha={tampinhaPreview} />
              </div>
              <p style={{
                maxWidth: '240px',
                textAlign: 'center',
                fontSize: '10px',
                color: 'var(--cyber-muted)',
                lineHeight: 1.5,
                margin: 0
              }}>
                Atualiza em tempo real. O arquivo PNG só vai para o bucket ao gravar.
              </p>
            </div>
          </div>

          {/* ✅ BARRA DE AÇÕES — FIXA NA PARTE INFERIOR */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            padding: '14px 20px',
            borderTop: '1px solid var(--cyber-border)',
            flexShrink: 0, /* ✅ Não encolhe — fica sempre visível */
            background: 'var(--cyber-card)' /* ✅ Fundo para não ficar transparente */
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={enviando}
              style={{
                height: '42px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 16px',
                border: '1px solid var(--cyber-border)',
                background: 'rgba(0, 0, 0, 0.3)',
                fontFamily: 'var(--font-chakra)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: enviando ? 'rgba(100, 116, 139, 0.5)' : 'var(--cyber-muted)',
                cursor: enviando ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease',
                borderRadius: '8px',
                opacity: enviando ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!enviando) {
                  e.currentTarget.style.borderColor = 'var(--cyber-accent-light)'
                  e.currentTarget.style.color = 'var(--cyber-text)'
                }
              }}
              onMouseLeave={(e) => {
                if (!enviando) {
                  e.currentTarget.style.borderColor = 'var(--cyber-border)'
                  e.currentTarget.style.color = 'var(--cyber-muted)'
                }
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              style={{
                height: '42px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 16px',
                border: '1px solid var(--cyber-accent)',
                background: 'var(--cyber-accent-soft)',
                fontFamily: 'var(--font-chakra)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: enviando ? 'rgba(255, 154, 60, 0.5)' : 'var(--cyber-accent-light)',
                cursor: enviando ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease',
                borderRadius: '8px',
                opacity: enviando ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!enviando) {
                  e.currentTarget.style.background = 'var(--cyber-accent)'
                  e.currentTarget.style.color = '#0a0e17'
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(255, 107, 26, 0.3)'
                }
              }}
              onMouseLeave={(e) => {
                if (!enviando) {
                  e.currentTarget.style.background = 'var(--cyber-accent-soft)'
                  e.currentTarget.style.color = 'var(--cyber-accent-light)'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            >
              {enviando ? 'Gravando...' : '+ Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}