import { useState } from 'react'

export function ContatoPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [assunto, setAssunto] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    // Simulação de envio — substitua por sua lógica real
    await new Promise(resolve => setTimeout(resolve, 1200))
    setEnviando(false)
    setEnviado(true)
    // Limpa após 3s
    setTimeout(() => {
      setEnviado(false)
      setNome('')
      setEmail('')
      setAssunto('')
      setMensagem('')
    }, 3000)
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
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'min(92vh, 800px)',
        width: '100%',
        maxWidth: '56rem',
        background: 'var(--cyber-card)',
        border: '1px solid var(--cyber-accent)',
        borderRadius: '16px',
        fontFamily: "'Cuprum', sans-serif",
        color: 'var(--cyber-text)',
        overflow: 'hidden'
      }}>
        {/* Padrão de fundo */}
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

        {/* === CABEÇALHO COM LOGO === */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '16px 20px',
          borderBottom: '1px solid var(--cyber-border)',
          flexShrink: 0
        }}>
          {/* Logo no canto esquerdo */}
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

          {/* Título e subtítulo */}
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
              Contato
            </h2>
            <p style={{
              fontSize: '10px',
              color: 'var(--cyber-muted)',
              letterSpacing: '0.05em',
              marginTop: '2px',
              marginBottom: 0
            }}>
              "A cada tampinha uma história."
            </p>
          </div>
        </div>

        {/* === FORMULÁRIO === */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '20px',
          position: 'relative',
          zIndex: 1,
          overflowY: 'auto'
        }}>
          {/* Nome */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--cyber-accent)'
            }}>
              Seu Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
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
                outline: 'none',
                transition: 'border-color 0.25s ease',
                borderRadius: '8px'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--cyber-accent)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--cyber-border)'}
            />
          </div>

          {/* E-mail */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--cyber-accent)'
            }}>
              Seu E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
                outline: 'none',
                transition: 'border-color 0.25s ease',
                borderRadius: '8px'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--cyber-accent)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--cyber-border)'}
            />
          </div>

          {/* Assunto */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--cyber-accent)'
            }}>
              Assunto
            </label>
            <input
              type="text"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              required
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
                outline: 'none',
                transition: 'border-color 0.25s ease',
                borderRadius: '8px'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--cyber-accent)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--cyber-border)'}
            />
          </div>

          {/* Mensagem */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--cyber-accent)'
            }}>
              Mensagem
            </label>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              required
              rows={5}
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '14px',
                border: '1px solid var(--cyber-border)',
                background: 'rgba(0, 0, 0, 0.35)',
                color: 'var(--cyber-text)',
                fontFamily: 'var(--font-chakra)',
                fontSize: '12px',
                letterSpacing: '0.05em',
                outline: 'none',
                transition: 'border-color 0.25s ease',
                borderRadius: '8px',
                resize: 'vertical'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--cyber-accent)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--cyber-border)'}
            />
          </div>

          {/* Botão Enviar */}
          <button
            type="submit"
            disabled={enviando}
            style={{
              width: '100%',
              height: '46px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 16px',
              border: '1px solid var(--cyber-accent)',
              background: 'var(--cyber-accent-soft)',
              fontFamily: 'var(--font-chakra)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: enviando ? 'rgba(255, 154, 60, 0.5)' : 'var(--cyber-accent-light)',
              cursor: enviando ? 'not-allowed' : 'pointer',
              transition: 'all 0.25s ease',
              borderRadius: '8px',
              opacity: enviando ? 0.5 : 1,
              marginBottom: '24px'
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
            {enviado ? '✓ Mensagem Enviada!' : enviando ? 'Enviando...' : 'Enviar Mensagem'}
          </button>

          {/* === INFORMAÇÕES — ABAIXO DO BOTÃO === */}
          <div style={{
            paddingTop: '20px',
            borderTop: '1px solid var(--cyber-border)'
          }}>
            <h3 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--cyber-accent)',
              marginBottom: '14px'
            }}>
              Contato
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: 'var(--cyber-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ color: 'var(--cyber-accent)' }}>
				<span style={{ color: 'var(--cyber-accent)', fontFamily: 'var(--font-chakra)', fontWeight: 700, fontSize: '16px', flexShrink: 0, opacity: 0.7 }}>+</span></span>
                coisadigital@gmail.com
              </p>

              <p style={{
                margin: 0,
                fontSize: '12px',
                color: 'var(--cyber-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ color: 'var(--cyber-accent)' }}><span style={{ color: 'var(--cyber-accent)', fontFamily: 'var(--font-chakra)', fontWeight: 700, fontSize: '16px', flexShrink: 0, opacity: 0.7 }}>+</span></span>
                WhatsApp: (16) 98810-5510
              </p>

              <p style={{
                margin: 0,
                fontSize: '12px',
                color: 'var(--cyber-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ color: 'var(--cyber-accent)' }}><span style={{ color: 'var(--cyber-accent)', fontFamily: 'var(--font-chakra)', fontWeight: 700, fontSize: '16px', flexShrink: 0, opacity: 0.7 }}>+</span></span>
                Localização: Jardinópolis — SP
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}