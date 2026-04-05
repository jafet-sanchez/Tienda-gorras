import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatCOP } from '../utils/formatPrice'
import { WHATSAPP_NUMBER } from '../data/products'

export default function ConfirmationPage() {
  const { items, subtotal, shippingCost, total, shippingInfo, clearCart } = useCart()
  const navigate = useNavigate()

  if (!shippingInfo || items.length === 0) {
    return (
      <section className="min-h-screen pt-24 pb-16 px-6 max-w-3xl mx-auto text-center">
        <p className="text-text-muted tracking-wide uppercase text-sm">No hay pedido para confirmar.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-6 text-xs tracking-widest uppercase text-neon hover:text-neon-hover transition-colors"
        >
          ← Volver al catálogo
        </button>
      </section>
    )
  }

  const buildWhatsAppMessage = () => {
    let msg = `¡Hola! Quiero confirmar mi pedido en *Krowm Gorras* 🧢\n\n`
    msg += `*Productos:*\n`
    items.forEach(({ product, quantity }) => {
      msg += `• ${product.name} x${quantity} — ${formatCOP(product.numericPrice * quantity)}\n`
    })
    msg += `\n*Subtotal:* ${formatCOP(subtotal)}\n`
    msg += `*Envío:* ${shippingCost === 0 ? 'Gratis' : formatCOP(shippingCost)}\n`
    msg += `*Total:* ${formatCOP(total)}\n`
    msg += `\n*Datos de envío:*\n`
    msg += `Nombre: ${shippingInfo.name}\n`
    msg += `Teléfono: ${shippingInfo.phone}\n`
    msg += `Dirección: ${shippingInfo.address}\n`
    msg += `Ciudad: ${shippingInfo.city}\n`
    if (shippingInfo.notes) msg += `Notas: ${shippingInfo.notes}\n`
    return msg
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`

  const handleConfirm = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    clearCart()
    navigate('/')
    window.scrollTo(0, 0)
  }

  return (
    <section className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <button
          type="button"
          onClick={() => navigate('/checkout')}
          className="text-xs tracking-widest uppercase text-text-muted hover:text-neon mb-8 inline-flex items-center gap-2 transition-colors"
        >
          ← Volver al formulario
        </button>

        <div className="mb-10">
          <p className="text-xs font-semibold tracking-ultra uppercase text-neon mb-2">Paso final</p>
          <h1 className="font-display text-4xl md:text-6xl tracking-wider text-text-primary">
            CONFIRMAR PEDIDO
          </h1>
          <div className="mt-4 w-12 h-0.5 bg-neon" />
        </div>

        {/* Products */}
        <div className="bg-surface-light border border-border p-6 mb-6">
          <h2 className="text-xs tracking-ultra uppercase text-text-muted font-semibold mb-5 pb-3 border-b border-border">
            Productos
          </h2>
          <ul className="flex flex-col gap-4">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex gap-4 items-center">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover bg-surface flex-shrink-0 border border-border"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-primary truncate uppercase tracking-wide">{product.name}</p>
                  <p className="text-[10px] text-text-muted tracking-wide uppercase mt-1 tabular-nums">
                    {quantity} × {product.price}
                  </p>
                </div>
                <p className="text-sm font-display text-neon tabular-nums">
                  {formatCOP(product.numericPrice * quantity)}
                </p>
              </li>
            ))}
          </ul>

          <div className="border-t border-border mt-5 pt-4 flex flex-col gap-2">
            <div className="flex justify-between text-xs tracking-wide uppercase text-text-muted">
              <span>Subtotal</span>
              <span className="text-text-primary tabular-nums">{formatCOP(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs tracking-wide uppercase text-text-muted">
              <span>Envío</span>
              <span>
                {shippingCost === 0 ? (
                  <span className="text-neon font-semibold">Gratis</span>
                ) : (
                  <span className="text-text-primary tabular-nums">{formatCOP(shippingCost)}</span>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border">
              <span className="text-xs tracking-widest uppercase text-text-primary font-semibold">Total</span>
              <span className="font-display text-3xl text-neon tabular-nums">{formatCOP(total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping info */}
        <div className="bg-surface-light border border-border p-6 mb-8">
          <h2 className="text-xs tracking-ultra uppercase text-text-muted font-semibold mb-5 pb-3 border-b border-border">
            Datos de envío
          </h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
            <dt className="text-xs tracking-widest uppercase text-text-muted">Nombre</dt>
            <dd className="text-text-primary">{shippingInfo.name}</dd>
            <dt className="text-xs tracking-widest uppercase text-text-muted">Teléfono</dt>
            <dd className="text-text-primary tabular-nums">{shippingInfo.phone}</dd>
            <dt className="text-xs tracking-widest uppercase text-text-muted">Dirección</dt>
            <dd className="text-text-primary">{shippingInfo.address}</dd>
            <dt className="text-xs tracking-widest uppercase text-text-muted">Ciudad</dt>
            <dd className="text-text-primary">{shippingInfo.city}</dd>
            {shippingInfo.notes && (
              <>
                <dt className="text-xs tracking-widest uppercase text-text-muted">Notas</dt>
                <dd className="text-text-primary">{shippingInfo.notes}</dd>
              </>
            )}
          </dl>
        </div>

        {/* Confirm button */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full inline-flex items-center justify-center gap-3 bg-neon hover:bg-neon-hover text-surface text-xs font-bold tracking-widest uppercase py-5 transition-[background-color,box-shadow] duration-300 neon-box-glow"
        >
          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.122 1.528 5.855L.057 23.886a.5.5 0 00.6.6l6.098-1.458A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.66-.52-5.17-1.42l-.37-.22-3.83.916.932-3.758-.24-.39A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
          Confirmar y enviar por WhatsApp
        </button>
      </div>
    </section>
  )
}
