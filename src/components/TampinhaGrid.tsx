import type { Tampinha } from '../types/tampinha'
import { TampinhaCard } from './TampinhaCard'

interface TampinhaGridProps {
  tampinhas: Tampinha[]
  loading: boolean
}

export function TampinhaGrid({ tampinhas, loading }: TampinhaGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-xl border border-tr-border bg-tr-surface"
          >
            <div className="aspect-square bg-neutral-800" />
            <div className="space-y-2 p-3.5">
              <div className="h-3 w-3/4 rounded bg-neutral-800" />
              <div className="h-2.5 w-1/2 rounded bg-neutral-800" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (tampinhas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-tr-border py-16 text-center">
        <p className="text-sm text-tr-muted">Nenhuma tampinha encontrada</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {tampinhas.map((tampinha) => (
        <TampinhaCard key={tampinha.id} tampinha={tampinha} />
      ))}
    </div>
  )
}
