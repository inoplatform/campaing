"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import type { CartItem } from "@/types/product"
import type { Country } from "@/types/country"
import { getCart, updateCartQuantity, removeFromCart, getCartTotal, clearCart } from "@/lib/cart-storage"
import { sendWhatsAppOrder } from "@/lib/whatsapp"
import { useEffect, useState } from "react"
import Image from "next/image"
import { CountrySelector } from "@/components/country-selector"

interface CartDrawerProps {
  cartCount: number
  onCartChange: () => void
}

export function CartDrawer({ cartCount, onCartChange }: CartDrawerProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [totals, setTotals] = useState({ subtotal: 0, savings: 0, total: 0 })
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)

  const refreshCart = () => {
    const currentCart = getCart()
    setCart(currentCart)
    setTotals(getCartTotal())
  }

  useEffect(() => {
    refreshCart()
  }, [cartCount])

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    updateCartQuantity(productId, newQuantity)
    refreshCart()
    onCartChange()
  }

  const handleRemove = (productId: string) => {
    removeFromCart(productId)
    refreshCart()
    onCartChange()
  }

  const handleCheckout = () => {
    if (!selectedCountry) {
      alert("Please select your country first")
      return
    }

    sendWhatsAppOrder(cart, totals, selectedCountry.whatsapp_number)
    clearCart()
    refreshCart()
    onCartChange()
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-transparent">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {cartCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({cartCount})</SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 pr-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-tight line-clamp-2 mb-1">{item.name}</h4>
                      <p className="text-sm font-bold text-primary">${item.discount_price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-transparent"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-transparent"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-auto"
                          onClick={() => handleRemove(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="flex-col gap-4 pt-4 border-t">
              <div className="w-full">
                <label className="text-sm font-medium mb-2 block">Select your country</label>
                <CountrySelector selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} />
              </div>

              <div className="space-y-2 w-full">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">Total Savings</span>
                  <span className="font-bold text-green-600">${totals.savings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>${totals.total.toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={handleCheckout} disabled={!selectedCountry}>
                Checkout via WhatsApp
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
