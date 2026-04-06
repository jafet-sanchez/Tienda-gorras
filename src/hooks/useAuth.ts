import { useEffect } from 'react'
import { supabase } from '../services/supabase'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    setLoading(true)

    // Verificar sesión activa al montar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(
        session?.user
          ? { id: session.user.id, email: session.user.email ?? '' }
          : null
      )
      setLoading(false)
    })

    // Escuchar cambios de sesión (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(
        session?.user
          ? { id: session.user.id, email: session.user.email ?? '' }
          : null
      )
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setLoading])
}
