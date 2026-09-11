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
        fontFamily: "'Cuprum', sans-serif",
        position: 'relative',
        background: '#0f1419', // ✅ Fundo escuro harmonizado com o modal
        borderRadius: '12px',
        padding: '1px',
        minHeight: '260px',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(255, 107, 26, 0.90)', // ✅ Borda laranja sutil
        overflow: 'hidden'
      }}
    >
      {/* ID — CANTO SUPERIOR DIREITO */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '12px',
        fontSize: '13px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: '#9ca3af' // ✅ Cinza suave — igual texto secundário
      }}>
        ID #{String(tampinha.id || '0000').padStart(3, '0')}
      </div>

      {/* TAMPINHA — SEM SOMBRA ATRÁS */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        maxWidth: '180px',
        margin: '36px auto 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '0%',
        background: '#1a1f2e' // ✅ Fundo da área da tampinha — igual caixas do modal
      }}>
        {tampinha.foto_url ? (
          <img
            src={tampinha.foto_url}
            alt={tampinha.nome}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
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
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            border: '1px dashed rgba(255, 107, 26, 0.35)',
            color: '#9ca3af',
            fontSize: '12px',
            letterSpacing: '0.2em'
          }}>
            PNG
          </div>
        )}
      </div>

      {/* ✅ LINHA ACIMA DO NOME — laranja sutil */}
      <div style={{
        width: '100%',
        height: '1px',
        margin: '0 auto 10px',
        background: 'rgba(255, 107, 26, 0.35)',
        opacity: 1
      }}></div>

      {/* NOME DA CERVEJA */}
      <h3 style={{
        fontSize: '14px',
        fontWeight: 700,
        textTransform: 'uppercase',
        color: '#ffffff',
        letterSpacing: '0.10em',
        textAlign: 'center',
        margin: '0 0 12px 0',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }} title={tampinha.nome}>
        {tampinha.nome}
      </h3>

      {/* ✅ CAIXA BANDEIRA + PAÍS — SEM FUNDO, BORDA LARANJA */}
      {bandeira && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '8px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '3px 16px',
            background: 'transparent',
            border: '1px solid #ff6b1a',
            borderRadius: '4px'
          }}>
            <img
              src={bandeira}
              alt={tampinha.pais}
              style={{
                height: '14px',
                width: '20px',
                borderRadius: '1px',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <span style={{
              fontSize: '12px',
              fontWeight: 800,
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              {tampinha.pais}
            </span>
          </div>
        </div>
      )}

      {/* CIDADE */}
      <div style={{
        textAlign: 'center',
        marginTop: 'auto',
        paddingBottom: '4px'
      }}>
        <span style={{
          fontSize: '12px',
          color: '#9ca3af',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }} title={tampinha.cidade}>
          {tampinha.cidade || '—'}
        </span>
      </div>
    </article>
  )
}