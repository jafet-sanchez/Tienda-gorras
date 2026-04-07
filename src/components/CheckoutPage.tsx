import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatCOP } from '../utils/formatPrice'
import type { ShippingInfo } from '../store/cartStore'
import { FREE_SHIPPING_THRESHOLD } from '../data/products'
import {
  validateShippingInfo,
  digitsOnly,
  FIELD_LIMITS,
  type ShippingErrors,
} from '../utils/validation'

export default function CheckoutPage() {
  const { items, subtotal, shippingCost, total, setShippingInfo } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState<ShippingInfo>({
    name: '',
    cedula: '',
    phone: '',
    address: '',
    barrio: '',
    city: '',
    notes: '',
  })

  const [errors, setErrors] = useState<ShippingErrors>({})

  const update = (field: keyof ShippingInfo, value: string) => {
    // Para cedula y phone bloqueamos no-dígitos en tiempo real
    let next = value
    if (field === 'cedula') next = digitsOnly(value, FIELD_LIMITS.cedula)
    if (field === 'phone') next = digitsOnly(value, FIELD_LIMITS.phone)
    setForm((prev) => ({ ...prev, [field]: next }))
    if (errors[field]) {
      setErrors((prev) => {
        const { [field]: _omit, ...rest } = prev
        return rest
      })
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const result = validateShippingInfo(form)
    if (!result.valid) {
      setErrors(result.errors)
      // Scroll al primer error
      const firstField = Object.keys(result.errors)[0]
      if (firstField) {
        const el = document.querySelector<HTMLInputElement>(`[name="${firstField}"]`)
        el?.focus()
      }
      return
    }
    setErrors({})
    setShippingInfo(result.sanitized)
    navigate('/confirmacion')
    window.scrollTo(0, 0)
  }

  if (items.length === 0) {
    return (
      <section className="min-h-screen pt-24 pb-16 px-6 max-w-3xl mx-auto text-center">
        <p className="text-text-muted tracking-wide uppercase text-sm">Tu carrito está vacío.</p>
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

  const inputBase =
    'border bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted focus-visible:outline-none transition-[border-color] duration-200'
  const inputClass = (field: keyof ShippingInfo) =>
    `${inputBase} ${errors[field] ? 'border-danger focus-visible:border-danger' : 'border-border focus-visible:border-neon'}`

  return (
    <section className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-xs tracking-widest uppercase text-text-muted hover:text-neon mb-8 inline-flex items-center gap-2 transition-colors"
        >
          ← Volver al catálogo
        </button>

        <div className="mb-10">
          <p className="text-xs font-semibold tracking-ultra uppercase text-neon mb-2">Checkout</p>
          <h1 className="font-display text-4xl md:text-6xl tracking-wider text-text-primary">
            FINALIZAR COMPRA
          </h1>
          <div className="mt-4 w-12 h-0.5 bg-neon" />
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex-1 flex flex-col gap-5">
            <h2 className="text-xs tracking-ultra uppercase text-text-muted font-semibold mb-1 pb-3 border-b border-border">
              Datos de envío
            </h2>

            <label className="flex flex-col gap-2">
              <span className="text-xs tracking-widest uppercase text-text-secondary font-semibold">Nombre completo *</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                maxLength={FIELD_LIMITS.name}
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                aria-invalid={!!errors.name}
                className={inputClass('name')}
                placeholder="Tu nombre…"
              />
              {errors.name && <span className="text-[11px] text-danger tracking-wide">{errors.name}</span>}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs tracking-widest uppercase text-text-secondary font-semibold">Cédula *</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                name="cedula"
                autoComplete="off"
                required
                maxLength={FIELD_LIMITS.cedula}
                value={form.cedula}
                onChange={(e) => update('cedula', e.target.value)}
                aria-invalid={!!errors.cedula}
                className={inputClass('cedula')}
                placeholder="1234567890…"
              />
              {errors.cedula && <span className="text-[11px] text-danger tracking-wide">{errors.cedula}</span>}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs tracking-widest uppercase text-text-secondary font-semibold">Teléfono / WhatsApp *</span>
              <input
                type="tel"
                inputMode="numeric"
                pattern="\d*"
                name="phone"
                autoComplete="tel"
                required
                maxLength={FIELD_LIMITS.phone}
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                aria-invalid={!!errors.phone}
                className={inputClass('phone')}
                placeholder="3001234567"
              />
              {errors.phone && <span className="text-[11px] text-danger tracking-wide">{errors.phone}</span>}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs tracking-widest uppercase text-text-secondary font-semibold">Dirección de envío *</span>
              <input
                type="text"
                name="address"
                autoComplete="street-address"
                required
                maxLength={FIELD_LIMITS.address}
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                aria-invalid={!!errors.address}
                className={inputClass('address')}
                placeholder="Calle, número, barrio…"
              />
              {errors.address && <span className="text-[11px] text-danger tracking-wide">{errors.address}</span>}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs tracking-widest uppercase text-text-secondary font-semibold">Barrio *</span>
              <input
                type="text"
                name="barrio"
                autoComplete="off"
                required
                maxLength={FIELD_LIMITS.barrio}
                value={form.barrio}
                onChange={(e) => update('barrio', e.target.value)}
                aria-invalid={!!errors.barrio}
                className={inputClass('barrio')}
                placeholder="Nombre del barrio…"
              />
              {errors.barrio && <span className="text-[11px] text-danger tracking-wide">{errors.barrio}</span>}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs tracking-widest uppercase text-text-secondary font-semibold">Ciudad *</span>
              <input
                type="text"
                name="city"
                autoComplete="address-level2"
                required
                maxLength={FIELD_LIMITS.city}
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                aria-invalid={!!errors.city}
                className={inputClass('city')}
                placeholder="Bogotá, Medellín…"
              />
              {errors.city && <span className="text-[11px] text-danger tracking-wide">{errors.city}</span>}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs tracking-widest uppercase text-text-secondary font-semibold">Notas (opcional)</span>
              <textarea
                name="notes"
                autoComplete="off"
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                rows={3}
                maxLength={FIELD_LIMITS.notes}
                className="border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted focus-visible:outline-none focus-visible:border-neon transition-[border-color] duration-200 resize-none"
                placeholder="Instrucciones adicionales…"
              />
            </label>

            <button
              type="submit"
              className="w-full bg-neon hover:bg-neon-hover text-surface text-xs font-bold tracking-widest uppercase py-4 transition-[background-color,box-shadow] duration-300 mt-3 neon-box-glow"
            >
              Revisar pedido
            </button>
          </form>

          {/* Order summary */}
          <div className="lg:w-96 flex-shrink-0">
            <h2 className="text-xs tracking-ultra uppercase text-text-muted font-semibold mb-4 pb-3 border-b border-border">
              Resumen del pedido
            </h2>
            <div className="bg-surface-light border border-border p-5 flex flex-col gap-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    width={56}
                    height={56}
                    className="w-14 h-14 object-cover bg-surface flex-shrink-0 border border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-primary truncate uppercase tracking-wide">{product.name}</p>
                    <p className="text-[10px] text-text-muted tracking-wide uppercase mt-1 tabular-nums">
                      {quantity} × {product.price}
                    </p>
                  </div>
                  <p className="text-sm font-display text-neon whitespace-nowrap tabular-nums">
                    {formatCOP(product.numericPrice * quantity)}
                  </p>
                </div>
              ))}

              <div className="border-t border-border pt-4 flex flex-col gap-2">
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
                {shippingCost > 0 && (
                  <p className="text-[10px] text-text-muted tracking-wide">
                    Gratis en compras +{formatCOP(FREE_SHIPPING_THRESHOLD)}
                  </p>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-border">
                  <span className="text-xs tracking-widest uppercase text-text-primary font-semibold">Total</span>
                  <span className="font-display text-2xl text-neon tabular-nums">{formatCOP(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
