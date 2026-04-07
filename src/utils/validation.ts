// ============================================================
// Validación + sanitización de inputs y parseo de detalle_json
// ============================================================

import type { ShippingInfo } from '../store/cartStore'
import type { OrderDetalle, OrderItem, OrderCliente } from '../services/orders'

// ---------- Helpers de sanitización ----------

/** Quita caracteres de control y limita longitud máxima. */
export function sanitizeText(input: string, maxLen: number): string {
  if (typeof input !== 'string') return ''
  // eslint-disable-next-line no-control-regex
  const stripped = input.replace(/[\u0000-\u001F\u007F]/g, ' ')
  return stripped.trim().slice(0, maxLen)
}

/** Solo dígitos, sin espacios ni signos. */
export function digitsOnly(input: string, maxLen: number): string {
  if (typeof input !== 'string') return ''
  return input.replace(/\D+/g, '').slice(0, maxLen)
}

// ---------- Reglas por campo (Colombia) ----------

const NAME_MIN = 2
const NAME_MAX = 80
const ADDRESS_MIN = 5
const ADDRESS_MAX = 200
const BARRIO_MIN = 2
const BARRIO_MAX = 80
const CITY_MIN = 2
const CITY_MAX = 60
const NOTES_MAX = 500
const CEDULA_MIN = 6
const CEDULA_MAX = 10
const PHONE_LEN = 10

const NAME_RE = /^[\p{L}\p{M}'\-.\s]+$/u

/** Cédula colombiana: 6 a 10 dígitos. */
export function isValidCedulaCO(value: string): boolean {
  return /^\d{6,10}$/.test(value)
}

/** Celular colombiano: 10 dígitos, comienza con 3. */
export function isValidPhoneCO(value: string): boolean {
  return /^3\d{9}$/.test(value)
}

// ---------- Validación de ShippingInfo ----------

export type ShippingErrors = Partial<Record<keyof ShippingInfo, string>>

export interface ShippingValidationResult {
  valid: boolean
  errors: ShippingErrors
  sanitized: ShippingInfo
}

export function validateShippingInfo(input: ShippingInfo): ShippingValidationResult {
  const errors: ShippingErrors = {}

  const name = sanitizeText(input.name, NAME_MAX)
  if (name.length < NAME_MIN) {
    errors.name = `Mínimo ${NAME_MIN} caracteres`
  } else if (!NAME_RE.test(name)) {
    errors.name = 'Solo letras, espacios y guiones'
  }

  const cedula = digitsOnly(input.cedula, CEDULA_MAX)
  if (!isValidCedulaCO(cedula)) {
    errors.cedula = `Entre ${CEDULA_MIN} y ${CEDULA_MAX} dígitos`
  }

  const phone = digitsOnly(input.phone, PHONE_LEN)
  if (!isValidPhoneCO(phone)) {
    errors.phone = 'Celular colombiano de 10 dígitos (3xxxxxxxxx)'
  }

  const address = sanitizeText(input.address, ADDRESS_MAX)
  if (address.length < ADDRESS_MIN) {
    errors.address = `Mínimo ${ADDRESS_MIN} caracteres`
  }

  const barrio = sanitizeText(input.barrio, BARRIO_MAX)
  if (barrio.length < BARRIO_MIN) {
    errors.barrio = `Mínimo ${BARRIO_MIN} caracteres`
  }

  const city = sanitizeText(input.city, CITY_MAX)
  if (city.length < CITY_MIN) {
    errors.city = `Mínimo ${CITY_MIN} caracteres`
  } else if (!NAME_RE.test(city)) {
    errors.city = 'Solo letras, espacios y guiones'
  }

  const notes = sanitizeText(input.notes ?? '', NOTES_MAX)

  const sanitized: ShippingInfo = { name, cedula, phone, address, barrio, city, notes }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  }
}

// ---------- Límites máximos exportados (para inputs HTML) ----------

export const FIELD_LIMITS = {
  name: NAME_MAX,
  cedula: CEDULA_MAX,
  phone: PHONE_LEN,
  address: ADDRESS_MAX,
  barrio: BARRIO_MAX,
  city: CITY_MAX,
  notes: NOTES_MAX,
} as const

// ============================================================
// Schema runtime para detalle_json (defensa contra DB corrupta)
// ============================================================

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function asString(v: unknown, max = 1000): string {
  return typeof v === 'string' ? v.slice(0, max) : ''
}

function asNumber(v: unknown): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string') {
    const n = Number(v)
    if (Number.isFinite(n)) return n
  }
  return 0
}

function parseCliente(raw: unknown): OrderCliente {
  const o = isObj(raw) ? raw : {}
  return {
    name:    asString(o.name, NAME_MAX),
    cedula:  asString(o.cedula, CEDULA_MAX),
    phone:   asString(o.phone, PHONE_LEN + 5),
    address: asString(o.address, ADDRESS_MAX),
    barrio:  asString(o.barrio, BARRIO_MAX),
    city:    asString(o.city, CITY_MAX),
    notes:   asString(o.notes, NOTES_MAX),
  }
}

function parseItem(raw: unknown): OrderItem {
  const o = isObj(raw) ? raw : {}
  return {
    id:       asString(o.id, 64),
    nombre:   asString(o.nombre, 200),
    precio:   asNumber(o.precio),
    cantidad: asNumber(o.cantidad),
    subtotal: asNumber(o.subtotal),
  }
}

/**
 * Parsea y normaliza `detalle_json` desde la DB.
 * Nunca lanza: devuelve un objeto con valores por defecto si la estructura no coincide.
 */
export function parseOrderDetalle(raw: unknown): OrderDetalle {
  const o = isObj(raw) ? raw : {}
  const itemsArr = Array.isArray(o.items) ? o.items : []
  return {
    cliente:  parseCliente(o.cliente),
    items:    itemsArr.map(parseItem),
    subtotal: asNumber(o.subtotal),
    envio:    asNumber(o.envio),
    total:    asNumber(o.total),
  }
}
