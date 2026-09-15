// src/components/SearchBar.tsx
import type { ChangeEvent } from 'react'

interface SearchBarProps {
  value: string
  onChange: (valor: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Pesquisar..."
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
    />
  )
}