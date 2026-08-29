interface TampinhaCardProps {
  tampinha: any 
}

export function TampinhaCard({ tampinha }: TampinhaCardProps) {
  return (
    <article className="neon-border-cyan float-effect overflow-hidden p-0">      
      <div className="aspect-square overflow-hidden flex items-center justify-center p-2 sm:p-3 relative rounded-t-xl">
        {/* Fundo para a área da imagem — respeita o arredondamento */}
        <div className="absolute inset-0 bg-[#0b0f19]"></div>
        <img
          src={tampinha.foto_url}
          alt={tampinha.nome}
          className="relative h-full w-full object-contain transition-transform duration-500 hover:scale-105 z-10"
          loading="lazy"
        />
      </div>
      
      {/* Área de textos */}
      <div className="p-3 flex flex-col items-center text-center border-t border-tr-border bg-tr-surface rounded-b-xl">
        <h3 className="truncate text-sm font-semibold text-white w-full">
          {tampinha.nome}
        </h3>
        
        <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-[#0b0f19] px-2 py-1.5 text-[11px] font-medium uppercase tracking-wide text-tr-accent">
            {tampinha.bandeira_url && (
              <img 
                src={tampinha.bandeira_url}
                alt=""
                className="h-3.5 w-5 rounded-sm object-cover shadow-sm brightness-95 flex-shrink-0"
                onError={(e) => { e.currentTarget.style.display = 'none' }} 
              />
            )}
            <span className="truncate">{tampinha.pais || 'Desconhecido'}</span>
          </span>
          
          <span className="rounded-md bg-[#0b0f19] px-2 py-1.5 text-[11px] font-medium uppercase tracking-wide text-tr-muted">
            {tampinha.origem_formatada || tampinha.origem}
          </span>
        </div>
        
        {tampinha.cidade && (
          <span className="mt-1.5 text-[10px] font-medium uppercase tracking-wide text-tr-muted truncate w-full">
            {tampinha.cidade}
          </span>
        )}
      </div>
    </article>
  )
}