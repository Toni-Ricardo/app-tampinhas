import { useState } from 'react'
import { supabase } from '../lib/supabase'

// ✅ Componente base de ícone SVG
const Icone = ({ caminho, tamanho = 16, cor = '#ff5500', espessura = 1.5 }: {
  caminho: string
  tamanho?: number
  cor?: string
  espessura?: number
}) => (
  <svg
    width={tamanho}
    height={tamanho}
    viewBox="0 0 24 24"
    fill="none"
    stroke={cor}
    strokeWidth={espessura}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ filter: `drop-shadow(0 0 3px ${cor})`, display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path d={caminho} />
  </svg>
)

// ✅ Ícones prontos para uso
const Icones = {
  Cadeado: () => <Icone caminho="M12 17v4M8 21h8M5 9h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V11a2 2 0 012-2zm7-4a3 3 0 00-3 3v3h6V8a3 3 0 00-3-3z" />,
  Email: () => <Icone caminho="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />,
  Verificado: () => <Icone caminho="M20 6L9 17l-5-5" cor="#22c55e" tamanho={18} />
}

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [processando, setProcessando] = useState(false)
  const [mensagem, setMensagem] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  if (!open) return null

  function resetarMensagens() {
    setMensagem(null)
    setErro(null)
  }

  async function handleLoginComSenha(e: React.FormEvent) {
    e.preventDefault()
    resetarMensagens()

    if (!email.trim()) {
      setErro('Por favor, preencha o campo SEU E-MAIL.')
      return
    }
    if (!email.includes('@')) {
      setErro('Por favor, insira um e-mail válido.')
      return
    }
    if (!senha.trim()) {
      setErro('Por favor, preencha o campo SUA SENHA.')
      return
    }

    setProcessando(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha
      })
      if (error) throw error
      setMensagem('Login realizado com sucesso!')
      setTimeout(() => {
        onClose()
        setSenha('')
      }, 800)
    } catch (err: any) {
      setErro(err.message || 'E-mail ou senha incorretos.')
    } finally {
      setProcessando(false)
    }
  }

  // Estilos CSS para o placeholder
  const estiloGlobal = `
    input::placeholder {
      color: rgba(148, 163, 184, 0.6) !important;
      opacity: 1 !important;
    }
  `

  return (
    <>
      <style>{estiloGlobal}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          background: 'rgba(5, 8, 14, 0.92)',
          backdropFilter: 'blur(8px)'
        }}
        onClick={onClose}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
            background: 'rgba(15, 21, 32, 0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 107, 26, 0.4)',
            borderRadius: '16px',
            padding: '24px 20px',
            color: '#FFFFFF'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 107, 26, 0.4)',
              background: 'rgba(255, 107, 26, 0.12)',
              color: 'var(--cyber-accent)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            ×
          </button>

          {/* 🔐 Acesso Restrito */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px'
          }}>
            🔐
            <span style={{
              fontFamily: 'var(--font-chakra)',
              fontSize: '15px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.99)'
            }}>
              Acesso Restrito
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-chakra)',
            fontSize: '20px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--cyber-accent)',
            marginBottom: '4px',
            marginTop: '8px'
          }}>
            Acesso Administrador
          </h2>

          <p style={{
            fontSize: '14px',
            color: 'rgba(148, 163, 184, 0.80)',
            marginBottom: '16px'
          }}>
            Faça login para cadastrar novas tampinhas.
          </p>

          {/* ✅ FORMULÁRIO COM SENHA */}
          <form onSubmit={handleLoginComSenha} noValidate>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '16px',
              fontWeight: 500,
              color: 'var(--cyber-accent-light)'
            }}>
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 14px',
                border: '1px solid rgba(255, 107, 26, 0.5)',
                background: 'rgba(0, 0, 0, 0.5)',
                color: '#FFFFFF',
                borderRadius: '10px',
                fontSize: '16px',
                marginBottom: '10px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '16px',
              fontWeight: 500,
              color: 'var(--cyber-accent-light)'
            }}>
              Senha
            </label>
            <input
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 14px',
                border: '1px solid rgba(255, 107, 26, 0.5)',
                background: 'rgba(0, 0, 0, 0.5)',
                color: '#FFFFFF',
                borderRadius: '10px',
                fontSize: '16px',
                marginBottom: '12px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={processando}
              style={{
                width: '100%',
                height: '44px',
                border: '1px solid var(--cyber-accent)',
                background: 'rgba(255, 107, 26, 0.15)',
                color: 'var(--cyber-accent-light)',
                fontFamily: 'var(--font-chakra)',
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                borderRadius: '10px',
                cursor: processando ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {processando ? (
                'Entrando...'
              ) : (
                <>
                  <Icones.Verificado />
                  Entrar
                </>
              )}
            </button>
          </form>

          {mensagem && (
            <div style={{
              marginTop: '14px',
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: 'rgba(134, 239, 172, 0.95)',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Icones.Verificado />
              {mensagem}
            </div>
          )}

          {erro && (
            <div style={{
              marginTop: '14px',
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: 'rgba(252, 165, 165, 0.95)',
              fontSize: '13px'
            }}>
              {erro}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
