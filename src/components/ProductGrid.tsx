import { useState, useEffect } from 'react'
import { useProducts } from '../hooks/useProducts'
import { fetchCategories, type Categoria } from '../services/categories'
import ProductCard from './ProductCard'

export default function ProductGrid() {
  const { products, loading, error } = useProducts()
  const [categories, setCategories] = useState<Categoria[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories().then(setCategories)
  }, [])

  const filtered = activeCategory
    ? products.filter((p) => p.categoria_id === activeCategory)
    : products

  return (
    <section id="catalogo" className="max-w-7xl mx-auto px-6 py-24">
      {/* Section header */}
      <div className="mb-16">
        <p className="text-xs font-semibold tracking-ultra uppercase text-neon mb-3">
          Colección
        </p>
        <h2 className="font-display text-5xl md:text-7xl tracking-wider text-text-primary">
          NUESTRAS GORRAS
        </h2>
        <div className="mt-4 w-16 h-0.5 bg-neon" />
      </div>

      {/* Category filter */}
      {categories.length > 0 && !loading && !error && (
        <div className="flex gap-2 flex-wrap mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className={`text-[10px] font-bold tracking-widest uppercase px-4 py-2 border transition-[color,background-color,border-color] duration-200 ${
              activeCategory === null
                ? 'bg-neon text-surface border-neon'
                : 'bg-transparent text-text-muted border-border hover:text-text-primary hover:border-text-muted'
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-[10px] font-bold tracking-widest uppercase px-4 py-2 border transition-[color,background-color,border-color] duration-200 ${
                activeCategory === cat.id
                  ? 'bg-neon text-surface border-neon'
                  : 'bg-transparent text-text-muted border-border hover:text-text-primary hover:border-text-muted'
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <p className="text-center text-danger text-sm tracking-wide uppercase py-20">
          Error al cargar productos
        </p>
      )}

      {/* Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filtered.length === 0 && products.length > 0 && (
            <p className="text-center text-text-muted text-sm tracking-wide uppercase py-16">
              No hay productos en esta categoría
            </p>
          )}
        </>
      )}
    </section>
  )
}
