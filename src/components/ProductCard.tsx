import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product } from '../services/products'
import { useCart } from '../hooks/useCart'
import ProductModal from './ProductModal'

interface Props {
  product: Product
  priority?: boolean
}

const cardEase = [0.22, 1, 0.36, 1] as [number, number, number, number]

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: cardEase },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.2 },
  },
}

export default function ProductCard({ product, priority = false }: Props) {
  const [hovered, setHovered] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const mainImage = product.images[0]
  const hoverImage = product.images[1] ?? product.images[0]

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <>
      <motion.article
        className="group flex flex-col bg-surface-light border border-border hover:border-neon/30 transition-[border-color] duration-500"
        variants={cardVariants}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        layout
      >
        {/* Image container */}
        <button
          type="button"
          className="relative overflow-hidden aspect-square w-full cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-neon"
          onClick={() => setModalOpen(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label={`Ver galería de ${product.name}`}
        >
          {/* Main image */}
          <img
            src={mainImage}
            alt={product.name}
            width={600}
            height={600}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            className={`absolute inset-0 w-full h-full object-cover transition-[opacity,transform] duration-700 ${
              hovered && product.images.length > 1 ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
          />

          {/* Hover image */}
          {product.images.length > 1 && (
            <img
              src={hoverImage}
              alt={`${product.name} — vista alternativa`}
              width={600}
              height={600}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-[opacity,transform] duration-700 ${
                hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
            />
          )}

          {/* Hover overlay */}
          <div
            className={`absolute inset-0 bg-surface/60 flex items-center justify-center transition-opacity duration-300 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="text-[10px] font-bold tracking-ultra uppercase text-neon border border-neon px-4 py-2">
              Ver galería
            </span>
          </div>
        </button>

        {/* Product info */}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-text-primary leading-snug uppercase tracking-wide">
              {product.name}
            </h3>
            <p className="text-sm font-display text-neon whitespace-nowrap text-lg">
              {product.price}
            </p>
          </div>

          <motion.button
            type="button"
            onClick={handleAdd}
            className={`inline-flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase py-3 px-4 transition-[background-color,color,border-color] duration-300 w-full ${
              added
                ? 'bg-neon/20 text-neon border border-neon/50'
                : 'bg-neon text-surface hover:bg-neon-hover'
            }`}
            whileTap={{ scale: 0.97 }}
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  className="inline-flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.18 }}
                >
                  <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Agregado
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  className="inline-flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.18 }}
                >
                  <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Agregar al carrito
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Schema.org Product */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.name,
              image: product.images[0],
              offers: {
                '@type': 'Offer',
                priceCurrency: 'COP',
                price: product.price.replace(/[^0-9]/g, '') || '0',
                availability: 'https://schema.org/InStock',
              },
            }),
          }}
        />
      </motion.article>

      <AnimatePresence>
        {modalOpen && (
          <ProductModal
            product={product}
            initialIndex={0}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
