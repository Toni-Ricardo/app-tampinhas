import { useEffect, useRef, useState, type FormEvent } from 'react'
import { getSupabaseErrorMessage } from '../lib/supabaseError'
import type { NovaTampinha, Origem } from '../types/tampinha'

interface NovaTampinhaModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (dados: NovaTampinha) => Promise<void>
}

/* 🛠️ Estilização dos Inputs */
const inputClass =
  'w-full h-10 rounded-lg border border-dashed border-tr-border bg-[#1a1c23] px-4 text-sm text-slate-100 outline-none transition-all placeholder:text-tr-muted/50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 uppercase tracking-wide hover:border-amber-500/50 hover:bg-[#1a1c23]'

function SecaoLabel({ numero, titulo }: { numero: string; titulo: string }) {
  return (
    <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-tr-muted">
      {numero}. {titulo}
    </p>
  )
}

function BotaoOrigem({ label, ativo, onClick }: { label: Origem; ativo: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-1 items-center justify-center gap-2.5 rounded-lg border border-dashed border-tr-border bg-[#1a1c23] h-10 text-[13px] font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] hover:border-amber-500/50 ${
        ativo ? 'text-white border-amber-500' : 'text-tr-muted hover:text-slate-200'
      }`}
    >
      <span
        className={`h-3 w-3 rounded-full transition-all duration-300 ${
          ativo
            ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]'
            : 'border-2 border-tr-muted/50 bg-transparent group-hover:border-tr-muted'
        }`}
      />
      {label}
    </button>
  )
}

export function NovaTampinhaModal({ open, onClose, onSubmit }: NovaTampinhaModalProps) {
  const [nome, setNome] = useState('')
  const [pais, setPais] = useState('')
  const [cidade, setCidade] = useState('')
  const [origem, setOrigem] = useState<Origem | null>(null)
  const [foto, setFoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const inputFotoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) {
      setNome('')
      setPais('')
      setCidade('')
      setOrigem(null)
      setFoto(null)
      setPreview(null)
      setErro(null)
      setEnviando(false)
      return
    }
  }, [open])

  useEffect(() => {
    if (!foto) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(foto)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [foto])

  if (!open) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    if (!foto) { setErro('Selecione uma foto da tampinha.'); return }
    if (!nome.trim()) { setErro('O nome é obrigatório.'); return }
    if (!pais.trim()) { setErro('O país é obrigatório.'); return }
    if (!cidade.trim()) { setErro('A cidade é obrigatória.'); return }
    if (!origem) { setErro('Selecione o tipo de coleção.'); return }

    setEnviando(true)
    try {
      await onSubmit({ 
        nome: nome.trim().toUpperCase(), 
        pais: pais.trim().toUpperCase(), 
        cidade: cidade.trim().toUpperCase(),
        origem, 
        foto 
      })
      onClose()
    } catch (err) {
      setErro(getSupabaseErrorMessage(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <button type="button" aria-label="Fechar" className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-tr-border/50 bg-tr-surface/50 p-6 shadow-2xl shadow-black/80 backdrop-blur-xl">
        <div className="flex items-center gap-6 mb-10">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-amber-500/40 bg-tr-input shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <span className="text-amber-500 text-2xl font-normal leading-none select-none -mt-1">+</span>
          </div>
          <div>
            <h2 className="font-ubuntu text-base font-bold uppercase tracking-wider text-white">Nova Tampinha</h2>
            <p className="text-xs text-tr-muted">Adicione uma nova tampinha a coleção.</p>
          </div>
        </div>		
        <form onSubmit={handleSubmit} className="space-y-5">
          <section>
            <SecaoLabel numero="1" titulo="Foto da Tampinha" />
            <button
              type="button"
              onClick={() => inputFotoRef.current?.click()}
              className="group flex w-full h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-tr-border bg-[#1a1c23] transition-colors hover:border-amber-500/50 hover:bg-[#1a1c23]"
            >
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-28 w-full rounded-lg object-contain p-2" />
              ) : (
                <span className="text-[11px] font-bold uppercase tracking-wider text-tr-muted group-hover:text-amber-500/70">Selecionar Arquivo</span>
              )}
            </button>
            <input ref={inputFotoRef} type="file" accept="image/*" className="hidden" onChange={(e) => setFoto(e.target.files?.[0] ?? null)} />
          </section>
          <section>
            <SecaoLabel numero="2" titulo="Nome da Cerveja" />
            <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} className={inputClass} />
          </section>
          <section>
            <SecaoLabel numero="3" titulo="País" />
            <input id="pais" type="text" value={pais} onChange={(e) => setPais(e.target.value)} className={inputClass} />
          </section>
          <section>
            <SecaoLabel numero="4" titulo="Cidade" />
            <input id="cidade" type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} className={inputClass} />
          </section>
          <section>
            <SecaoLabel numero="5" titulo="Tipo de Coleção" />
            <div className="flex gap-3">
              <BotaoOrigem label="Nacional" ativo={origem === 'Nacional'} onClick={() => setOrigem('Nacional')} />
              <BotaoOrigem label="Internacional" ativo={origem === 'Internacional'} onClick={() => setOrigem('Internacional')} />
            </div>
          </section>
          {erro && <p className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400">{erro}</p>}
          <div className="flex items-center gap-3 pt-4 mt-8">
            <button type="button" onClick={onClose} className="flex-1 h-10 inline-flex items-center justify-center rounded-lg border border-dashed border-tr-border bg-tr-surface-elevated text-xs font-bold uppercase text-tr-muted hover:border-tr-muted hover:text-slate-200">Cancelar</button>
            <button type="submit" disabled={enviando} className="flex-1 h-10 inline-flex items-center justify-center rounded-lg border border-dashed border-tr-border bg-tr-surface-elevated text-xs font-bold uppercase text-tr-muted hover:border-tr-muted hover:text-slate-200">{enviando ? 'Gravando...' : '+ Salvar'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}