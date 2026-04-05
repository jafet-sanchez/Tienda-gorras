import {
  useCartStore,
  selectItemCount,
  selectSubtotal,
  selectShippingCost,
  selectTotal,
} from '../store/cartStore'

export function useCart() {
  const items        = useCartStore((s) => s.items)
  const drawerOpen   = useCartStore((s) => s.drawerOpen)
  const shippingInfo = useCartStore((s) => s.shippingInfo)
  const addItem      = useCartStore((s) => s.addItem)
  const removeItem   = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const clearCart    = useCartStore((s) => s.clearCart)
  const setDrawerOpen  = useCartStore((s) => s.setDrawerOpen)
  const setShippingInfo = useCartStore((s) => s.setShippingInfo)

  const itemCount    = useCartStore(selectItemCount)
  const subtotal     = useCartStore(selectSubtotal)
  const shippingCost = useCartStore(selectShippingCost)
  const total        = useCartStore(selectTotal)

  return {
    items,
    drawerOpen,
    shippingInfo,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setDrawerOpen,
    setShippingInfo,
    itemCount,
    subtotal,
    shippingCost,
    total,
  }
}
