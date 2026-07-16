import type { Origem } from '../types/tampinha'

interface ColecoesCardsProps {
  totalNacional: number
  totalInternacional: number
  selecionada: Origem | null
  onSelecionar: (origem: Origem | null) => void
}

export function ColecoesCards({
  totalNacional,
  totalInternacional,
  selecionada,
  onSelecionar,
}: ColecoesCardsProps) {
  function toggle(origem: Origem) {
    onSelecionar(selecionada === origem ? null : origem)
  }

  return (
    <div className="grid grid-cols-2 gap-4"> 
      
      {/* BOTÃO COLEÇÃO NACIONAL */}
      <button
        type="button"
        onClick={() => toggle('Nacional')}
        className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition duration-300 sm:p-8 ${
          selecionada === 'Nacional'
            ? 'border-tr-accent/60 bg-tr-surface-elevated ring-1 ring-tr-accent/30'
            : 'border-tr-border bg-tr-surface hover:border-neutral-600'
        }`}
      >
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-tr-accent/5 transition group-hover:bg-tr-accent/10" />
        
        {/* Mantém o alinhamento original à esquerda */}
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-tr-accent">
          Brasil
        </span>
        
        {/* AJUSTES: Adicionado 'text-center' nos elementos abaixo */}
        <h2 className="font-ubuntu mt-2 text-xl tracking-tight text-white sm:text-2xl text-center">
          Nacional
        </h2>
        
        <p className="mt-4 text-4xl font-light tabular-nums text-tr-gold sm:text-5xl text-center">
          {totalNacional}
        </p>
        <p className="mt-1 text-xs uppercase tracking-wider text-tr-muted text-center">
          tampinhas
        </p>
      </button>

      {/* BOTÃO COLEÇÃO INTERNACIONAL */}
      <button
        type="button"
        onClick={() => toggle('Internacional')}
        className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition duration-300 sm:p-8 ${
          selecionada === 'Internacional'
            ? 'border-tr-accent/60 bg-tr-surface-elevated ring-1 ring-tr-accent/30'
            : 'border-tr-border bg-tr-surface hover:border-neutral-600'
        }`}
      >
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-tr-accent/5 transition group-hover:bg-tr-accent/10" />
        
        {/* Mantém o alinhamento original à esquerda */}
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-tr-accent">
          Mundo
        </span>
        
        {/* AJUSTES: Adicionado 'text-center' nos elementos abaixo */}
        <h2 className="font-ubuntu mt-2 text-xl tracking-tight text-white sm:text-2xl text-center">
          Internacional
        </h2>
        
        <p className="mt-4 text-4xl font-light tabular-nums text-tr-gold sm:text-5xl text-center">
          {totalInternacional}
        </p>
        <p className="mt-1 text-xs uppercase tracking-wider text-tr-muted text-center">
          tampinhas
        </p>
      </button>
    </div>
  )
}