"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "../context/cart-context"
import Image from "next/image"

export default function CartDrawer() {
  const [open, setOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const router = useRouter()
  const { cart, removeFromCart, updateQuantity, cartTotal, itemCount } = useCart()

  // Trigger animation when items are added to cart
  useEffect(() => {
    if (itemCount > 0) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 600)
      return () => clearTimeout(timer)
    }
  }, [itemCount])

  const handleCheckout = () => {
    setOpen(false)
    router.push("/checkout")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`relative bg-transparent transition-all duration-300 ${
            itemCount > 0 ? "hover:scale-110 shadow-lg border-orange-300 hover:border-orange-400" : ""
          } ${isAnimating ? "animate-bounce scale-110 shadow-xl border-orange-400" : ""}`}
        >
          <ShoppingCart
            className={`h-4 w-4 transition-all duration-300 ${itemCount > 0 ? "text-orange-600" : ""} ${
              isAnimating ? "animate-pulse" : ""
            }`}
          />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className={`absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs transition-all duration-300 ${
                isAnimating ? "animate-ping scale-125 bg-orange-500" : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              <span className={isAnimating ? "animate-pulse" : ""}>{itemCount}</span>
            </Badge>
          )}

          {/* Pulsing ring effect when cart has items */}
          {itemCount > 0 && (
            <div className="absolute inset-0 rounded-md border-2 border-orange-400 animate-ping opacity-30"></div>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5 text-orange-600" />
            Panier ({itemCount} articles)
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">Votre panier est vide</h3>
              <p className="text-sm text-muted-foreground">Ajoutez des articles pour commencer</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  className={`flex gap-3 transition-all duration-300 ${
                    isAnimating && index === cart.length - 1
                      ? "animate-slideInRight bg-orange-50 p-2 rounded-lg border border-orange-200"
                      : ""
                  }`}
                >
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                    <Image
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                      <p className="font-medium text-orange-600">{(item.price * item.quantity)} DH</p>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <p>{item.price} DH chacun</p>
                      {item.selectedSize && <p>Taille: {item.selectedSize}</p>}
                      {item.selectedColor && <p>Couleur: {item.selectedColor}</p>}
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-transparent hover:bg-orange-50 hover:border-orange-300"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium text-orange-600">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-transparent hover:bg-orange-50 hover:border-orange-300"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t pt-4">
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <p>Sous-total</p>
                <p className="text-orange-600 font-medium">{cartTotal} DH</p>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p className="text-orange-600">{cartTotal} DH</p>
              </div>
            </div>

            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              size="lg"
              onClick={handleCheckout}
            >
              Commander
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
