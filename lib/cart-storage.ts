"use client"

import type { CartItem } from "@/types/product"

const CART_KEY = "discount_campaign_cart"

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(CART_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export function addToCart(item: CartItem): CartItem[] {
  const cart = getCart()
  const existingIndex = cart.findIndex((i) => i.id === item.id)

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += item.quantity
  } else {
    cart.push(item)
  }

  saveCart(cart)
  return cart
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = getCart().filter((item) => item.id !== productId)
  saveCart(cart)
  return cart
}

export function updateCartQuantity(productId: string, quantity: number): CartItem[] {
  const cart = getCart()
  const item = cart.find((i) => i.id === productId)

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId)
    }
    item.quantity = quantity
    saveCart(cart)
  }

  return cart
}

export function clearCart(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CART_KEY)
}

export function getCartTotal(): { subtotal: number; savings: number; total: number } {
  const cart = getCart()
  const subtotal = cart.reduce((sum, item) => sum + item.discount_price * item.quantity, 0)
  const savings = cart.reduce((sum, item) => sum + (item.regular_price - item.discount_price) * item.quantity, 0)
  return { subtotal, savings, total: subtotal }
}
