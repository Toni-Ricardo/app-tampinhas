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
        padding: '14px 12px 12px',
        fontFamily: "'Cuprum', sans-serif"
      }}
    >
      {/* Cantos externos — mantidos para identidade cyberpunk */}
      <div className="cyber-corner-tl"></div>
      <div className="cyber-corner-br"></div>

      {/* ✅ IMAGEM DA TAMPINHA — AUMENTADA PARA DESTAQUE MÁXIMO */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        margin: '0 auto 12px',
        border: '1px solid var(--cyber-border)',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        clipPath: 'polygon(0 8px, 8px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 16px 100%, 0 calc(100% - 16px))',
        overflow: 'hidden'
      }}>
        {/* Cantos internos brancos */}
        <div style={{
          position: 'absolute',
          top: '4px',
          left: '4px',
          width: '12px',
          height: '12px',
          borderTop: '1px solid #ffffff',
          borderLeft: '1px solid #ffffff',
          zIndex: 2
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '4px',
          right: '4px',
          width: '12px',
          height: '12px',
          borderBottom: '1px solid #ffffff',
          borderRight: '1px solid #ffffff',
          zIndex: 2
        }}></div>

        {tampinha.foto_url ? (
          <img
            src={tampinha.foto_url}
            alt={tampinha.nome}
            loading="lazy"
            style={{
              width: '88%',
              height: '88%',
              objectFit: 'contain',
              transition: 'transform 0.4s ease'
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
            width: '70%',
            height: '70%',
            borderRadius: '50%',
            border: '1px dashed rgba(255,255,255,0.45)',
            background: 'rgba(0,0,0,0.3)',
            fontSize: '9px',
            color: '#ffffff',
            letterSpacing: '0.2em',
            textTransform: 'uppercase'
          }}>
            PNG
          </div>
        )}
      </div>

      {/* ✅ NOME DA CERVEJA — TEXTO SOLTO, SEM BORDAS NEM ELEMENTOS */}
      <h3 style={{
        fontSize: '13px',
        fontWeight: 700,
        textTransform: 'uppercase',
        color: '#ffffff',
        letterSpacing: '0.10em',
        margin: '0 0 10px 0',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        position: 'relative',
        zIndex: 1
      }} title={tampinha.nome}>
        {tampinha.nome}
      </h3>

      {/* ✅ BANDEIRA — COM BORDA FINA LARANJA SOFT NA CÉLULA TODA */}
      {bandeira && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          marginBottom: '8px',
          padding: '4px 8px',
          border: '1px solid var(--cyber-accent-soft)',
          clipPath: 'polygon(0 4px, 4px 0, calc(100% - 8px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 8px 100%, 0 calc(100% - 4px))'
        }}>
          <img
            src={bandeira}
            alt={tampinha.pais}
            style={{
              height: '14px',
              width: '20px',
              borderRadius: '2px',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )}

      {/* ✅ NOME DO PAÍS — SEM FUNDO, SEM CONTORNOS, TEXTO SOLTO */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        marginBottom: '8px',
        textAlign: 'center'
      }}>
        <span style={{
          fontSize: '11px',
          color: 'var(--cyber-accent)',
          fontWeight: 700,
          letterSpacing: '0.1em'
        }}>
          ::
        </span>
        <span style={{
          fontSize: '11px',
          color: 'var(--cyber-accent)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.10em',
          margin: '0 8px'
        }} title={tampinha.pais}>
          {tampinha.pais}
        </span>
        <span style={{
          fontSize: '11px',
          color: 'var(--cyber-accent)',
          fontWeight: 700,
          letterSpacing: '0.1em'
        }}>
          ::
        </span>
      </div>

      {/* Linha pontilhada — mantida como separador sutil */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        height: '1px',
        backgroundImage: 'radial-gradient(circle, var(--cyber-border) 1px, transparent 1px)',
        backgroundSize: '5px 1px',
        marginBottom: '8px'
      }}></div>

      {/* ✅ NOME DA CIDADE — SEM OS "+" */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        marginBottom: '4px',
        textAlign: 'center'
      }}>
        <span style={{
          fontSize: '10px',
          color: '#ffffff',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.10em'
        }} title={tampinha.cidade}>
          {tampinha.cidade}
        </span>
      </div>
    </article>
  )
}