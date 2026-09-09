interface TampinhaCardProps {
  tampinha: any
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

/**
 * Gera um padrão de código de barras único baseado no ID
 * Retorna array de larguras (1-5) e tonalidades
 */
function gerarPadraoBarcode(id: unknown): Array<{ width: number; shade: number }> {
  const seed = String(id ?? '0000').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const bars: Array<{ width: number; shade: number }> = []
  let s = seed
  for (let i = 0; i < 52; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    const width = 1 + (s % 5)
    const shade = s % 3 // 0=claro, 1=medio, 2=escuro
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
    'rgba(255,107,26,0.35)',  // claro
    'rgba(255,154,60,0.55)',  // médio
    '#ff6b1a'                   // escuro
  ]
  
  return (
    <svg 
      width="100%" 
      height="32" 
      viewBox={`0 0 ${totalWidth} 32`} 
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      {bars.map((bar, i) => {
        const rect = (
          <rect
            key={i}
            x={x}
            y="2"
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
  const nomeCerveja = String(tampinha.nome || '').trim().toUpperCase() || 'NOME DA CERVEJA'
  const pais = String(tampinha.pais || '').trim().toUpperCase() || 'PAÍS'
  const cidade = String(tampinha.cidade || '').trim().toUpperCase() || 'CIDADE'

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
    >
      {/* Cantos em L externos */}
      <div className="cyber-corner-tl"></div>
      <div className="cyber-corner-br"></div>

      {/* Cabeçalho: ícone piscante + ID */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div className="cyber-header-dot">
          <span className="cyber-blink"></span>
        </div>
        <div className="cyber-label">ID #{hudId}</div>
      </div>

      {/* Divisor linha */}
      <div className="cyber-divider" style={{ position: 'relative', zIndex: 1 }}></div>

      {/* Moldura da imagem */}
      <div className="cyber-image-wrapper" style={{ position: 'relative', zIndex: 1 }}>
        <div className="cyber-frame-corner-tl"></div>
        <div className="cyber-frame-corner-br"></div>
        {tampinha.foto_url ? (
          <img
            src={tampinha.foto_url}
            alt={nomeCerveja}
            loading="lazy"
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
            border: '1px dashed rgba(255,107,26,0.4)',
            background: 'rgba(0,0,0,0.3)',
            fontSize: '9px',
            color: 'var(--cyber-muted)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase'
          }}>
            PNG
          </div>
        )}
      </div>

      {/* Divisor pontos + linhas */}
      <div className="cyber-divider-dots" style={{ position: 'relative', zIndex: 1 }}>
        <span className="dot"></span>
        <span className="line"></span>
        <span className="dot"></span>
        <span className="line"></span>
        <span className="dot"></span>
      </div>

      {/* Dados da tampinha */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="cyber-stat-row">
          <div className="cyber-stat-label"><span className="tick"></span>CERVEJA</div>
          <div className="cyber-stat-value" style={{ color: '#ffffff' }} title={nomeCerveja}>
            {nomeCerveja}
          </div>
        </div>
        <div className="cyber-stat-row">
          <div className="cyber-stat-label"><span className="tick"></span>ORIGEM</div>
          <div className="cyber-stat-value" style={{ color: 'var(--cyber-accent)' }} title={pais}>
            {pais}
          </div>
        </div>
        <div className="cyber-stat-row">
          <div className="cyber-stat-label"><span className="tick"></span>CIDADE</div>
          <div className="cyber-stat-value" style={{ color: 'var(--cyber-accent)' }} title={cidade}>
            {cidade}
          </div>
        </div>
      </div>

      {/* Divisor linha */}
      <div className="cyber-divider" style={{ position: 'relative', zIndex: 1 }}></div>

      {/* Código de barras personalizado */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="cyber-barcode-label">
          <span className="cyber-label">CÓDIGO</span>
          <span style={{
            fontSize: '9px',
            color: 'var(--cyber-accent-light)',
            fontFamily: "'Courier New', monospace"
          }}>*{hudId}*</span>
        </div>
        <div className="cyber-barcode-wrap">
          <BarcodeSVG id={tampinha.id} />
          <div className="cyber-barcode-text" title={nomeCerveja}>
            {nomeCerveja}
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="cyber-footer-code" style={{ position: 'relative', zIndex: 1 }}>
        <span>VCR: 1.0</span>
        <span>STAT: Active</span>
      </div>
    </article>
  )
}