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
        background: 'var(--cyber-card)',
        borderRadius: '8px',
        padding: '12px 8px 10px',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 24px rgba(255, 107, 26, 0.18)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* TEXTO SUPERIOR — NOME EM BRANCO */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '4px',
        marginBottom: '0px',
        zIndex: 5
      }}>
        <span style={{
          fontSize: '14px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.10em',
          color: '#FFFFFF',
          fontFamily: '"JetBrains Mono", monospace'
        }}>
          {tampinha.nome}
        </span>
      </div>

{/* TAMPINHA COM 4 CANTOS EM "L" MAIS PRÓXIMOS DO CENTRO */}
<div style={{
  position: 'relative',
  width: '100%',
  maxWidth: '180px',
  aspectRatio: '1 / 1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '2px',
  zIndex: 2
}}>
  {/* CANTO SUPERIOR ESQUERDO — DESLOCADO PARA DENTRO */}
  <div style={{
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: '14px',
    height: '14px',
    borderTop: '1px solid var(--cyber-accent)',
    borderLeft: '1px solid var(--cyber-accent)',
    zIndex: 3
  }}></div>

  {/* CANTO SUPERIOR DIREITO — DESLOCADO PARA DENTRO */}
  <div style={{
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '14px',
    height: '14px',
    borderTop: '1px solid var(--cyber-accent)',
    borderRight: '1px solid var(--cyber-accent)',
    zIndex: 3
  }}></div>

  {/* CANTO INFERIOR ESQUERDO — DESLOCADO PARA DENTRO */}
  <div style={{
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    width: '14px',
    height: '14px',
    borderBottom: '1px solid var(--cyber-accent)',
    borderLeft: '1px solid var(--cyber-accent)',
    zIndex: 3
  }}></div>

  {/* CANTO INFERIOR DIREITO — DESLOCADO PARA DENTRO */}
  <div style={{
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    width: '14px',
    height: '14px',
    borderBottom: '1px solid var(--cyber-accent)',
    borderRight: '1px solid var(--cyber-accent)',
    zIndex: 3
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
        filter: 'drop-shadow(0 16px 10px rgba(0, 0, 0, 0.9))'
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
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '1px dashed var(--cyber-border)',
      color: 'var(--cyber-muted)',
      fontSize: '11px',
      letterSpacing: '0.2em',
      fontFamily: '"JetBrains Mono", monospace'
    }}>
      PNG
    </div>
  )}
</div>
      {/* TEXTO INFERIOR — PAÍS E CIDADE */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        zIndex: 5
      }}>
        {/* LINHA DE CIMA: Bandeira + País */}
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
                height: '18px',
                width: '24px',
                borderRadius: '1px',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          )}
          <span style={{
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--cyber-text)',
            fontFamily: '"JetBrains Mono", monospace'
          }}>
            {tampinha.pais}
          </span>
        </div>

        {/* LINHA DE BAIXO: Cidade */}
        <div>
          <span style={{
            fontSize: '11px',
            fontWeight: 200,
            textTransform: 'uppercase',
            letterSpacing: '0.10em',
            color: 'var(--cyber-accent)',
            fontFamily: '"JetBrains Mono", monospace'
          }}>
            {tampinha.cidade || '—'}
          </span>
        </div>
      </div>
    </article>
  )
}