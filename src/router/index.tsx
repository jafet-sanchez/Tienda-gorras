import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import CatalogPage from '../pages/catalog/CatalogPage'
import NotFoundPage from '../components/NotFoundPage'

// ── Lazy-loaded: solo se descargan cuando el usuario navega a la ruta ──
const ProductPage = lazy(() => import('../pages/product/ProductPage'))
const PrivacyPage = lazy(() => import('../pages/privacy/PrivacyPage'))
const CheckoutPage = lazy(() => import('../components/CheckoutPage'))
const ConfirmationPage = lazy(() => import('../components/ConfirmationPage'))
const ProtectedRoute = lazy(() => import('../guards/ProtectedRoute'))
const DashboardLayout = lazy(() => import('../pages/dashboard/DashboardLayout'))
const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome'))
const ProductsPage = lazy(() => import('../pages/dashboard/ProductsPage'))
const ProductEditPage = lazy(() => import('../pages/dashboard/ProductEditPage'))
const CategoriesPage = lazy(() => import('../pages/dashboard/CategoriesPage'))
const InventoryPage = lazy(() => import('../pages/dashboard/InventoryPage'))
const OrdersPage = lazy(() => import('../pages/dashboard/OrdersPage'))

function LazyFallback({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  // ── Tienda (con Layout de la tienda) ──────────────────────
  {
    element: <Layout />,
    children: [
      { path: '/',              element: <CatalogPage /> },
      { path: '/producto/:id', element: <LazyFallback><ProductPage /></LazyFallback> },
      { path: '/checkout',     element: <LazyFallback><CheckoutPage /></LazyFallback> },
      { path: '/confirmacion', element: <LazyFallback><ConfirmationPage /></LazyFallback> },
      { path: '/privacidad',   element: <LazyFallback><PrivacyPage /></LazyFallback> },
    ],
  },

  // ── Dashboard (con su propio layout, sin navbar de tienda) ─
  {
    element: <LazyFallback><ProtectedRoute /></LazyFallback>,
    children: [
      {
        element: <LazyFallback><DashboardLayout /></LazyFallback>,
        children: [
          { path: '/admin',                      element: <LazyFallback><DashboardHome /></LazyFallback> },
          { path: '/admin/productos',             element: <LazyFallback><ProductsPage /></LazyFallback> },
          { path: '/admin/productos/nuevo',       element: <LazyFallback><ProductEditPage /></LazyFallback> },
          { path: '/admin/productos/:id/editar',  element: <LazyFallback><ProductEditPage /></LazyFallback> },
          { path: '/admin/categorias',            element: <LazyFallback><CategoriesPage /></LazyFallback> },
          { path: '/admin/inventario',            element: <LazyFallback><InventoryPage /></LazyFallback> },
          { path: '/admin/pedidos',               element: <LazyFallback><OrdersPage /></LazyFallback> },
        ],
      },
    ],
  },

  // ── 404 ───────────────────────────────────────────────────
  { path: '*', element: <NotFoundPage /> },
])
