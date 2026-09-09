// SearchBar.tsx - ajuste para se integrar ao container cyber-search
interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Buscar por nome, país, cidade..."
      aria-label="Buscar tampinha"
    />
  )
}