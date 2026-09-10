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
        fontFamily: "'Cuprum', sans-serif"
      }}
    >
      {/* ✅ NÃO HÁ MAIS CANTOS EM L AQUI */}

      {/* IMAGEM DA TAMPINHA — BORDAS ARREDONDADAS */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        margin: '0 auto 6px',
        border: '2px solid var(--cyber-border)',
        background: '#04090f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px', /* ✅ Arredondado */
        overflow: 'hidden'
      }}>
        {/* Cantos internos brancos — mantidos para charme */}
        <div style={{
          position: 'absolute',
          top: '6px',
          left: '6px',
          width: '12px',
          height: '12px',
          borderTop: '1px solid #ffffff',
          borderLeft: '1px solid #ffffff',
          zIndex: 2
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '6px',
          right: '6px',
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
              width: '100%',
              height: '100%',
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

      {/* NOME DA CERVEJA — TEXTO SOLTO */}
      <h3 style={{
        fontSize: '14px',
        fontWeight: 700,
        textTransform: 'uppercase',
        color: '#ffffff',
        letterSpacing: '0.10em',
        margin: '0 0 4px 0',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        position: 'relative',
        zIndex: 1
      }} title={tampinha.nome}>
        {tampinha.nome}
      </h3>

      {/* BANDEIRA — CENTRALIZADA + LARGURA AJUSTÁVEL */}
      {bandeira && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',   // ✅ Centraliza HORIZONTALMENTE
          alignItems: 'center',       // ✅ Centraliza VERTICALMENTE
          width: '100%',              // ✅ Ocupa toda a largura do card
          position: 'relative',
          zIndex: 1,
          marginBottom: '8px',
        }}>
          {/* Célula da bandeira — com LARGURA FIXA e CENTRALIZADA */}
          <div style={{
            width: '120px',             // ✅ AJUSTE A LARGURA AQUI (60px, 80px, 100px...)
            padding: '4px 10px',
            border: '2px solid var(--cyber-accent-soft)',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'center',  // ✅ Centraliza a bandeira DENTRO da célula
            alignItems: 'center',
          }}>
            <img
              src={bandeira}
              alt={tampinha.pais}
              style={{
                height: '18px',
                width: '24px',
                borderRadius: '1px',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        </div>
      )}

      {/* NOME DO PAÍS — TEXTO SOLTO */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        marginBottom: '4px',
        textAlign: 'center'
      }}>
        <span style={{
          fontSize: '16px',
          color: '#ffffff',
          fontWeight: 700,
          letterSpacing: '0.1em'
        }}>
          ::
        </span>
        <span style={{
          fontSize: '16px',
          color: 'var(--cyber-accent)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.10em',
          margin: '0 8px'
        }} title={tampinha.pais}>
          {tampinha.pais}
        </span>
        <span style={{
          fontSize: '16px',
          color: '#ffffff',
          fontWeight: 700,
          letterSpacing: '0.1em'
        }}>
          ::
        </span>
      </div>

      {/* Linha pontilhada */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        height: '1px',
        backgroundImage: 'radial-gradient(circle, var(--cyber-border) 1px, transparent 2px)',
        backgroundSize: '5px 2px',
        marginBottom: '4px'
      }}></div>

      {/* NOME DA CIDADE */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        marginBottom: '4px',
        textAlign: 'center'
      }}>
        <span style={{
          fontSize: '12px',
          color: '#ffff55',
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