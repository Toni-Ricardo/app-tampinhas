import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

type Modo = 'senha' | 'link'

export function LoginModal({ open, onClose }: LoginModalProps) {
  const [modo, setModo] = useState<Modo>('senha')
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
    if (!email.trim() || !senha.trim()) return

    setProcessando(true)
    resetarMensagens()

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha
      })

      if (error) throw error

      setMensagem('✅ Login realizado com sucesso!')
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

  async function handleEnviarLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setProcessando(true)
    resetarMensagens()

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin
        }
      })

      if (error) throw error

      setMensagem('✅ Link de acesso enviado! Verifique seu e-mail.')
    } catch (err: any) {
      setErro(err.message || 'Erro ao enviar link. Tente novamente.')
    } finally {
      setProcessando(false)
    }
  }

  return (
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

        <h2 style={{
          fontFamily: 'var(--font-chakra)',
          fontSize: '20px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--cyber-accent)',
          marginBottom: '4px',
          marginTop: 0
        }}>
          🔐 Acesso Administrador
        </h2>
        <p style={{
          fontSize: '13px',
          color: 'rgba(148, 163, 184, 0.80)',
          marginBottom: '16px'
        }}>
          Faça login para cadastrar novas tampinhas.
        </p>

        {/* ✅ ABAS: SENHA / LINK */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '16px',
          padding: '4px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '10px'
        }}>
          <button
            type="button"
            onClick={() => { setModo('senha'); resetarMensagens() }}
            style={{
              flex: 1,
              height: '36px',
              border: 'none',
              background: modo === 'senha' ? 'rgba(255, 107, 26, 0.2)' : 'transparent',
              color: modo === 'senha' ? 'var(--cyber-accent-light)' : 'rgba(148, 163, 184, 0.7)',
              fontFamily: 'var(--font-chakra)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              borderRadius: '7px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            🔑 Com senha
          </button>
          <button
            type="button"
            onClick={() => { setModo('link'); resetarMensagens() }}
            style={{
              flex: 1,
              height: '36px',
              border: 'none',
              background: modo === 'link' ? 'rgba(255, 107, 26, 0.2)' : 'transparent',
              color: modo === 'link' ? 'var(--cyber-accent-light)' : 'rgba(148, 163, 184, 0.7)',
              fontFamily: 'var(--font-chakra)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              borderRadius: '7px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            📧 Link mágico
          </button>
        </div>

        {/* ✅ FORMULÁRIO COM SENHA */}
        {modo === 'senha' && (
          <form onSubmit={handleLoginComSenha}>
            <input
              type="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 14px',
                border: '1px solid rgba(255, 107, 26, 0.3)',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#FFFFFF',
                borderRadius: '10px',
                fontSize: '14px',
                marginBottom: '10px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
            <input
              type="password"
              required
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 14px',
                border: '1px solid rgba(255, 107, 26, 0.3)',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#FFFFFF',
                borderRadius: '10px',
                fontSize: '14px',
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
                transition: 'all 0.25s ease'
              }}
            >
              {processando ? 'Entrando...' : '✅ Entrar'}
            </button>
          </form>
        )}

        {/* ✅ FORMULÁRIO LINK MÁGICO */}
        {modo === 'link' && (
          <form onSubmit={handleEnviarLink}>
            <input
              type="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 14px',
                border: '1px solid rgba(255, 107, 26, 0.3)',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#FFFFFF',
                borderRadius: '10px',
                fontSize: '14px',
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
                transition: 'all 0.25s ease'
              }}
            >
              {processando ? 'Enviando...' : '📧 Enviar link'}
            </button>
          </form>
        )}

        {mensagem && (
          <div style={{
            marginTop: '14px',
            padding: '10px 12px',
            borderRadius: '8px',
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            color: 'rgba(134, 239, 172, 0.95)',
            fontSize: '13px'
          }}>
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
  )
}