import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useAuthStore } from '../store/authStore'
import LoginPopover from './LoginPopover'

export default function Navbar() {
  const { itemCount, setDrawerOpen } = useCart()
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Catálogo', href: '#catalogo' },
    { label: 'Contacto', href: '#contacto' },
  ]

  const handleNavClick = (href: string) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  const handleUserClick = () => {
    if (user) {
      navigate('/admin')
    } else {
      setLoginOpen((o) => !o)
    }
  }

  const UserIcon = () => (
    <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )

  const CartIcon = () => (
    <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  )

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled ? 'bg-surface/95 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#inicio"
          onClick={(e) => { e.preventDefault(); handleNavClick('#inicio') }}
          className="font-display text-2xl tracking-ultra text-text-primary hover:text-neon transition-colors duration-300"
        >
          KROWM
        </a>

        {/* Desktop links + acciones */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                  className="text-xs font-semibold tracking-widest uppercase text-text-secondary hover:text-neon transition-colors duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Carrito */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="relative p-2 text-text-secondary hover:text-neon transition-colors duration-300"
            aria-label={`Carrito (${itemCount} productos)`}
          >
            <CartIcon />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key="badge"
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-neon text-surface text-[9px] font-bold rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Usuario */}
          <button
            type="button"
            onClick={handleUserClick}
            className={`relative p-2 transition-colors duration-300 ${user ? 'text-neon' : 'text-text-secondary hover:text-neon'}`}
            aria-label={user ? 'Ir al panel de administración' : 'Iniciar sesión como administrador'}
            aria-expanded={!user ? loginOpen : undefined}
          >
            <UserIcon />
            {user && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-neon rounded-full" />
            )}
          </button>
        </div>

        {/* Mobile: carrito + usuario + hamburger */}
        <div className="md:hidden flex items-center gap-1">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="relative p-2 text-text-secondary hover:text-neon transition-colors duration-300"
            aria-label={`Carrito (${itemCount} productos)`}
          >
            <CartIcon />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key="badge-mobile"
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-neon text-surface text-[9px] font-bold rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            type="button"
            onClick={handleUserClick}
            className={`relative p-2 transition-colors duration-300 ${user ? 'text-neon' : 'text-text-secondary hover:text-neon'}`}
            aria-label={user ? 'Ir al panel de administración' : 'Iniciar sesión como administrador'}
            aria-expanded={!user ? loginOpen : undefined}
          >
            <UserIcon />
            {user && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-neon rounded-full" />
            )}
          </button>

          <button
            type="button"
            className="flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <motion.span
              className="block w-5 h-0.5 bg-text-primary origin-center"
              animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
            />
            <motion.span
              className="block w-5 h-0.5 bg-text-primary"
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-5 h-0.5 bg-text-primary origin-center"
              animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
            />
          </button>
        </div>
      </nav>

      {/* Login popover */}
      <AnimatePresence>
        {loginOpen && !user && (
          <motion.div
            className="absolute right-4 md:right-8 top-16"
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'top right' }}
          >
            <LoginPopover onClose={() => setLoginOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-surface border-t border-border px-6 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="flex flex-col gap-5 py-6">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.05, duration: 0.25 }}
                >
                  <a
                    href={link.href}
                    className="text-sm font-semibold tracking-widest uppercase text-text-secondary hover:text-neon transition-colors"
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
