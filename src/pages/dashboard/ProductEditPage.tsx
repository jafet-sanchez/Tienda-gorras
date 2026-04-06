import { useEffect, useState, useRef, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  fetchProductById,
  createProduct,
  updateProduct,
  fetchVariantes,
  uploadProductImage,
  createVariante,
  deleteVariante,
  type ProductInput,
  type Variante,
} from '../../services/products'
import { fetchCategories, type Categoria } from '../../services/categories'

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

const PRODUCT_TYPES = [
  { value: 'ajustable', label: 'Ajustable' },
  { value: 'cerrada', label: 'Cerrada' },
]

interface PendingImage {
  file: File
  preview: string
}

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [categories, setCategories] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({})

  const [form, setForm] = useState<ProductInput>({
    nombre: '',
    precio: 0,
    descripcion: '',
    tipo: 'ajustable',
    stock: 0,
    categoria_id: null,
    activo: true,
  })

  // Imágenes existentes (solo en edición)
  const [existingImages, setExistingImages] = useState<Variante[]>([])
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set())

  // Imágenes nuevas por subir
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([])

  useEffect(() => {
    const init = async () => {
      const cats = await fetchCategories()
      setCategories(cats)

      if (isEdit && id) {
        const [product, variantes] = await Promise.all([
          fetchProductById(id),
          fetchVariantes(id),
        ])

        if (!product) {
          navigate('/admin/productos')
          return
        }

        setForm({
          nombre: product.name,
          precio: product.numericPrice,
          descripcion: product.descripcion ?? '',
          tipo: product.tipo,
          stock: product.stock,
          categoria_id: product.categoria_id,
          activo: true,
        })
        setExistingImages(variantes)
      } else if (cats.length > 0) {
        setForm((prev) => ({ ...prev, categoria_id: cats[0].id }))
      }

      setLoading(false)
    }

    init()
  }, [id, isEdit, navigate])

  // Limpiar previews al desmontar
  useEffect(() => {
    return () => {
      pendingImages.forEach((img) => URL.revokeObjectURL(img.preview))
    }
  }, [pendingImages])

  function set<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (fieldErrors[key as string]) {
      setFieldErrors((prev) => { const next = { ...prev }; delete next[key as string]; return next })
    }
  }

  function validate(): boolean {
    const errors: Record<string, string> = {}
    if (!form.nombre.trim()) errors.nombre = 'El nombre es obligatorio.'
    else if (form.nombre.trim().length < 2) errors.nombre = 'Mínimo 2 caracteres.'
    if (form.precio <= 0) errors.precio = 'El precio debe ser mayor a 0.'
    if (!Number.isInteger(form.precio)) errors.precio = 'El precio debe ser un número entero.'
    if (form.stock < 0) errors.stock = 'El stock no puede ser negativo.'
    if (!Number.isInteger(form.stock)) errors.stock = 'El stock debe ser un número entero.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return

    const invalid = Array.from(files).filter(
      (f) => !ALLOWED_MIME.has(f.type) || f.size > MAX_SIZE_BYTES
    )

    if (invalid.length > 0) {
      setError('Archivos no válidos: solo JPG, PNG o WebP hasta 5 MB.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    const newPending: PendingImage[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setPendingImages((prev) => [...prev, ...newPending])

    // Resetear input para permitir seleccionar el mismo archivo
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeExisting(varianteId: string) {
    setRemovedIds((prev) => new Set(prev).add(varianteId))
  }

  function removePending(index: number) {
    setPendingImages((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  // Imágenes visibles = existentes no eliminadas + nuevas
  const visibleExisting = existingImages.filter((v) => !removedIds.has(v.id))
  const totalImages = visibleExisting.length + pendingImages.length

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!validate()) return
    setSaving(true)

    try {
      let productId: string

      if (isEdit && id) {
        await updateProduct(id, form)
        productId = id
      } else {
        productId = await createProduct(form)
      }

      // Eliminar variantes marcadas
      const toRemove = existingImages.filter((v) => removedIds.has(v.id))
      await Promise.all(toRemove.map((v) => deleteVariante(v)))

      // Subir imágenes nuevas y crear variantes
      const startOrden = visibleExisting.length
      for (let i = 0; i < pendingImages.length; i++) {
        const url = await uploadProductImage(productId, pendingImages[i].file)
        await createVariante(productId, url, startOrden + i)
      }

      navigate('/admin/productos')
    } catch {
      setError('Ocurrió un error al guardar. Intenta de nuevo.')
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Cargando...</div>
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-2">
        <Link to="/admin/productos" className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
          Volver a productos
        </Link>
      </div>

      <h1 className="text-xl font-bold text-gray-900">
        {isEdit ? 'Editar producto' : 'Agregar producto'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        {/* Nombre */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Nombre del producto
          </label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => set('nombre', e.target.value)}
            className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 ${fieldErrors.nombre ? 'border-red-400' : 'border-gray-300'}`}
          />
          {fieldErrors.nombre && <p className="mt-1 text-xs text-red-500">{fieldErrors.nombre}</p>}
        </div>

        {/* Categoría + Tipo */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Categoría
            </label>
            <select
              value={form.categoria_id ?? ''}
              onChange={(e) => set('categoria_id', e.target.value || null)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Tipo
            </label>
            <select
              value={form.tipo}
              onChange={(e) => set('tipo', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              {PRODUCT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Precio + Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Precio (COP)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={form.precio || ''}
              onChange={(e) => set('precio', e.target.value === '' ? 0 : Math.round(Number(e.target.value)))}
              className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${fieldErrors.precio ? 'border-red-400' : 'border-gray-300'}`}
            />
            {fieldErrors.precio && <p className="mt-1 text-xs text-red-500">{fieldErrors.precio}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Stock
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={form.stock === 0 ? '' : form.stock}
              onChange={(e) => set('stock', e.target.value === '' ? 0 : Math.round(Number(e.target.value)))}
              className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${fieldErrors.stock ? 'border-red-400' : 'border-gray-300'}`}
            />
            {fieldErrors.stock && <p className="mt-1 text-xs text-red-500">{fieldErrors.stock}</p>}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Descripción
          </label>
          <textarea
            rows={4}
            value={form.descripcion ?? ''}
            onChange={(e) => set('descripcion', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          />
        </div>

        {/* Imágenes */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Imágenes ({totalImages})
          </label>

          {totalImages > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {/* Existentes */}
              {visibleExisting.map((v, i) => (
                <div key={v.id} className="relative group aspect-square">
                  <img
                    src={v.imagen_url}
                    alt={`Imagen ${i + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-gray-900 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      Principal
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeExisting(v.id)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminar imagen"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Nuevas */}
              {pendingImages.map((img, i) => (
                <div key={img.preview} className="relative group aspect-square">
                  <img
                    src={img.preview}
                    alt={`Nueva ${i + 1}`}
                    className="w-full h-full object-cover rounded-lg border-2 border-dashed border-blue-300"
                  />
                  <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                    Nueva
                  </span>
                  <button
                    type="button"
                    onClick={() => removePending(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Quitar"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg py-4 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M12 4v16m8-8H4" />
            </svg>
            Agregar imágenes
          </button>
        </div>

        {/* Activo */}
        <div className="flex items-center gap-2">
          <input
            id="activo"
            type="checkbox"
            checked={form.activo}
            onChange={(e) => set('activo', e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          />
          <label htmlFor="activo" className="text-sm text-gray-700">
            Producto activo (visible en la tienda)
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <Link
            to="/admin/productos"
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
