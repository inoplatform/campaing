"use client"

import type React from "react"

import type { Product } from "@/types/product"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import Image from "next/image"
import { addToCart } from "@/lib/cart-storage"
import { useState } from "react"

interface ProductCardProps {
  product: Product
  onCartUpdate: () => void
  onProductClick: (product: Product) => void
}

export function ProductCard({ product, onCartUpdate, onProductClick }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const discountPercent = Math.round(((product.regular_price - product.discount_price) / product.regular_price) * 100)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAdding(true)
    addToCart({ ...product, quantity })
    onCartUpdate()
    setQuantity(1) // Reset quantity after adding

    setTimeout(() => setIsAdding(false), 600)
  }

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <Card
      className="overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onProductClick(product)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground font-bold">
          {discountPercent}% OFF
        </Badge>
      </div>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">{product.name}</h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground line-through">${product.regular_price.toFixed(2)}</span>
          <span className="text-2xl font-bold text-primary">${product.discount_price.toFixed(2)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Save ${(product.regular_price - product.discount_price).toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex-col gap-2">
        <div className="flex items-center gap-2 w-full">
          <span className="text-sm text-muted-foreground">Qty:</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={handleDecrement}
              disabled={quantity <= 1 || product.stock === 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-8 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={handleIncrement}
              disabled={quantity >= product.stock || product.stock === 0}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-xs text-muted-foreground ml-auto">{product.stock} in stock</span>
        </div>
        <Button className="w-full" onClick={handleAddToCart} disabled={isAdding || product.stock === 0}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isAdding ? "Added!" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}
