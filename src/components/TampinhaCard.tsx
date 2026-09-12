import type { Tampinha } from '../types/tampinha'

interface TampinhaCardProps {
  tampinha: Tampinha
  onClick?: () => void
}

export function TampinhaCard({ tampinha, onClick }: TampinhaCardProps) {
  const clicavel = typeof onClick === 'function'
  const bandeira = (tampinha as Tampinha & { bandeira_url?: string }).bandeira_url

  return (
    <article
      role={clicavel ? 'button' : undefined}
      tabIndex={clicavel ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        clicavel
          ? (event: React.KeyboardEvent) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onClick?.()
              }
            }
          : undefined
      }
      className={`cyber-card ${clicavel ? 'cursor-pointer' : ''}`}
      style={{
        fontFamily: '"JetBrains Mono", monospace',
        position: 'relative',
        /* ✅ FUNDO TRANSPARENTE → deixa a imagem de fundo aparecer */
        background: 'rgba(15, 21, 32, 0.1)',
        backdropFilter: 'blur(8px)', /* ✅ Efeito vidro fosco */
        borderRadius: '16px',
        padding: '14px 12px 12px',
        minHeight: '240px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(255, 107, 26, 0.25)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 154, 60, 0.6)'
        e.currentTarget.style.background = 'rgba(15, 21, 32, 0.8)'
        e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 107, 26, 0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 107, 26, 0.25)'
        e.currentTarget.style.background = 'rgba(15, 21, 32, 0.65)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* NOME DA CERVEJA — EM BRANCO */}
      <div style={{
        width: '100%',
        textAlign: 'center',
        paddingBottom: '8px',
        borderBottom: '1px solid rgba(255, 107, 26, 0.25)'
      }}>
        <span style={{
          fontSize: '13px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.10em',
          color: '#FFFFFF',
          fontFamily: 'Trebuchet MS'
        }}>
          {tampinha.nome}
        </span>
      </div>

      {/* IMAGEM DA TAMPINHA COM 4 CANTOS EM "L" */}
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
        {/* CANTO SUPERIOR ESQUERDO */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          width: '16px',
          height: '16px',
          borderTop: '1px solid var(--cyber-accent)',
          borderLeft: '1px solid var(--cyber-accent)',
          zIndex: 3
        }}></div>
        {/* CANTO SUPERIOR DIREITO */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: '16px',
          height: '16px',
          borderTop: '1px solid var(--cyber-accent)',
          borderRight: '1px solid var(--cyber-accent)',
          zIndex: 3
        }}></div>
        {/* CANTO INFERIOR ESQUERDO */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          width: '16px',
          height: '16px',
          borderBottom: '1px solid var(--cyber-accent)',
          borderLeft: '1px solid var(--cyber-accent)',
          zIndex: 3
        }}></div>
        {/* CANTO INFERIOR DIREITO */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          width: '16px',
          height: '16px',
          borderBottom: '1px solid var(--cyber-accent)',
          borderRight: '1px solid var(--cyber-accent)',
          zIndex: 3
        }}></div>

        {/* IMAGEM */}
        {tampinha.foto_url ? (
          <img
            src={tampinha.foto_url}
            alt={tampinha.nome}
            loading="lazy"
            style={{
              width: '85%',
              height: '85%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 16px 10px rgba(0, 0, 0, 0.9))',
              position: 'relative',
              zIndex: 2
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '85%',
            height: '85%',
            borderRadius: '50%',
            border: '1px dashed var(--cyber-border)',
            color: 'var(--cyber-muted)',
            fontSize: '11px',
            letterSpacing: '0.2em',
            fontFamily: '"JetBrains Mono", monospace'
          }}>
            SEM IMAGEM
          </div>
        )}
      </div>

      {/* PAÍS + BANDEIRA E CIDADE */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        width: '100%',
        paddingTop: '12px',
        borderTop: '1px solid rgba(255, 107, 26, 0.15)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {bandeira && (
            <img
              src={bandeira}
              alt={tampinha.pais}
              style={{
                height: '16px',
                width: '22px',
                borderRadius: '1px',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          )}
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--cyber-text)',
            fontFamily: '"JetBrains Mono", monospace'
          }}>
            {tampinha.pais}
          </span>
        </div>
        <span style={{
          fontSize: '10px',
          fontWeight: 400,
          textTransform: 'uppercase',
          letterSpacing: '0.10em',
          color: 'var(--cyber-accent)',
          fontFamily: '"JetBrains Mono", monospace'
        }}>
          {tampinha.cidade || '—'}
        </span>
      </div>
    </article>
  )
}