import { useNavigate, useLocation } from 'react-router-dom'
import { WHATSAPP_NUMBER } from '../data/products'

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hola, quiero más información sobre sus gorras.'
  )}`

  const handleNavClick = (href: string) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer id="contacto" className="bg-surface border-t border-border">
      {/* Top marquee */}
      <div className="border-b border-border py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex gap-8 text-[10px] tracking-ultra uppercase text-text-muted font-semibold">
              <span>Krowm Gorras</span>
              <span className="text-neon">//</span>
              <span>Streetwear Colombia</span>
              <span className="text-neon">//</span>
              <span>Premium Headwear</span>
              <span className="text-neon">//</span>
              <span>Envíos Nacionales</span>
              <span className="text-neon">//</span>
              <span>Krowm Gorras</span>
              <span className="text-neon">//</span>
              <span>Streetwear Colombia</span>
              <span className="text-neon">//</span>
              <span>Premium Headwear</span>
              <span className="text-neon">//</span>
              <span>Envíos Nacionales</span>
              <span className="text-neon">//</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Brand */}
          <div className="max-w-sm">
            <p className="font-display text-4xl tracking-wider text-text-primary mb-4">KROWM</p>
            <p className="text-sm text-text-muted leading-relaxed">
              Gorras premium con diseños únicos para quienes marcan tendencia en Colombia. Cada
              pieza es seleccionada cuidadosamente para ofrecerte calidad y estilo.
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs tracking-ultra uppercase text-text-muted font-semibold mb-5">Contacto</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-sm text-text-secondary hover:text-neon transition-colors duration-300"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.122 1.528 5.855L.057 23.886a.5.5 0 00.6.6l6.098-1.458A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.66-.52-5.17-1.42l-.37-.22-3.83.916.932-3.758-.24-.39A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              +57 301 8100 766
            </a>
          </div>

          {/* Nav */}
          <div>
            <p className="text-xs tracking-ultra uppercase text-text-muted font-semibold mb-5">Navegación</p>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Inicio', href: '#inicio' },
                { label: 'Catálogo', href: '#catalogo' },
                { label: 'Contacto', href: '#contacto' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                    className="text-sm text-text-muted hover:text-neon transition-colors duration-300 tracking-wide uppercase"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-[10px] tracking-ultra uppercase">
            &copy; {new Date().getFullYear()} Krowm Gorras. Colombia.
          </p>
          <p className="text-text-muted text-[10px] tracking-widest uppercase">
            Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  )
}
