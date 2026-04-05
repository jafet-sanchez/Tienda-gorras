import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Product } from '../services/products'
import { useCart } from '../hooks/useCart'

interface Props {
  product: Product
  initialIndex?: number
  onClose: () => void
}

export default function ProductModal({ product, initialIndex = 0, onClose }: Props) {
  const { addItem } = useCart()
  const [current, setCurrent] = useState(initialIndex)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setCurrent((c) => (c - 1 + product.images.length) % product.images.length)
      if (e.key === 'ArrowRight') setCurrent((c) => (c + 1) % product.images.length)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, product.images.length])

  const prev = () => setCurrent((c) => (c - 1 + product.images.length) % product.images.length)
  const next = () => setCurrent((c) => (c + 1) % product.images.length)

  const handleAddToCart = () => {
    addItem(product)
    onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-surface/90 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain"
      onClick={onClose}
    >
      <div
        className="bg-surface-light border border-border max-w-5xl w-full max-h-[90vh] overflow-y-auto overscroll-contain flex flex-col md:flex-row animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image area */}
        <div className="relative md:w-2/3 bg-surface flex items-center justify-center min-h-72">
          <img
            key={current}
            src={product.images[current]}
            alt={`${product.name} — imagen ${current + 1}`}
            width={1200}
            height={1200}
            className="max-h-[60vh] w-full object-contain"
          />

          {/* Arrows */}
          {product.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-surface-light/80 hover:bg-neon hover:text-surface border border-border text-text-secondary transition-[background-color,color,border-color] duration-300"
                aria-label="Imagen anterior"
              >
                <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-surface-light/80 hover:bg-neon hover:text-surface border border-border text-text-secondary transition-[background-color,color,border-color] duration-300"
                aria-label="Imagen siguiente"
              >
                <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}

          {/* Counter */}
          <span className="absolute bottom-3 right-4 text-[10px] tracking-widest uppercase text-text-muted">
            {current + 1} / {product.images.length}
          </span>
        </div>

        {/* Info area */}
        <div className="md:w-1/3 p-6 flex flex-col justify-between gap-6 border-l border-border">
          <div>
            <button
              type="button"
              onClick={onClose}
              className="text-text-muted hover:text-text-primary text-xs tracking-widest uppercase mb-8 block transition-colors"
              aria-label="Cerrar"
            >
              ✕ Cerrar
            </button>
            <h2 className="font-display text-3xl tracking-wider text-text-primary mb-2 uppercase">{product.name}</h2>
            <p className="text-2xl font-display text-neon">{product.price}</p>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`w-14 h-14 overflow-hidden border-2 transition-[border-color] duration-300 ${
                    i === current ? 'border-neon' : 'border-border hover:border-text-muted'
                  }`}
                  aria-label={`Ver imagen ${i + 1}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} miniatura ${i + 1}`}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleAddToCart}
            className="block w-full text-center bg-neon hover:bg-neon-hover text-surface text-xs font-bold tracking-widest uppercase py-4 transition-[background-color] duration-300"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
