"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Star, ShoppingCart, ChevronLeft, ChevronRight, Zap, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "../types/product"
import { useCart } from "../context/cart-context"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const { addToCart } = useCart()
  const router = useRouter()

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAddingToCart(true)

    // Add a small delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 300))

    addToCart(product)
    setIsAddingToCart(false)
  }

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsBuyingNow(true)

    // Add a small delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 300))

    addToCart(product)
    setIsBuyingNow(false)
    router.push("/checkout")
  }

  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/product/${product.id}`)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <Card
      className="group overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={handleViewProduct}
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.images[currentImageIndex] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Quick View Button */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <Button
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
            onClick={handleViewProduct}
          >
            <Eye className="h-4 w-4 mr-2" />
            Voir Détails
          </Button>
        </div>

        {/* Image Navigation */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {product.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-1">
            {product.images.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-1.5 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        )}

        {/* Category Badge */}
        <Badge variant="secondary" className="absolute left-2 top-2 capitalize">
          {product.category === "shirts" && "Chemises"}
          {product.category === "pants" && "Pantalons"}
          {product.category === "shoes" && "Chaussures"}
          {product.category === "accessories" && "Accessoires"}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(product.rating)}
            <span className="text-xs text-muted-foreground ml-1">({product.rating})</span>
          </div>
          <span className="font-bold text-lg">{product.price.toFixed(2)}€</span>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleAddToCart}
            className={`w-full bg-transparent transition-all duration-300 ${
              isAddingToCart ? "animate-pulse bg-orange-100 border-orange-300" : ""
            }`}
            size="sm"
            variant="outline"
            disabled={isAddingToCart}
          >
            <ShoppingCart className={`h-4 w-4 mr-2 ${isAddingToCart ? "animate-bounce" : ""}`} />
            {isAddingToCart ? "Ajout..." : "Ajouter au Panier"}
          </Button>

          <Button
            onClick={handleBuyNow}
            className={`w-full transition-all duration-300 hover:scale-105 ${
              isBuyingNow ? "animate-pulse scale-105" : ""
            }`}
            size="sm"
            disabled={isBuyingNow}
          >
            <Zap className={`h-4 w-4 mr-2 ${isBuyingNow ? "animate-spin" : ""}`} />
            {isBuyingNow ? "Redirection..." : "Acheter Maintenant"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
