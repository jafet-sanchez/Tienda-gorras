import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import CatalogPage from '../pages/catalog/CatalogPage'
import ProductPage from '../pages/product/ProductPage'
import LoginPage from '../pages/auth/LoginPage'
import CheckoutPage from '../components/CheckoutPage'
import ConfirmationPage from '../components/ConfirmationPage'
import NotFoundPage from '../components/NotFoundPage'
import ProtectedRoute from '../guards/ProtectedRoute'
import PublicOnlyRoute from '../guards/PublicOnlyRoute'
import DashboardLayout from '../pages/dashboard/DashboardLayout'
import DashboardHome from '../pages/dashboard/DashboardHome'
import ProductsPage from '../pages/dashboard/ProductsPage'
import ProductEditPage from '../pages/dashboard/ProductEditPage'
import CategoriesPage from '../pages/dashboard/CategoriesPage'
import InventoryPage from '../pages/dashboard/InventoryPage'
import OrdersPage from '../pages/dashboard/OrdersPage'

export const router = createBrowserRouter([
  // ── Tienda (con Layout de la tienda) ──────────────────────
  {
    element: <Layout />,
    children: [
      { path: '/',              element: <CatalogPage /> },
      { path: '/producto/:id', element: <ProductPage /> },
      { path: '/checkout',     element: <CheckoutPage /> },
      { path: '/confirmacion', element: <ConfirmationPage /> },

      // Solo accesible sin sesión
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: '/admin/login', element: <LoginPage /> },
        ],
      },
    ],
  },

  // ── Dashboard (con su propio layout, sin navbar de tienda) ─
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/admin',                      element: <DashboardHome /> },
          { path: '/admin/productos',             element: <ProductsPage /> },
          { path: '/admin/productos/nuevo',       element: <ProductEditPage /> },
          { path: '/admin/productos/:id/editar',  element: <ProductEditPage /> },
          { path: '/admin/categorias',            element: <CategoriesPage /> },
          { path: '/admin/inventario',            element: <InventoryPage /> },
          { path: '/admin/pedidos',               element: <OrdersPage /> },
        ],
      },
    ],
  },

  // ── 404 ───────────────────────────────────────────────────
  { path: '*', element: <NotFoundPage /> },
])
