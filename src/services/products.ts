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
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('productos')
    .select('id, nombre, precio, descripcion, tipo, variantes(imagen_url, orden)')
    .eq('activo', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  if (!data) return []

  return (data as unknown as ProductoRow[]).map(toProduct)
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('productos')
    .select('id, nombre, precio, descripcion, tipo, variantes(imagen_url, orden)')
    .eq('id', id)
    .eq('activo', true)
    .single()

  if (error) return null
  if (!data) return null

  return toProduct(data as unknown as ProductoRow)
}
