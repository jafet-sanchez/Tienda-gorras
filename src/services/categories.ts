import { supabase } from './supabase'

export interface Categoria {
  id: string
  nombre: string
  slug: string
  created_at: string
  productos_count?: number
}

export async function fetchCategories(): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from('categorias')
    .select('id, nombre, slug, created_at')
    .order('nombre')

  if (error) throw error
  if (!data) return []

  // Contar productos por categoría
  const counts = await Promise.all(
    data.map(async (cat) => {
      const { count } = await supabase
        .from('productos')
        .select('*', { count: 'exact', head: true })
        .eq('categoria_id', cat.id)
      return { id: cat.id, count: count ?? 0 }
    })
  )

  return data.map((cat) => ({
    ...cat,
    productos_count: counts.find((c) => c.id === cat.id)?.count ?? 0,
  }))
}

export async function createCategory(nombre: string, slug: string): Promise<Categoria> {
  const { data, error } = await supabase
    .from('categorias')
    .insert({ nombre, slug })
    .select()
    .single()

  if (error) throw error
  return data as Categoria
}

export async function updateCategory(id: string, nombre: string, slug: string): Promise<void> {
  const { error } = await supabase
    .from('categorias')
    .update({ nombre, slug })
    .eq('id', id)

  if (error) throw error
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('categorias')
    .delete()
    .eq('id', id)

  if (error) throw error
}
