import { useEffect, useMemo, useRef, useState, type DragEvent, type FormEvent } from 'react'
import { bandeiraUrl } from '../lib/bandeiras'
import { getSupabaseErrorMessage } from '../lib/supabaseError'
import type { NovaTampinha, Origem } from '../types/tampinha'
import { TampinhaCard } from './TampinhaCard'

interface NovaTampinhaModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (dados: NovaTampinha) => Promise<void>
}

const inputClass =
  'w-full h-11 rounded-lg border border-slate-800 bg-slate-900 px-4 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 uppercase tracking-wide focus:border-cyan-500'

function SecaoLabel({ numero, titulo }: { numero: string; titulo: string }) {
  return (
    <p className="mb-2 text-[11px] font-normal uppercase tracking-[0.15em] text-amber-500">
      {numero}. {titulo}
    </p>
  )
}

function BotaoOrigem({ label, ativo, onClick }: { label: Origem; ativo: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-1 items-center justify-center gap-2.5 rounded-lg border h-11 text-[13px] font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] ${
        ativo
          ? 'border-cyan-500 bg-slate-900 text-white'
          : 'border-slate-800 bg-slate-900 text-tr-muted hover:border-cyan-500/50 hover:text-slate-200'
      }`}
    >
      <span
        className={`h-3 w-3 rounded-full transition-all duration-300 ${
          ativo
            ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]'
            : 'border-2 border-tr-muted/50 bg-transparent group-hover:border-tr-muted'
        }`}
      />
      {label}
    </button>
  )
}

function arquivoImagemValido(file: File): boolean {
  if (file.type.startsWith('image/')) return true
  return /\.(png|jpe?g|webp|gif)$/i.test(file.name)
}

export function NovaTampinhaModal({ open, onClose, onSubmit }: NovaTampinhaModalProps) {
  const [nome, setNome] = useState('')
  const [pais, setPais] = useState('')
  const [cidade, setCidade] = useState('')
  const [origem, setOrigem] = useState<Origem | null>(null)
  const [foto, setFoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [arrastando, setArrastando] = useState(false)
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
      setArrastando(false)
      setErro(null)
      setEnviando(false)
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

  const tampinhaPreview = useMemo(
    () => ({
      id: 'PREVIEW',
      nome: nome.trim().toUpperCase(),
      pais: pais.trim().toUpperCase(),
      cidade: cidade.trim().toUpperCase(),
      origem: origem ?? 'Nacional',
      origem_formatada: origem === 'Internacional' ? 'INT.' : origem === 'Nacional' ? 'NAC.' : 'NAC./INT.',
      foto_url: preview ?? '',
      bandeira_url: bandeiraUrl(pais),
      created_at: new Date().toISOString(),
    }),
    [nome, pais, cidade, origem, preview],
  )

  if (!open) return null

  function aplicarArquivo(file: File | undefined | null) {
    if (!file) return
    if (!arquivoImagemValido(file)) {
      setErro('Selecione uma imagem PNG (ou JPG/WebP).')
      return
    }
    setErro(null)
    setFoto(file)
  }

  function handleDrop(e: DragEvent<HTMLButtonElement>) {
    e.preventDefault()
    setArrastando(false)
    aplicarArquivo(e.dataTransfer.files?.[0])
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    if (!foto) {
      setErro('Selecione uma foto da tampinha.')
      return
    }
    if (!nome.trim()) {
      setErro('O nome é obrigatório.')
      return
    }
    if (!pais.trim()) {
      setErro('O país é obrigatório.')
      return
    }
    if (!cidade.trim()) {
      setErro('A cidade é obrigatória.')
      return
    }
    if (!origem) {
      setErro('Selecione o tipo de coleção.')
      return
    }
    setEnviando(true)
    try {
      await onSubmit({
        nome: nome.trim().toUpperCase(),
        pais: pais.trim().toUpperCase(),
        cidade: cidade.trim().toUpperCase(),
        origem,
        foto,
      })
      onClose()
    } catch (err) {
      setErro(getSupabaseErrorMessage(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-md sm:p-6">
      <button type="button" aria-label="Fechar" className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative z-10 flex max-h-[min(92vh,920px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-cyan-400/40 bg-slate-950/80 shadow-2xl shadow-black/80 backdrop-blur-xl">
        <div className="flex items-center gap-4 border-b border-slate-800 px-5 py-4 sm:px-6">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-amber-500/40 bg-slate-900">
            <span className="select-none text-2xl font-normal leading-none text-amber-500 -mt-1">+</span>
          </div>
          <div>
            <h2 className="font-ubuntu text-base font-bold uppercase tracking-wider text-amber-500">Nova Tampinha</h2>
            <p className="text-xs text-tr-muted">Cadastre à esquerda e veja a carta publicada à direita.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-2 md:overflow-hidden">
          <div className="space-y-5 border-b border-slate-800 p-5 md:overflow-y-auto md:border-b-0 md:border-r sm:p-6">
            <section>
              <SecaoLabel numero="1" titulo="Foto da Tampinha (PNG)" />
              <button
                type="button"
                onClick={() => inputFotoRef.current?.click()}
                onDragEnter={(e) => {
                  e.preventDefault()
                  setArrastando(true)
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  setArrastando(true)
                }}
                onDragLeave={() => setArrastando(false)}
                onDrop={handleDrop}
                className={`group flex w-full min-h-36 flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-slate-900 px-4 py-6 transition-colors ${
                  arrastando
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-slate-800 text-tr-muted hover:border-cyan-500/60'
                }`}
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-28 w-full rounded-lg object-contain" />
                ) : (
                  <>
                    <span className="text-[11px] font-normal uppercase tracking-wider group-hover:text-cyan-400/80">
                      Arraste o PNG aqui ou clique para enviar
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-slate-500">
                      Upload para o Storage ao salvar
                    </span>
                  </>
                )}
              </button>
              <input
                ref={inputFotoRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
                className="hidden"
                onChange={(e) => aplicarArquivo(e.target.files?.[0] ?? null)}
              />
            </section>

            <section>
              <SecaoLabel numero="2" titulo="Nome da Cerveja / Tampinha" />
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={inputClass}
                placeholder="Ex.: Brahma"
              />
            </section>

            <section>
              <SecaoLabel numero="3" titulo="País" />
              <input
                id="pais"
                type="text"
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                className={inputClass}
                placeholder="Ex.: Brasil"
              />
            </section>

            <section>
              <SecaoLabel numero="4" titulo="Cidade" />
              <input
                id="cidade"
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className={inputClass}
                placeholder="Ex.: São Paulo"
              />
            </section>

            <section>
              <SecaoLabel numero="5" titulo="Categoria" />
              <div className="flex gap-3">
                <BotaoOrigem label="Nacional" ativo={origem === 'Nacional'} onClick={() => setOrigem('Nacional')} />
                <BotaoOrigem
                  label="Internacional"
                  ativo={origem === 'Internacional'}
                  onClick={() => setOrigem('Internacional')}
                />
              </div>
            </section>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 bg-slate-950/40 p-5 md:overflow-y-auto sm:p-8">
            <p className="text-[11px] font-normal uppercase tracking-[0.15em] text-amber-500">Preview da carta</p>
            <div className="w-full max-w-[260px]">
              <TampinhaCard tampinha={tampinhaPreview} />
            </div>
            <p className="max-w-xs text-center text-[11px] text-slate-500">
              Atualiza em tempo real. O arquivo PNG só vai para o bucket ao gravar.
            </p>
          </div>

          <div className="col-span-full space-y-3 border-t border-slate-800 px-5 py-4 sm:px-6">
            {erro && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400">{erro}</p>
            )}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={enviando}
                className="flex-1 h-11 inline-flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-xs font-normal uppercase text-tr-muted hover:border-cyan-500/50 hover:text-slate-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className="flex-1 h-11 inline-flex items-center justify-center rounded-lg border border-cyan-500/60 bg-slate-900 text-xs font-normal uppercase text-cyan-400 hover:border-cyan-400 hover:text-cyan-300 disabled:opacity-50"
              >
                {enviando ? 'Gravando...' : '+ Salvar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
