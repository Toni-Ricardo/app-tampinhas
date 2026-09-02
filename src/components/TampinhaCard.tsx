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

function localRodape(tampinha: any): string | null {
  const cidade = String(tampinha.cidade ?? '').trim()
  const pais = String(tampinha.pais ?? '').trim()
  if (!cidade && !pais) return null
  if (cidade && /[-–]/.test(cidade)) return cidade.toUpperCase()
  if (cidade && pais) return `${cidade.toUpperCase()} - ${pais.toUpperCase()}`
  return (cidade || pais).toUpperCase()
}

export function TampinhaCard({ tampinha, onClick }: TampinhaCardProps) {
  const categoria =
    tampinha.origem_formatada ||
    (String(tampinha.origem ?? '').toLowerCase().trim() === 'nacional' ? 'NAC.' : 'INT.')
  const local = localRodape(tampinha)
  const clicavel = typeof onClick === 'function'

  return (
    <article
      role={clicavel ? 'button' : undefined}
      tabIndex={clicavel ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        clicavel
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      className={`group relative rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-amber-500 p-[1px] shadow-[0_0_12px_rgba(103,143,203,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(103,143,203,0.55),0_0_18px_rgba(245,158,11,0.35)] ${
        clicavel ? 'cursor-pointer' : ''
      }`}
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-slate-900/80 backdrop-blur-md">
        <span className="absolute left-3 top-2 z-20 font-mono text-[10px] tracking-[0.14em] text-slate-200/90">
          ID #{formatHudId(tampinha.id)}
        </span>

        {/* ÁREA DA IMAGEM */}
        <div className="relative mt-6 flex aspect-square items-center justify-center px-4 pb-1">
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-5 left-1/2 h-7 w-[62%] -translate-x-1/2 rounded-[100%] bg-black/55 blur-md"
          />
          {tampinha.foto_url ? (
            <img
              src={tampinha.foto_url}
              alt={tampinha.nome}
              className="relative z-10 h-full w-full object-contain drop-shadow-[0_16px_18px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="relative z-10 flex h-[70%] w-[70%] items-center justify-center rounded-full border border-dashed border-slate-600/80 bg-slate-950/50 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
              PNG
            </div>
          )}
        </div>

        {/* 🔴 LINHA DIVISÓRIA SUTIL ENTRE FOTO E DADOS NO CARD */}
        <div className="mx-4 my-1 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        {/* DADOS DO CADASTRO */}
        <div className="flex flex-col items-center px-3 pb-3 pt-1 text-center">
          <h3
            className={`font-ubuntu w-full truncate text-sm font-bold uppercase tracking-wide ${
              tampinha.nome ? 'text-white' : 'text-slate-600'
            }`}
          >
            {tampinha.nome || 'Nome da cerveja'}
          </h3>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
            <span className="inline-flex max-w-full items-center gap-1 rounded-md bg-slate-950/70 px-2 py-1.5 text-[11px] font-medium uppercase tracking-wide text-amber-400">
              {tampinha.bandeira_url && (
                <img
                  src={tampinha.bandeira_url}
                  alt=""
                  className="h-3.5 w-5 flex-shrink-0 rounded-sm object-cover brightness-95 shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
              <span className="truncate">{tampinha.pais || 'Desconhecido'}</span>
            </span>

            <span className="rounded-md bg-slate-950/70 px-2 py-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              {categoria}
            </span>
          </div>

          {local && (
            <span className="mt-2 w-full truncate text-[10px] font-medium uppercase tracking-wide text-slate-400">
              {local}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}