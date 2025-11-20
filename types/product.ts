export interface Product {
  id: string
  name: string
  description: string | null
  category: string
  regular_price: number
  discount_price: number
  image_url: string | null
  stock: number
  sku: string
  created_at: string
}

export interface CartItem extends Product {
  quantity: number
}
