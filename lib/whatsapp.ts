import type { CartItem } from "@/types/product"

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "1234567890"

export function generateWhatsAppMessage(cart: CartItem[], totals: { subtotal: number; savings: number }): string {
  let message = "🛒 *New Order Request*\n\n"

  cart.forEach((item) => {
    message += `• ${item.name}\n`
    message += `  Qty: ${item.quantity} × $${item.discount_price.toFixed(2)}\n`
    message += `  SKU: ${item.sku}\n\n`
  })

  message += `-------------------\n`
  message += `Subtotal: $${totals.subtotal.toFixed(2)}\n`
  message += `💰 Total Savings: $${totals.savings.toFixed(2)}\n`
  message += `\nPlease confirm availability and shipping details.`

  return message
}

export function sendWhatsAppOrder(
  cart: CartItem[],
  totals: { subtotal: number; savings: number },
  whatsappNumber: string,
): void {
  const message = generateWhatsAppMessage(cart, totals)
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

  window.open(whatsappUrl, "_blank")
}

export function getWhatsAppNumber(): string {
  return WHATSAPP_NUMBER
}
