import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from './CartDrawer'

export default function Layout() {
  return (
    <div className="grain">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-neon focus:text-surface focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:tracking-widest focus:uppercase"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <CartDrawer />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
