interface TampinhaCardProps {
  // Usamos 'any' temporariamente para aceitar os novos campos injetados (bandeira_url e origem_formatada)
  tampinha: any 
}

export function TampinhaCard({ tampinha }: TampinhaCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-tr-border bg-tr-surface transition hover:border-neutral-600 hover:bg-tr-surface-elevated">
      
      {/* Container da Imagem */}
      <div className="aspect-square overflow-hidden flex items-center justify-center p-3">
        <img
          src={tampinha.foto_url}
          alt={tampinha.nome}
          className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/400x400/131a26/f59e0b?text=Foto+da+Tampinha'
          }}
        />
      </div>
      
      {/* Linha Divisória e Textos */}
      <div className="p-3.5 flex flex-col items-center text-center border-t border-tr-border">
        <h3 className="truncate text-sm font-semibold text-white w-full">{tampinha.nome}</h3>
        
        {/* Linha 1: País e Origem */}
        <div className="mt-2 flex items-center justify-center gap-2">
          {/* PAÍS com a Miniatura da Bandeira Ampliada e Padronizada */}
          <span className="inline-flex items-center gap-1.5 rounded-md bg-tr-bg px-2 py-1.5 text-[10px] font-medium uppercase tracking-wide text-tr-accent">
            {tampinha.bandeira_url && (
              <img 
                src={tampinha.bandeira_url}
                alt=""
                className="h-3.5 w-5 rounded-sm object-cover shadow-sm brightness-95"
                // 🛡️ Se o link da bandeira falhar por algum motivo, apenas esconde a imagem e não quebra o app
                onError={(e) => { e.currentTarget.style.display = 'none' }} 
              />
            )}
            {tampinha.pais || 'Desconhecido'}
          </span>
          
          {/* ORIGEM (Formatada na raiz como NAC. ou INT. e com cor discreta) */}
          <span className="rounded-md bg-tr-bg px-2 py-1.5 text-[10px] font-medium uppercase tracking-wide text-tr-muted">
            {tampinha.origem_formatada || tampinha.origem}
          </span>
        </div>

        {/* Linha 2: Cidade (Nova adição) */}
        {tampinha.cidade && (
          <span className="mt-1.5 text-[10px] font-medium uppercase tracking-wide text-tr-muted">
            {tampinha.cidade}
          </span>
        )}
      </div>
    </article>
  )
}