import { useState, type FormEvent } from 'react'
import { supabase } from '../../services/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Correo o contraseña incorrectos.')
      setLoading(false)
    }
    // Si hay éxito, onAuthStateChange en useAuth actualiza el store
    // y PublicOnlyRoute redirige a /admin automáticamente
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center font-sans px-4">
      <div className="w-full max-w-sm">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <p className="font-display text-4xl text-text-primary tracking-widest uppercase">
            Krowm
          </p>
          <p className="text-xs text-text-muted tracking-[0.3em] uppercase mt-1">
            Panel de administración
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface-light border border-border rounded-xl p-8">
          <h1 className="font-display text-2xl text-text-primary tracking-widest uppercase mb-6">
            Iniciar sesión
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] font-semibold text-text-muted uppercase tracking-[0.2em] mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@krowm.com"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-neon focus-visible:ring-1 focus-visible:ring-neon transition-[border-color]"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-[10px] font-semibold text-text-muted uppercase tracking-[0.2em] mb-1.5"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-neon focus-visible:ring-1 focus-visible:ring-neon transition-[border-color]"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-danger bg-danger/10 border border-danger/30 rounded-lg px-3 py-2.5 tracking-wide">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neon text-surface py-3 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-neon-hover transition-[background-color] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Verificando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
