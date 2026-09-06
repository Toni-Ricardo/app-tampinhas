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
      className={`group relative rounded-2xl
        border border-[#2385bb]
        bg-slate-900/95
        shadow-[0_0_15px_rgba(35,133,187,0.35)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_0_22px_rgba(35,133,187,0.55)]
        ${clicavel ? 'cursor-pointer' : ''}`}
    >
      {/* ID no canto superior */}
      <span className="absolute left-3 top-2.5 z-20 font-mono text-[10px] tracking-[0.14em] text-[#7dd3fc]">
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

      {/* LINHA DIVISÓRIA SUTIL */}
      <div className="mx-4 my-1 h-[1px] border-t border-[#2385bb]/50" />

      {/* 📋 ÁREA INFERIOR */}
      <div className="flex flex-col items-center px-4 pb-3 pt-2 text-center
        bg-slate-950/90 rounded-b-2xl border-t border-[#2385bb]/50">

        {/* Nome da tampinha */}
        <h3
          className={`font-ubuntu w-full truncate text-base font-bold uppercase tracking-wide mb-2 ${
            tampinha.nome ? 'text-white' : 'text-slate-600'
          }`}
        >
          {tampinha.nome || 'Nome da cerveja'}
        </h3>

        {/* 🌍 Bandeira + País — Aumentado e centralizado */}
        <span className="inline-flex items-center justify-center gap-2.5 px-5 py-2 rounded-md bg-slate-900/80 border border-slate-700/50">
          {tampinha.bandeira_url && (
            <img
              src={tampinha.bandeira_url}
              alt=""
              className="h-5 w-7 flex-shrink-0 rounded-sm object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          )}
          <span className="truncate text-amber-500 font-bold text-sm uppercase tracking-wider">
            {tampinha.pais || 'Desconhecido'}
          </span>
        </span>

        {/* 📍 Cidade — reduzido */}
        {local && (
          <span className="mt-1.5 w-full truncate text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-400 leading-tight">
            {local}
          </span>
        )}
      </div>    </article>
  )
}