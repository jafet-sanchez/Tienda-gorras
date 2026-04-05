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

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // Rutas públicas
      { path: '/',              element: <CatalogPage /> },
      { path: '/producto/:id', element: <ProductPage /> },
      { path: '/checkout',     element: <CheckoutPage /> },
      { path: '/confirmacion', element: <ConfirmationPage /> },

      // Solo accesible sin sesión (login)
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: '/admin/login', element: <LoginPage /> },
        ],
      },

      // Solo accesible con sesión (dashboard — pendiente)
      {
        element: <ProtectedRoute />,
        children: [
          // { path: '/admin',           element: <DashboardHome /> },
          // { path: '/admin/productos', element: <ProductsPage /> },
          // { path: '/admin/pedidos',   element: <OrdersPage /> },
          // { path: '/admin/ajustes',   element: <SettingsPage /> },
        ],
      },

      // 404
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
