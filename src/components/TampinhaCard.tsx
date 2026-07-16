interface TampinhaCardProps {
  tampinha: any 
}

export function TampinhaCard({ tampinha }: TampinhaCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-tr-border bg-tr-surface transition-all duration-300 hover:border-amber-500/40 hover:bg-tr-surface-elevated hover:shadow-md hover:shadow-amber-500/5">
      
      {/* Container da Imagem - Maior e com menos padding no celular */}
      <div className="aspect-square overflow-hidden flex items-center justify-center p-2 sm:p-3">
        <img
          src={tampinha.foto_url}
          alt={tampinha.nome}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/400x400/131a26/f59e0b?text=Foto+da+Tampinha'
          }}
        />
      </div>
      
      {/* Área de textos - Espaçamentos e tamanhos ajustados */}
      <div className="p-3 flex flex-col items-center text-center border-t border-tr-border">
        <h3 className="truncate text-sm font-semibold text-white w-full">
          {tampinha.nome}
        </h3>
        
        {/* Linha País + Origem */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-tr-bg px-2 py-1.5 text-[11px] font-medium uppercase tracking-wide text-tr-accent">
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
          
          <span className="rounded-md bg-tr-bg px-2 py-1.5 text-[11px] font-medium uppercase tracking-wide text-tr-muted">
            {tampinha.origem_formatada || tampinha.origem}
          </span>
        </div>

        {/* Cidade */}
        {tampinha.cidade && (
          <span className="mt-1.5 text-[10px] font-medium uppercase tracking-wide text-tr-muted truncate w-full">
            {tampinha.cidade}
          </span>
        )}
      </div>
    </article>
  )
}