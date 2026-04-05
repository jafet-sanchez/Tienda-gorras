import { create } from 'zustand'

interface User {
  id: string
  email: string
}

interface AuthStore {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false, // true mientras se verifica la sesión de Supabase
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}))
