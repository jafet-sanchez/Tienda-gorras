import { useEffect, useState } from 'react'
import {
  fetchOrders,
  updateOrderStatus,
  deleteOrder,
  type Order,
  type OrderStatus,
} from '../../services/orders'
import { formatCOP } from '../../utils/formatPrice'

type FilterStatus = 'all' | OrderStatus

const STATUS_BADGE: Record<string, string> = {
  pendiente:  'bg-yellow-100 text-yellow-800',
  enviado:    'bg-blue-100 text-blue-800',
  completado: 'bg-green-100 text-green-800',
}

const STATUS_LABEL: Record<string, string> = {
  pendiente: 'Pendiente',
  enviado: 'Enviado',
  completado: 'Completado',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders().then(setOrders).finally(() => setLoading(false))
  }, [])

  const countByStatus = (status: OrderStatus) => orders.filter((o) => o.estado === status).length

  const filtered = orders.filter((o) => filter === 'all' || o.estado === filter)

  async function handleStatusChange(id: string, estado: OrderStatus) {
    setUpdatingId(id)
    try {
      await updateOrderStatus(id, estado)
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, estado } : o)))
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este pedido? Esta acción no se puede deshacer.')) return
    setDeletingId(id)
    try {
      await deleteOrder(id)
      setOrders((prev) => prev.filter((o) => o.id !== id))
      if (expandedId === id) setExpandedId(null)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Cargando...</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Pedidos</h1>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        <FilterBtn label={`Todos (${orders.length})`} active={filter === 'all'} onClick={() => setFilter('all')} />
        <FilterBtn label={`Pendiente (${countByStatus('pendiente')})`} active={filter === 'pendiente'} onClick={() => setFilter('pendiente')} />
        <FilterBtn label={`Enviado (${countByStatus('enviado')})`} active={filter === 'enviado'} onClick={() => setFilter('enviado')} />
        <FilterBtn label={`Completado (${countByStatus('completado')})`} active={filter === 'completado'} onClick={() => setFilter('completado')} />
      </div>

      {/* Lista de pedidos */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-10 text-center text-gray-400 text-sm">
            No hay pedidos
          </div>
        )}
        {filtered.map((order) => {
          const isExpanded = expandedId === order.id
          const cliente = order.detalle_json?.cliente
          const items = order.detalle_json?.items ?? []
          const fecha = new Date(order.created_at).toLocaleDateString('es-CO', {
            day: 'numeric', month: 'short', year: 'numeric'
          })
          const shortId = order.id.slice(0, 8).toUpperCase()
          const total = order.detalle_json?.total ?? 0

          return (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Header del pedido */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex-1 flex items-center gap-3 min-w-0 flex-wrap">
                  <span className="text-sm font-bold text-gray-900 font-mono">#{shortId}</span>
                  <span className="text-sm font-medium text-gray-700 truncate">{cliente?.name ?? order.telefono ?? '—'}</span>
                  <span className="text-xs text-gray-400">{fecha}</span>
                </div>
                <span className="text-sm font-semibold text-gray-700 tabular-nums">{formatCOP(total)}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[order.estado] ?? 'bg-gray-100 text-gray-600'}`}>
                  {STATUS_LABEL[order.estado] ?? order.estado}
                </span>
                <ChevronIcon className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {/* Detalle expandido */}
              {isExpanded && (
                <div className="border-t border-gray-100 px-5 py-5 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Datos del cliente */}
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Datos del cliente</p>
                      <dl className="space-y-1 text-sm">
                        {cliente?.name     && <Row label="Nombre"    value={cliente.name} />}
                        {cliente?.cedula   && <Row label="Cédula"    value={cliente.cedula} />}
                        {cliente?.phone    && <Row label="Teléfono"  value={cliente.phone} />}
                        {cliente?.address  && <Row label="Dirección" value={cliente.address} />}
                        {cliente?.barrio   && <Row label="Barrio"    value={cliente.barrio} />}
                        {cliente?.city     && <Row label="Ciudad"    value={cliente.city} />}
                        {cliente?.notes    && <Row label="Notas"     value={cliente.notes} />}
                      </dl>
                    </div>

                    {/* Productos */}
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Productos</p>
                      <ul className="space-y-2">
                        {items.map((item, i) => (
                          <li key={i} className="flex justify-between text-sm">
                            <div>
                              <p className="font-medium text-gray-800">{item.nombre}</p>
                              <p className="text-xs text-gray-400">Cant: {item.cantidad}</p>
                            </div>
                            <span className="font-semibold text-gray-700 tabular-nums">{formatCOP(item.subtotal)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-sm">
                        <div className="flex justify-between text-gray-500">
                          <span>Subtotal</span>
                          <span className="tabular-nums">{formatCOP(order.detalle_json?.subtotal ?? 0)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>Envío</span>
                          <span>{order.detalle_json?.envio === 0 ? 'Gratis' : formatCOP(order.detalle_json?.envio ?? 0)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-900">
                          <span>Total</span>
                          <span className="tabular-nums">{formatCOP(total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cambiar estado:</label>
                      <select
                        value={order.estado}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="border border-gray-300 rounded-lg text-sm text-gray-700 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="enviado">Enviado</option>
                        <option value="completado">Completado</option>
                      </select>
                    </div>
                    <button
                      onClick={() => handleDelete(order.id)}
                      disabled={deletingId === order.id}
                      className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
        active ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
      }`}
    >
      {label}
    </button>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-gray-400 w-24 flex-shrink-0">{label}:</dt>
      <dd className="text-gray-800 font-medium">{value}</dd>
    </div>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
}

function TrashIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
}
