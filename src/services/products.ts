import { supabase } from './supabase'
import { formatCOP } from '../utils/formatPrice'

export interface Product {
  id: string
  name: string
  price: string
  numericPrice: number
  images: string[]
  descripcion: string | null
  tipo: string
  stock: number
  categoria_id: string | null
}

interface VarianteRow {
  imagen_url: string
  orden: number
}

interface ProductoRow {
  id: string
  nombre: string
  precio: number
  descripcion: string | null
  tipo: string
  stock: number
  categoria_id: string | null
  variantes: VarianteRow[]
}

function toProduct(row: ProductoRow): Product {
  return {
    id: row.id,
    name: row.nombre,
    price: formatCOP(row.precio),
    numericPrice: row.precio,
    images: [...row.variantes].sort((a, b) => a.orden - b.orden).map((v) => v.imagen_url),
    descripcion: row.descripcion,
    tipo: row.tipo,
    stock: row.stock,
    categoria_id: row.categoria_id,
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('productos')
    .select('id, nombre, precio, descripcion, tipo, stock, categoria_id, variantes(imagen_url, orden)')
    .eq('activo', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  if (!data) return []

  return (data as unknown as ProductoRow[]).map(toProduct)
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('productos')
    .select('id, nombre, precio, descripcion, tipo, stock, categoria_id, variantes(imagen_url, orden)')
    .eq('id', id)
    .eq('activo', true)
    .single()

  if (error) return null
  if (!data) return null

  return toProduct(data as unknown as ProductoRow)
}

/* ── Funciones admin ── */

export interface ProductInput {
  nombre: string
  precio: number
  descripcion: string | null
  tipo: string
  stock: number
  categoria_id: string | null
  activo: boolean
}

export async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('productos')
    .select('id, nombre, precio, descripcion, tipo, stock, categoria_id, variantes(imagen_url, orden)')
    .order('created_at', { ascending: false })

  if (error) throw error
  if (!data) return []

  return (data as unknown as ProductoRow[]).map(toProduct)
}

export async function createProduct(input: ProductInput): Promise<string> {
  const { data, error } = await supabase
    .from('productos')
    .insert(input)
    .select('id')
    .single()

  if (error) throw error
  return (data as { id: string }).id
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<void> {
  const { error } = await supabase
    .from('productos')
    .update(input)
    .eq('id', id)

  if (error) throw error
}

export async function deleteProduct(id: string): Promise<void> {
  // 1. Obtener variantes para limpiar los archivos de Storage
  const { data: variantes } = await supabase
    .from('variantes')
    .select('imagen_url')
    .eq('producto_id', id)

  // 2. Bulk remove de Storage en una sola llamada
  if (variantes && variantes.length > 0) {
    const storagePrefix = '/storage/v1/object/public/productos/'
    const paths = variantes
      .map((v) => {
        const idx = (v.imagen_url as string).indexOf(storagePrefix)
        return idx !== -1
          ? decodeURIComponent((v.imagen_url as string).slice(idx + storagePrefix.length))
          : null
      })
      .filter((p): p is string => p !== null)

    if (paths.length > 0) {
      await supabase.storage.from('productos').remove(paths)
    }
  }

  // 3. Eliminar variantes (FK constraint)
  await supabase.from('variantes').delete().eq('producto_id', id)

  // 4. Eliminar producto
  const { error } = await supabase
    .from('productos')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function updateStock(id: string, stock: number): Promise<void> {
  const { error } = await supabase
    .from('productos')
    .update({ stock })
    .eq('id', id)

  if (error) throw error
}

/* ── Variantes (imágenes de producto) ── */

export interface Variante {
  id: string
  producto_id: string
  imagen_url: string
  orden: number
}

export async function fetchVariantes(productoId: string): Promise<Variante[]> {
  const { data, error } = await supabase
    .from('variantes')
    .select('id, producto_id, imagen_url, orden')
    .eq('producto_id', productoId)
    .order('orden')

  if (error) throw error
  return (data ?? []) as Variante[]
}

export async function uploadProductImage(productoId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${productoId}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('productos')
    .upload(path, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('productos').getPublicUrl(path)
  return data.publicUrl
}

export async function createVariante(
  productoId: string,
  imagenUrl: string,
  orden: number
): Promise<Variante> {
  const { data, error } = await supabase
    .from('variantes')
    .insert({ producto_id: productoId, imagen_url: imagenUrl, orden })
    .select()
    .single()

  if (error) throw error
  return data as Variante
}

export async function deleteVariante(variante: Variante): Promise<void> {
  // Extraer path del storage desde la URL pública
  const storagePrefix = '/storage/v1/object/public/productos/'
  const idx = variante.imagen_url.indexOf(storagePrefix)
  if (idx !== -1) {
    const storagePath = decodeURIComponent(
      variante.imagen_url.slice(idx + storagePrefix.length)
    )
    await supabase.storage.from('productos').remove([storagePath])
  }

  const { error } = await supabase.from('variantes').delete().eq('id', variante.id)
  if (error) throw error
}
