

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
{/* Ícone de Lupa - Atualizado para text-amber-500 */}
<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
  <svg
    className="h-4 w-4 text-amber-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
</div>
      
      {/* Input de Busca - Atualizado para h-11 e texto condizente */}
      <input
        type="text"
        placeholder="Pesquisar..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 rounded-xl border border-tr-border bg-tr-surface/50 pl-10 pr-10 text-sm text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:bg-tr-surface-elevated focus:outline-none transition-all duration-200"
      />

      {/* Botão de Limpar */}
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-amber-500 transition-colors duration-150"
          title="Limpar pesquisa"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}