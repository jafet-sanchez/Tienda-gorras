import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchAllProducts, deleteProduct, type Product } from '../../services/products'
import { fetchCategories, type Categoria } from '../../services/categories'
import { formatCOP } from '../../utils/formatPrice'

export default function ProductsPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Categoria[]>([])
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([fetchAllProducts(), fetchCategories()])
      .then(([prods, cats]) => { setProducts(prods); setCategories(cats) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'all' || p.categoria_id === catFilter
    return matchSearch && matchCat
  })

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    setDeletingId(id)
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  const getCatName = (catId: string | null) =>
    categories.find((c) => c.id === catId)?.nombre ?? '—'

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Cargando...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-bold text-gray-900">Productos</h1>
        <Link
          to="/admin/productos/nuevo"
          className="flex items-center gap-1.5 bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <span className="text-lg leading-none">+</span> Agregar producto
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="border border-gray-300 rounded-lg text-sm text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="all">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Producto</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Categoría</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Precio</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Stock</th>
              <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {p.images[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex-shrink-0" />
                    )}
                    <span className="font-medium text-gray-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{getCatName(p.categoria_id)}</td>
                <td className="px-4 py-3 text-gray-700 font-medium tabular-nums">{formatCOP(p.numericPrice)}</td>
                <td className="px-4 py-3 text-gray-700 hidden sm:table-cell tabular-nums">{p.stock}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/admin/productos/${p.id}/editar`)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded"
                      title="Editar"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded disabled:opacity-40"
                      title="Eliminar"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-sm">
                  No se encontraron productos
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">{filtered.length} de {products.length} productos</p>
        </div>
      </div>
    </div>
  )
}

function EditIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
}
function TrashIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
}
