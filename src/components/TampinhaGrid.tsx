import type { Tampinha } from '../types/tampinha'
import { TampinhaCard } from './TampinhaCard'

type TampinhaFormatada = Tampinha & {
  bandeira_url: string
  origem_formatada: string
}

interface TampinhaGridProps {
  tampinhas: TampinhaFormatada[]
  onSelectTampinha: (tampinha: TampinhaFormatada) => void
}

export function TampinhaGrid({ tampinhas, onSelectTampinha }: TampinhaGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {tampinhas.map((tampinha) => (
        <TampinhaCard
          key={tampinha.id}
          tampinha={tampinha}
          onClick={() => onSelectTampinha(tampinha)}
        />
      ))}
    </div>
  )
}