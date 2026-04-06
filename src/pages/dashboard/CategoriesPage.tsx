import { useEffect, useState, type FormEvent } from 'react'
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Categoria,
} from '../../services/categories'

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .trim()
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [nombre, setNombre] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    setLoading(true)
    fetchCategories().then(setCategories).finally(() => setLoading(false))
  }

  function startCreate() {
    setEditingId(null)
    setNombre('')
    setError(null)
    setShowForm(true)
  }

  function startEdit(cat: Categoria) {
    setEditingId(cat.id)
    setNombre(cat.nombre)
    setError(null)
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
    setNombre('')
    setError(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) return
    setError(null)
    setSaving(true)

    try {
      const slug = slugify(nombre)
      if (editingId) {
        await updateCategory(editingId, nombre.trim(), slug)
      } else {
        await createCategory(nombre.trim(), slug)
      }
      cancelForm()
      await loadCategories()
    } catch {
      setError('Error al guardar. El nombre o slug puede estar duplicado.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(cat: Categoria) {
    if ((cat.productos_count ?? 0) > 0) {
      alert('No puedes eliminar una categoría que tiene productos asignados.')
      return
    }
    if (!confirm(`¿Eliminar la categoría "${cat.nombre}"?`)) return
    setDeletingId(cat.id)
    try {
      await deleteCategory(cat.id)
      setCategories((prev) => prev.filter((c) => c.id !== cat.id))
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Cargando...</div>
  }

  return (
    <div className="space-y-4 max-w-xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-bold text-gray-900">Categorías</h1>
        {!showForm && (
          <button
            onClick={startCreate}
            className="flex items-center gap-1.5 bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <span className="text-lg leading-none">+</span> Nueva categoría
          </button>
        )}
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">
            {editingId ? 'Editar categoría' : 'Nueva categoría'}
          </h2>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Nombre
            </label>
            <input
              type="text"
              required
              autoFocus
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="ej. Zapatos, Gorras, Accesorios..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            {nombre && (
              <p className="text-xs text-gray-400 mt-1">ID: <span className="font-mono">{slugify(nombre)}</span></p>
            )}
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
          <div className="flex items-center gap-3 justify-end">
            <button type="button" onClick={cancelForm} className="text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear categoría'}
            </button>
          </div>
        </form>
      )}

      {/* Lista */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{cat.nombre}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {cat.productos_count} {cat.productos_count === 1 ? 'producto' : 'productos'} · ID: <span className="font-mono">{cat.slug}</span>
              </p>
            </div>
            <button
              onClick={() => startEdit(cat)}
              className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded"
              title="Editar"
            >
              <EditIcon />
            </button>
            <button
              onClick={() => handleDelete(cat)}
              disabled={deletingId === cat.id || (cat.productos_count ?? 0) > 0}
              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded disabled:opacity-30 disabled:cursor-not-allowed"
              title={(cat.productos_count ?? 0) > 0 ? 'Tiene productos asignados' : 'Eliminar'}
            >
              <TrashIcon />
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">Sin categorías aún</p>
        )}
      </div>
      <p className="text-xs text-gray-400">{categories.length} {categories.length === 1 ? 'categoría' : 'categorías'}</p>
    </div>
  )
}

function EditIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
}
function TrashIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
}
