import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useProduct } from '../../hooks/useProducts'
import { useCart } from '../../hooks/useCart'
import { formatCOP } from '../../utils/formatPrice'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const { product, loading } = useProduct(id)
  const { addItem } = useCart()
  const [current, setCurrent] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!product) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setCurrent((c) => (c - 1 + product.images.length) % product.images.length)
      if (e.key === 'ArrowRight') setCurrent((c) => (c + 1) % product.images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [product])

  if (loading) {
    return (
      <section className="min-h-screen pt-24 pb-16 px-6 flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </section>
    )
  }

  if (!product) return <Navigate to="/not-found" replace />

  const prev = () => setCurrent((c) => (c - 1 + product.images.length) % product.images.length)
  const next = () => setCurrent((c) => (c + 1) % product.images.length)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <section className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <Link
          to="/"
          className="text-xs tracking-widest uppercase text-text-muted hover:text-neon inline-flex items-center gap-2 transition-colors mb-10"
        >
          ← Volver al catálogo
        </Link>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* ── Galería ── */}
          <div className="lg:w-2/3 flex flex-col gap-4">
            {/* Imagen principal */}
            <div className="relative bg-surface-light border border-border overflow-hidden aspect-square">
              <img
                key={current}
                src={product.images[current]}
                alt={`${product.name} — imagen ${current + 1}`}
                className="w-full h-full object-contain animate-fade-up"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-surface/80 hover:bg-neon hover:text-surface border border-border text-text-secondary transition-[background-color,color,border-color] duration-300"
                    aria-label="Imagen anterior"
                  >
                    <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-surface/80 hover:bg-neon hover:text-surface border border-border text-text-secondary transition-[background-color,color,border-color] duration-300"
                    aria-label="Imagen siguiente"
                  >
                    <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </>
              )}

              <span className="absolute bottom-3 right-4 text-[10px] tracking-widest uppercase text-text-muted tabular-nums">
                {current + 1} / {product.images.length}
              </span>
            </div>

            {/* Miniaturas */}
            {product.images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrent(i)}
                    className={`w-16 h-16 overflow-hidden border-2 transition-[border-color] duration-300 flex-shrink-0 ${
                      i === current ? 'border-neon' : 'border-border hover:border-text-muted'
                    }`}
                    aria-label={`Ver imagen ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} miniatura ${i + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="lg:w-1/3 flex flex-col gap-6 lg:pt-2">
            <div>
              <p className="text-xs font-semibold tracking-ultra uppercase text-neon mb-3">
                Krowm Gorras
              </p>
              <h1 className="font-display text-4xl md:text-5xl tracking-wider text-text-primary uppercase leading-none">
                {product.name}
              </h1>
              <div className="mt-4 w-10 h-0.5 bg-neon" />
            </div>

            <p className="font-display text-4xl text-neon tracking-wider">
              {product.price}
            </p>

            {product.descripcion && (
              <p className="text-sm text-text-secondary leading-relaxed">
                {product.descripcion}
              </p>
            )}

            <div className="flex flex-col gap-3 text-xs tracking-wide uppercase text-text-muted border-t border-border pt-5">
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="text-text-secondary">Nacional — desde {formatCOP(17000)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío gratis</span>
                <span className="text-neon font-semibold">+{formatCOP(300000)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className={`w-full inline-flex items-center justify-center gap-3 text-xs font-bold tracking-widest uppercase py-5 transition-[background-color,color,border-color,box-shadow] duration-300 ${
                added
                  ? 'bg-neon/20 text-neon border border-neon/50'
                  : 'bg-neon hover:bg-neon-hover text-surface neon-box-glow'
              }`}
            >
              {added ? (
                <>
                  <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Agregado al carrito
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Agregar al carrito
                </>
              )}
            </button>

            <p className="text-[10px] text-text-muted tracking-wide text-center">
              El pedido se coordina por WhatsApp al confirmar
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
