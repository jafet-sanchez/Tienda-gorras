import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllProducts } from '../../services/products'
import { fetchOrders, type Order } from '../../services/orders'
import { formatCOP } from '../../utils/formatPrice'

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

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className="text-gray-400">{icon}</div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export default function DashboardHome() {
  const [products, setProducts] = useState<Awaited<ReturnType<typeof fetchAllProducts>>>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchAllProducts(), fetchOrders()])
      .then(([prods, ords]) => { setProducts(prods); setOrders(ords) })
      .finally(() => setLoading(false))
  }, [])

  const totalIngresos = orders
    .filter((o) => o.estado === 'completado')
    .reduce((sum, o) => sum + (o.detalle_json?.total ?? 0), 0)

  const stockBajo = products.filter((p) => p.stock > 0 && p.stock <= 5).length
  const agotados = products.filter((p) => p.stock === 0)

  const recentOrders = orders.slice(0, 5)

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Resumen</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Productos" value={products.length} icon={<BoxIcon />} />
        <StatCard label="Stock bajo" value={stockBajo} icon={<AlertIcon />} />
        <StatCard label="Pedidos" value={orders.length} icon={<ClipboardIcon />} />
        <StatCard label="Ingresos" value={formatCOP(totalIngresos)} icon={<CashIcon />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pedidos recientes */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pedidos recientes</p>
            <Link to="/admin/pedidos" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
              Ver todos
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400 px-5 py-8 text-center">Sin pedidos aún</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentOrders.map((order) => {
                const cliente = order.detalle_json?.cliente
                const nombre = cliente?.name ?? order.telefono ?? '—'
                const fecha = new Date(order.created_at).toLocaleDateString('es-CO', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })
                const total = order.detalle_json?.total ?? 0
                return (
                  <li key={order.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{nombre}</p>
                      <p className="text-xs text-gray-400">{fecha}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 tabular-nums">{formatCOP(total)}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[order.estado] ?? 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABEL[order.estado] ?? order.estado}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Alertas de stock */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alertas de stock</p>
            <Link to="/admin/inventario" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
              Ver inventario
            </Link>
          </div>
          <div className="px-5 py-4">
            {agotados.length === 0 && stockBajo === 0 ? (
              <p className="text-sm text-gray-400">Todo en orden</p>
            ) : (
              <ul className="space-y-2">
                {agotados.map((p) => (
                  <li key={p.id} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                    <span className="text-gray-700 truncate">{p.name}</span>
                    <span className="ml-auto text-red-600 font-semibold text-xs">Agotado</span>
                  </li>
                ))}
                {products.filter((p) => p.stock > 0 && p.stock <= 5).map((p) => (
                  <li key={p.id} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                    <span className="text-gray-700 truncate">{p.name}</span>
                    <span className="ml-auto text-orange-600 font-semibold text-xs">{p.stock} uds</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function BoxIcon() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
}
function AlertIcon() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
}
function ClipboardIcon() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></svg>
}
function CashIcon() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>
}
