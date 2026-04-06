import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

interface Props {
  onClose: () => void
}

export default function LoginPopover({ onClose }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Focus email al abrir
  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  // Cerrar al hacer click fuera o presionar Escape
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    // mousedown para que se dispare antes del click del botón de apertura
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Correo o contraseña incorrectos.')
      setLoading(false)
    } else {
      onClose()
      navigate('/admin')
    }
  }

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-label="Iniciar sesión como administrador"
      className="absolute right-0 top-full mt-2 w-72 bg-surface-light border border-border shadow-2xl z-[100] p-5 flex flex-col gap-4"
    >
      <p className="text-[10px] font-bold tracking-ultra uppercase text-text-muted">
        Iniciar sesión
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-text-muted">
            Email
          </span>
          <input
            ref={emailRef}
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            className="bg-surface border border-border px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-neon transition-[border-color] duration-200"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-text-muted">
            Contraseña
          </span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-surface border border-border px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-neon transition-[border-color] duration-200"
          />
        </label>

        {error && (
          <p className="text-[10px] text-danger tracking-wide">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-neon hover:bg-neon-hover text-surface text-xs font-bold tracking-widest uppercase py-3 transition-[background-color] duration-200 disabled:opacity-50 mt-1"
        >
          {loading ? 'Verificando…' : 'Entrar'}
        </button>
      </form>

      <p className="text-[10px] text-text-muted tracking-wide text-center border-t border-border pt-3">
        Acceso para administradores
      </p>
    </div>
  )
}
