import type { Tampinha } from '../types/tampinha'

interface TampinhaCardProps {
  tampinha: Tampinha
  onClick?: () => void
}

function formatHudId(id: unknown): string {
  const raw = String(id ?? '')
  const digits = raw.replace(/\D/g, '')
  if (digits.length > 0) {
    return digits.slice(-4).padStart(4, '0')
  }
  const compact = raw.replace(/-/g, '').slice(-4).toUpperCase()
  return (compact || '0000').padStart(4, '0')
}

function gerarPadraoBarcode(id: unknown): Array<{ width: number; shade: number }> {
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
  return bars
}

function BarcodeSVG({ id }: { id: unknown }) {
  const bars = gerarPadraoBarcode(id)
  let x = 2
  const totalWidth = bars.reduce((acc, b) => acc + b.width + 1, 0) + 4
  const shades = [
    'rgba(255,255,255,0.50)',
    'rgba(255,255,255,0.35)',
    'rgba(255,255,255,0.20)'
  ]

  return (
    <svg
      width="100%"
      height="28"
      viewBox={`0 0 ${totalWidth} 28`}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      {bars.map((bar, i) => {
        const rect = (
          <rect
            key={i}
            x={x}
            y="0"
            width={bar.width}
            height="28"
            fill={shades[bar.shade]}
          />
        )
        x += bar.width + 1
        return rect
      })}
    </svg>
  )
}

export function TampinhaCard({ tampinha, onClick }: TampinhaCardProps) {
  const clicavel = typeof onClick === 'function'
  const hudId = formatHudId(tampinha.id)

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
        padding: '18px 16px 14px',
        fontFamily: "'Cuprum', sans-serif"
      }}
    >
      {/* Cantos externos */}
      <div className="cyber-corner-tl"></div>
      <div className="cyber-corner-br"></div>

      {/* Cabeçalho: CÓDIGO + ID */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        marginBottom: '12px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span className="cyber-header-dot">
            <span className="cyber-blink"></span>
          </span>
          <div style={{
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--cyber-accent)',
            fontWeight: 700
          }}>
            Código
          </div>
        </div>
        <div style={{
          fontSize: '10px',
          letterSpacing: '0.18em',
          color: '#ffffff',
          fontWeight: 700
        }}>
          ID #{hudId}
        </div>
      </div>

      {/* Moldura da tampinha */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        margin: '0 auto 14px',
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
          width: '14px',
          height: '14px',
          borderTop: '1px solid #ffffff',
          borderLeft: '1px solid #ffffff',
          zIndex: 2
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '4px',
          right: '4px',
          width: '14px',
          height: '14px',
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
              width: '78%',
              height: '78%',
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

      {/* Nome da cerveja — borda laranja + cantos */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        marginBottom: '10px',
        padding: '0 4px'
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          height: '34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--cyber-accent-soft)',
          background: 'transparent',
          clipPath: 'polygon(0 6px, 6px 0, calc(100% - 12px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 12px 100%, 0 calc(100% - 6px))'
        }}>
          {/* Cantos na cor laranja */}
          <div style={{
            position: 'absolute',
            top: 3,
            left: 3,
            width: '18px',
            height: '18px',
            borderTop: '1px solid var(--cyber-accent)',
            borderLeft: '1px solid var(--cyber-accent)'
          }}></div>
          <div style={{
            position: 'absolute',
            top: 3,
            right: 3,
            width: '18px',
            height: '18px',
            borderTop: '1px solid var(--cyber-accent)',
            borderRight: '1px solid var(--cyber-accent)'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: 3,
            left: 3,
            width: '18px',
            height: '18px',
            borderBottom: '1px solid var(--cyber-accent)',
            borderLeft: '1px solid var(--cyber-accent)'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: 3,
            right: 3,
            width: '18px',
            height: '18px',
            borderBottom: '1px solid var(--cyber-accent)',
            borderRight: '1px solid var(--cyber-accent)'
          }}></div>

          <h3 style={{
            fontSize: '15px',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#ffffff',
            letterSpacing: '0.12em',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            padding: '0 22px'
          }} title={tampinha.nome}>
            {tampinha.nome}
          </h3>
        </div>
      </div>

{/* Bandeira do país */}
{(tampinha as Tampinha & { bandeira_url?: string }).bandeira_url && (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
    marginBottom: '8px'
  }}>
    <img
      src={(tampinha as Tampinha & { bandeira_url?: string }).bandeira_url}
      alt={tampinha.pais}
      style={{
        height: '18px',
        width: '26px',
        borderRadius: '2px',
        objectFit: 'cover'
      }}
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  </div>
)}      {/* Nome do país — retângulo borda laranja + fundo preto + fonte aumentada */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        marginBottom: '10px'
      }}>
        <div style={{
          width: '100%',
          height: '34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          border: '1px solid var(--cyber-accent-soft)',
          background: '#000000',
          clipPath: 'polygon(0 5px, 5px 0, calc(100% - 10px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 10px 100%, 0 calc(100% - 5px))'
        }}>
          <span style={{
            fontSize: '13px',
            color: 'var(--cyber-accent)',
            fontWeight: 700,
            letterSpacing: '0.1em'
          }}>
            : :
          </span>
          <span style={{
            fontSize: '14px',
            color: 'var(--cyber-accent)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em'
          }} title={tampinha.pais}>
            {tampinha.pais}
          </span>
          <span style={{
            fontSize: '13px',
            color: 'var(--cyber-accent)',
            fontWeight: 700,
            letterSpacing: '0.1em'
          }}>
            : :
          </span>
        </div>
      </div>

      {/* Linha pontilhada */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        height: '2px',
        backgroundImage: 'radial-gradient(circle, var(--cyber-border) 1px, transparent 2px)',
        backgroundSize: '6px 1px',
        marginBottom: '10px'
      }}></div>

      {/* Nome da cidade */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        marginBottom: '12px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <span style={{
            fontSize: '12px',
            color: '#ffffff',
            fontWeight: 700
          }}>
            +
          </span>
          <span style={{
            fontSize: '11px',
            color: '#ffffff',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em'
          }} title={tampinha.cidade}>
            {tampinha.cidade}
          </span>
          <span style={{
            fontSize: '12px',
            color: '#ffffff',
            fontWeight: 700
          }}>
            +
          </span>
        </div>
      </div>

      {/* Código de barras 50% transparente */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '8px 14px 8px',
        border: '1px solid var(--cyber-border)',
        background: 'rgba(0,0,0,0.25)',
        clipPath: 'polygon(0 6px, 6px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 12px 100%, 0 calc(100% - 12px))'
      }}>
        <BarcodeSVG id={tampinha.id} />
      </div>
    </article>
  )
}