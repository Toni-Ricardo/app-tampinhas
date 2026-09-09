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

function arquivoImagemValido(file: File): boolean {
  if (file.type.startsWith('image/')) return true
  return /\.(png|jpe?g|webp|gif)$/i.test(file.name)
}

function SecaoLabel({ numero, titulo }: { numero: string; titulo: string }) {
  return (
    <div className="cyber-section-label">
      <span className="num">{numero}</span>
      <span>{titulo}</span>
    </div>
  )
}

function BotaoOrigem({ 
  label, 
  ativo, 
  onClick 
}: { 
  label: Origem; 
  ativo: boolean; 
  onClick: () => void 
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cyber-origem-btn ${ativo ? 'active' : ''}`}
    >
      <span className="dot-indicator" />
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
      bandeira_url: bandeiraUrl(pais) ?? '',
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
    <div className="cyber-cadastro-overlay">
      <button 
        type="button" 
        aria-label="Fechar" 
        className="absolute inset-0 bg-black/40" 
        onClick={onClose} 
      />
      
      <div className="cyber-cadastro-container">
        {/* Cantos em L */}
        <div className="cyber-corner-tl"></div>
        <div className="cyber-corner-br"></div>

        {/* Cabeçalho */}
        <div className="cyber-cadastro-header">
          <div className="cyber-logo-frame h-10 w-10 flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-full w-full object-contain brightness-110 relative z-10"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          <div className="flex-1">
            <h2 className="cyber-cadastro-title">Nova Tampinha</h2>
            <p className="cyber-cadastro-subtitle">
              Cadastre à esquerda e veja a carta publicada à direita.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="cyber-cadastro-grid">
          {/* COLUNA ESQUERDA: FORMULÁRIO */}
          <div className="cyber-cadastro-form">
            {/* Seção 1: Foto */}
            <section className="cyber-section">
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
                className={`cyber-upload w-full ${arrastando ? 'dragging' : ''}`}
              >
                {preview ? (
                  <img src={preview} alt="Preview" />
                ) : (
                  <>
                    <span className="cyber-upload-text">
                      Arraste o PNG aqui ou clique para enviar
                    </span>
                    <span className="cyber-upload-hint">
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

            {/* Seção 2: Nome */}
            <section className="cyber-section">
              <SecaoLabel numero="2" titulo="Nome da Cerveja / Tampinha" />
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="cyber-input"
                placeholder="Ex.: Brahma"
              />
            </section>

            {/* Seção 3: País */}
            <section className="cyber-section">
              <SecaoLabel numero="3" titulo="País" />
              <input
                id="pais"
                type="text"
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                className="cyber-input"
                placeholder="Ex.: Brasil"
              />
            </section>

            {/* Seção 4: Cidade */}
            <section className="cyber-section">
              <SecaoLabel numero="4" titulo="Cidade" />
              <input
                id="cidade"
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="cyber-input"
                placeholder="Ex.: São Paulo"
              />
            </section>

            {/* Seção 5: Categoria */}
            <section className="cyber-section">
              <SecaoLabel numero="5" titulo="Categoria" />
              <div className="flex gap-3">
                <BotaoOrigem 
                  label="Nacional" 
                  ativo={origem === 'Nacional'} 
                  onClick={() => setOrigem('Nacional')} 
                />
                <BotaoOrigem 
                  label="Internacional" 
                  ativo={origem === 'Internacional'} 
                  onClick={() => setOrigem('Internacional')} 
                />
              </div>
            </section>

            {/* Erro */}
            {erro && (
              <div className="cyber-error mb-4">
                {erro}
              </div>
            )}
          </div>

          {/* COLUNA DIREITA: PREVIEW */}
          <div className="cyber-cadastro-preview">
            <span className="cyber-preview-label">Preview da Carta</span>
            <div style={{ width: '100%', maxWidth: '260px' }}>
              <TampinhaCard tampinha={tampinhaPreview} />
            </div>
            <p className="cyber-preview-hint">
              Atualiza em tempo real. O arquivo PNG só vai para o bucket ao gravar.
            </p>
          </div>

          {/* BARRA DE AÇÕES */}
          <div className="cyber-action-bar col-span-full">
            <button
              type="button"
              onClick={onClose}
              disabled={enviando}
              className="cyber-btn"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="cyber-btn primary"
            >
              {enviando ? 'Gravando...' : '+ Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}