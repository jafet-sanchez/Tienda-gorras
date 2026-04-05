import { useProducts } from '../hooks/useProducts'
import ProductCard from './ProductCard'

export default function ProductGrid() {
  const { products, loading, error } = useProducts()

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
