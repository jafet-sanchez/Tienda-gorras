// TODO: construir URL wa.me con el mensaje del pedido
// Construye URL wa.me con el mensaje del pedido
// Usar cuando se migre el número a variables de entorno
export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
