import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface LoginModalProps {
  open: boolean
  onClose: () => void
  onLoginSuccess?: () => void
}

export function LoginModal({ open, onClose, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mensagem, setMensagem] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  if (!open) return null

  async function handleEnviarLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setEnviando(true)
    setErro(null)
    setMensagem(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin
        }
      })

      if (error) throw error

      setMensagem('✅ Link de acesso enviado! Verifique seu e-mail e clique no link.')
      onLoginSuccess?.()
    } catch (err: any) {
      setErro(err.message || 'Erro ao enviar link. Tente novamente.')
    } finally {
      setEnviando(false)
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
            cursor: 'pointer'
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
          marginBottom: '8px',
          marginTop: 0
        }}>
          🔐 Acesso Administrador
        </h2>
        <p style={{
          fontSize: '13px',
          color: 'rgba(148, 163, 184, 0.80)',
          marginBottom: '20px'
        }}>
          Digite seu e-mail para receber um link de acesso.
        </p>

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
            disabled={enviando}
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
              cursor: enviando ? 'not-allowed' : 'pointer',
              transition: 'all 0.25s ease'
            }}
          >
            {enviando ? 'Enviando...' : '📧 Enviar link de acesso'}
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