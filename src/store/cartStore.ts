import { create } from 'zustand'
import type { Product } from '../services/products'
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from '../data/products'

export interface ShippingInfo {
  name: string
  cedula: string
  phone: string
  address: string
  barrio: string
  city: string
  notes: string
}

export interface CartItem {
  product: Product
  quantity: number
}

interface CartStore {
  items: CartItem[]
  drawerOpen: boolean
  shippingInfo: ShippingInfo | null

  addItem: (product: Product) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  setDrawerOpen: (open: boolean) => void
  setShippingInfo: (info: ShippingInfo) => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  drawerOpen: false,
  shippingInfo: null,

  addItem: (product) =>
    set((state) => {
      if (product.stock === 0) return state
      const existing = state.items.find((i) => i.product.id === product.id)
      // Ya tiene la cantidad máxima disponible: abre el drawer pero no incrementa
      if (existing && existing.quantity >= product.stock) {
        return { ...state, drawerOpen: true }
      }
      const items = existing
        ? state.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...state.items, { product, quantity: 1 }]
      return { items, drawerOpen: true }
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.product.id !== id) })),

  updateQuantity: (id, qty) =>
    set((state) => {
      const item = state.items.find((i) => i.product.id === id)
      const maxStock = item?.product.stock ?? qty
      const clampedQty = Math.min(qty, maxStock)
      return {
        items:
          clampedQty <= 0
            ? state.items.filter((i) => i.product.id !== id)
            : state.items.map((i) => (i.product.id === id ? { ...i, quantity: clampedQty } : i)),
      }
    }),

  clearCart: () => set({ items: [], shippingInfo: null }),
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  setShippingInfo: (info) => set({ shippingInfo: info }),
}))

// Selectors (usados en el hook useCart)
export const selectItemCount = (s: CartStore) =>
  s.items.reduce((sum, i) => sum + i.quantity, 0)

export const selectSubtotal = (s: CartStore) =>
  s.items.reduce((sum, i) => sum + i.product.numericPrice * i.quantity, 0)

export const selectShippingCost = (s: CartStore) => {
  const sub = selectSubtotal(s)
  return sub === 0 ? 0 : sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
}

export const selectTotal = (s: CartStore) =>
  selectSubtotal(s) + selectShippingCost(s)
