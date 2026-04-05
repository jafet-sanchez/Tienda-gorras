import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatCOP } from '../utils/formatPrice'
import { FREE_SHIPPING_THRESHOLD } from '../data/products'

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
    shippingCost,
    total,
    drawerOpen,
    setDrawerOpen,
  } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false) }
    if (drawerOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [drawerOpen, setDrawerOpen])

  if (!drawerOpen) return null

  const handleCheckout = () => {
    setDrawerOpen(false)
    navigate('/checkout')
    window.scrollTo(0, 0)
  }

  return createPortal(
    <div className="fixed inset-0 z-[90]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface/70 backdrop-blur-sm"
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-surface-light border-l border-border shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="font-display text-2xl tracking-wider text-text-primary">
            CARRITO ({itemCount})
          </h2>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="text-text-muted hover:text-text-primary text-xs tracking-widest uppercase transition-colors"
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5">
          {items.length === 0 ? (
            <div className="text-center mt-16">
              <p className="text-text-muted text-sm tracking-wide uppercase">Tu carrito está vacío</p>
              <div className="mt-4 w-8 h-0.5 bg-border mx-auto" />
            </div>
          ) : (
            <ul className="flex flex-col gap-5">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4 pb-5 border-b border-border last:border-0">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover bg-surface flex-shrink-0 border border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-text-primary leading-snug uppercase tracking-wide truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm font-display text-neon mt-1">{product.price}</p>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center border border-border text-text-muted hover:text-neon hover:border-neon transition-[color,border-color] duration-300 text-sm"
                        aria-label="Reducir cantidad"
                      >
                        −
                      </button>
                      <span className="text-sm text-text-primary font-semibold tabular-nums w-4 text-center">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center border border-border text-text-muted hover:text-neon hover:border-neon transition-[color,border-color] duration-300 text-sm"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="ml-auto text-[10px] tracking-widest uppercase text-text-muted hover:text-danger transition-colors"
                        aria-label={`Eliminar ${product.name}`}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5 flex flex-col gap-3">
            <div className="flex justify-between text-xs tracking-wide uppercase text-text-muted">
              <span>Subtotal</span>
              <span className="text-text-primary tabular-nums">{formatCOP(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs tracking-wide uppercase text-text-muted">
              <span>Envío</span>
              <span>
                {shippingCost === 0 ? (
                  <span className="text-neon font-semibold">Gratis</span>
                ) : (
                  <span className="text-text-primary tabular-nums">{formatCOP(shippingCost)}</span>
                )}
              </span>
            </div>
            {shippingCost > 0 && (
              <p className="text-[10px] text-text-muted tracking-wide">
                Envío gratis en compras superiores a {formatCOP(FREE_SHIPPING_THRESHOLD)}
              </p>
            )}
            <div className="flex justify-between text-sm font-semibold text-text-primary pt-3 border-t border-border uppercase tracking-wide">
              <span>Total</span>
              <span className="font-display text-xl text-neon tabular-nums">{formatCOP(total)}</span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full bg-neon hover:bg-neon-hover text-surface text-xs font-bold tracking-widest uppercase py-4 transition-[background-color,box-shadow] duration-300 mt-2 neon-box-glow"
            >
              Finalizar compra
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
