import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function PublicOnlyRoute() {
  const user    = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-xs tracking-widest uppercase text-text-muted animate-pulse">
          Verificando sesión…
        </span>
      </div>
    )
  }

  // Ya hay sesión → redirigir al dashboard
  if (user) return <Navigate to="/admin" replace />

  // Sin sesión → mostrar la página pública (login)
  return <Outlet />
}
