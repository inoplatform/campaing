"use client"

import type { Product } from "@/types/product"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Minus, Package } from "lucide-react"
import Image from "next/image"
import { addToCart } from "@/lib/cart-storage"
import { useState } from "react"

interface ProductDetailModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCartUpdate: () => void
}

export function ProductDetailModal({ product, open, onOpenChange, onCartUpdate }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  if (!product) return null

  const discountPercent = Math.round(((product.regular_price - product.discount_price) / product.regular_price) * 100)
  const totalPrice = product.discount_price * quantity
  const totalSavings = (product.regular_price - product.discount_price) * quantity

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart({ ...product, quantity })
    onCartUpdate()

    setTimeout(() => {
      setIsAdding(false)
      setQuantity(1)
      onOpenChange(false)
    }, 600)
  }

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
          <DialogDescription>SKU: {product.sku}</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <Image src={product.image_url || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground font-bold text-lg px-4 py-2">
              {discountPercent}% OFF
            </Badge>
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
              <p className="text-base leading-relaxed">{product.description}</p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Category:</span>
              <Badge variant="secondary">{product.category}</Badge>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Stock Available:</span>
              <span className="font-medium">{product.stock} units</span>
            </div>

            <div className="border-t border-b py-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Regular Price</span>
                <span className="text-lg line-through text-muted-foreground">${product.regular_price.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Discount Price</span>
                <span className="text-3xl font-bold text-primary">${product.discount_price.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-green-600">
                <span className="font-medium">You Save</span>
                <span className="font-bold">${(product.regular_price - product.discount_price).toFixed(2)}</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Quantity</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDecrement}
                    disabled={quantity <= 1 || product.stock === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleIncrement}
                    disabled={quantity >= product.stock || product.stock === 0}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {quantity > 1 && (
                <div className="bg-muted p-3 rounded-lg space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({quantity} items)</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Total Savings</span>
                    <span className="font-bold">${totalSavings.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            <Button
              size="lg"
              className="w-full mt-auto"
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isAdding ? "Added to Cart!" : product.stock === 0 ? "Out of Stock" : `Add ${quantity} to Cart`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
