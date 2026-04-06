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
  loading: true, // true hasta que getSession() resuelva — evita flash redirect en rutas protegidas
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}))
