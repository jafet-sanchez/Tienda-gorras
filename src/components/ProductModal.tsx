import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product } from '../services/products'
import { useCart } from '../hooks/useCart'

interface Props {
  product: Product
  initialIndex?: number
  onClose: () => void
}

export default function ProductModal({ product, initialIndex = 0, onClose }: Props) {
  const { addItem, items } = useCart()
  const [current, setCurrent] = useState(initialIndex)

  const inCartQty = items.find((i) => i.product.id === product.id)?.quantity ?? 0
  const isOutOfStock = product.stock === 0
  const isAtLimit = product.stock > 0 && inCartQty >= product.stock
  const disabled = isOutOfStock || isAtLimit

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
    if (disabled) return
    addItem(product)
    onClose()
  }

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[100] bg-surface/90 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-surface-light border border-border max-w-5xl w-full max-h-[90vh] overflow-y-auto overscroll-contain flex flex-col md:flex-row"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image area */}
        <div className="relative md:w-2/3 bg-surface flex items-center justify-center min-h-72">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={current}
              src={product.images[current]}
              alt={`${product.name} — imagen ${current + 1}`}
              width={1200}
              height={1200}
              decoding="async"
              className={`max-h-[60vh] w-full object-contain ${isOutOfStock ? 'opacity-50' : ''}`}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: isOutOfStock ? 0.5 : 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />
          </AnimatePresence>

          {/* Agotado overlay en imagen */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xs font-bold tracking-ultra uppercase text-text-muted border border-border px-5 py-2 bg-surface/80">
                Agotado
              </span>
            </div>
          )}

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

            {/* Stock indicator */}
            <p className={`mt-3 text-[10px] font-semibold tracking-widest uppercase ${
              isOutOfStock ? 'text-danger' : product.stock <= 5 ? 'text-orange-400' : 'text-text-muted'
            }`}>
              {isOutOfStock
                ? 'Sin stock disponible'
                : product.stock <= 5
                  ? `Solo quedan ${product.stock} unidades`
                  : `${product.stock} disponibles`}
            </p>
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
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <motion.button
            type="button"
            onClick={handleAddToCart}
            disabled={disabled}
            className={`block w-full text-center text-xs font-bold tracking-widest uppercase py-4 transition-[background-color,color,border-color] duration-300 ${
              isOutOfStock
                ? 'bg-surface border border-border text-text-muted cursor-not-allowed'
                : isAtLimit
                  ? 'bg-neon/10 text-neon/60 border border-neon/20 cursor-not-allowed'
                  : 'bg-neon hover:bg-neon-hover text-surface'
            }`}
            whileTap={disabled ? undefined : { scale: 0.97 }}
          >
            {isOutOfStock ? 'Sin stock' : isAtLimit ? 'Máx. en carrito' : 'Agregar al carrito'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}
