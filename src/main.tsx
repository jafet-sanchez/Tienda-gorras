import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useAuth } from './hooks/useAuth'
import './index.css'

function AuthInitializer() {
  useAuth()
  return <RouterProvider router={router} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthInitializer />
  </StrictMode>
)
