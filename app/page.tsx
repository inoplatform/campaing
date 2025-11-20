"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Product } from "@/types/product"
import { ProductCard } from "@/components/product-card"
import { CartDrawer } from "@/components/cart-drawer"
import { ProductDetailModal } from "@/components/product-detail-modal"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCart } from "@/lib/cart-storage"
import { Package } from "lucide-react"

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [categories, setCategories] = useState<string[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const updateCartCount = () => {
    const cart = getCart()
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0))
  }

  useEffect(() => {
    updateCartCount()
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("category", { ascending: true })
      .order("name", { ascending: true })

    if (error) {
      console.error("Error loading products:", error)
      return
    }

    if (data) {
      setProducts(data)
      setFilteredProducts(data)

      const uniqueCategories = Array.from(new Set(data.map((p) => p.category)))
      setCategories(uniqueCategories)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((p) => p.category === selectedCategory))
    }
  }, [selectedCategory, products])

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const totalSavings = products.reduce((sum, p) => sum + (p.regular_price - p.discount_price), 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">ProEquip Deals</span>
          </div>
          <CartDrawer cartCount={cartCount} onCartChange={updateCartCount} />
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance mb-4">
              Commercial Equipment Clearance Sale
            </h1>
            <p className="text-xl text-muted-foreground text-pretty mb-6">
              Professional-grade ovens and cooling systems at up to 30% off. Limited time offers on premium commercial
              kitchen equipment.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <p className="text-2xl font-bold text-primary">${totalSavings.toFixed(0)}+</p>
                <p className="text-muted-foreground">Total Savings Available</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{products.length}</p>
                <p className="text-muted-foreground">Products on Sale</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container px-4 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList>
              <TabsTrigger value="all">All Products</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onCartUpdate={updateCartCount}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        )}
      </section>

      <ProductDetailModal
        product={selectedProduct}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCartUpdate={updateCartCount}
      />

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 ProEquip Deals. All rights reserved.</p>
            <p>Contact us via WhatsApp for bulk orders and custom quotes.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
