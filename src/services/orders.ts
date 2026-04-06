import { supabase } from './supabase'

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
  return (data ?? []) as Order[]
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
