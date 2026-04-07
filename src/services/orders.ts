import { supabase } from './supabase'
import { parseOrderDetalle } from '../utils/validation'

export type OrderStatus = 'pendiente' | 'enviado' | 'completado'

export interface OrderItem {
  id: string
  nombre: string
  precio: number
  cantidad: number
  subtotal: number
}

export interface OrderCliente {
  name: string
  cedula: string
  phone: string
  address: string
  barrio: string
  city: string
  notes: string
}

export interface OrderDetalle {
  cliente: OrderCliente
  items: OrderItem[]
  subtotal: number
  envio: number
  total: number
}

export interface Order {
  id: string
  estado: OrderStatus
  telefono: string | null
  created_at: string
  detalle_json: OrderDetalle
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('pedidos')
    .select('id, estado, telefono, created_at, detalle_json')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((row) => ({
    id: row.id as string,
    estado: row.estado as OrderStatus,
    telefono: (row.telefono ?? null) as string | null,
    created_at: row.created_at as string,
    detalle_json: parseOrderDetalle(row.detalle_json),
  }))
}

export async function updateOrderStatus(id: string, estado: OrderStatus): Promise<void> {
  const { error } = await supabase
    .from('pedidos')
    .update({ estado })
    .eq('id', id)

  if (error) throw error
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase
    .from('pedidos')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function insertOrder(detalle: OrderDetalle, telefono: string): Promise<void> {
  const { error } = await supabase
    .from('pedidos')
    .insert({
      detalle_json: detalle,
      telefono,
      estado: 'pendiente',
    })

  if (error) throw error
}
