import { useEffect, useState } from 'react'
import { fetchAllProducts, updateStock, type Product } from '../../services/products'
import { fetchCategories, type Categoria } from '../../services/categories'

type StockLevel = 'all' | 'ok' | 'low' | 'out'

function getStockColor(stock: number): string {
  if (stock === 0) return 'bg-red-500'
  if (stock <= 5) return 'bg-orange-400'
  if (stock <= 10) return 'bg-yellow-400'
  return 'bg-green-500'
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<StockLevel>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState(0)
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([fetchAllProducts(), fetchCategories()])
      .then(([prods, cats]) => {
        // Ordenar por stock ascendente (más críticos primero)
        setProducts([...prods].sort((a, b) => a.stock - b.stock))
        setCategories(cats)
      })
      .finally(() => setLoading(false))
  }, [])

  const getCatName = (catId: string | null) =>
    categories.find((c) => c.id === catId)?.nombre ?? '—'

  const filtered = products.filter((p) => {
    if (filter === 'out') return p.stock === 0
    if (filter === 'low') return p.stock > 0 && p.stock <= 5
    if (filter === 'ok') return p.stock > 10
    return true
  })

  function startEdit(p: Product) {
    setEditingId(p.id)
    setEditValue(p.stock)
  }

  async function saveStock(id: string) {
    setSavingId(id)
    try {
      await updateStock(id, editValue)
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: editValue } : p))
      )
    } finally {
      setSavingId(null)
      setEditingId(null)
    }
  }

  function cancelEdit() {
    setEditingId(null)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Cargando...</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Inventario</h1>

      {/* Leyenda */}
      <div className="flex items-center gap-4 flex-wrap text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> &gt;10</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" /> 6-10</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" /> 1-5</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Agotado</span>
      </div>

      {/* Filtros rápidos */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'out', 'low', 'ok'] as StockLevel[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              filter === f ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            {{ all: 'Todos', out: 'Agotados', low: 'Stock bajo (1-5)', ok: 'En stock (+10)' }[f]}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Producto</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Categoría</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Estado</th>
              <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-900">{p.name}</td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{getCatName(p.categoria_id)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${getStockColor(p.stock)}`} />
                </td>
                <td className="px-5 py-3 text-right">
                  {editingId === p.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <input
                        type="number"
                        min={0}
                        value={editValue}
                        onChange={(e) => setEditValue(Number(e.target.value))}
                        autoFocus
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-gray-900"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveStock(p.id)
                          if (e.key === 'Escape') cancelEdit()
                        }}
                      />
                      <button
                        onClick={() => saveStock(p.id)}
                        disabled={savingId === p.id}
                        className="text-xs font-semibold text-green-700 hover:text-green-900 disabled:opacity-50"
                      >
                        ✓
                      </button>
                      <button onClick={cancelEdit} className="text-xs text-gray-400 hover:text-gray-700">✕</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(p)}
                      className="text-sm font-semibold text-gray-700 hover:text-gray-900 tabular-nums underline-offset-2 hover:underline transition-colors"
                      title="Clic para editar"
                    >
                      {p.stock} uds
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-gray-400 text-sm">
                  No hay productos en este filtro
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">Haz clic en el stock para editarlo directamente.</p>
        </div>
      </div>
    </div>
  )
}
