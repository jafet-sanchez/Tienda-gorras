import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute() {
  const user    = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)

  // Mientras Supabase verifica la sesión, no redirigir aún
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-xs tracking-widest uppercase text-text-muted animate-pulse">
          Verificando sesión…
        </span>
      </div>
    )
  }

  // Sin sesión → redirigir al inicio (el login es el popover del Navbar)
  if (!user) return <Navigate to="/" replace />

  // Con sesión → renderizar la ruta protegida
  return <Outlet />
}
