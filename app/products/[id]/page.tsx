"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { Product } from "../../types/product"
import { useCart } from "../../context/cart-context"
import { products } from "../../data/products"
import CartDrawer from "../../../app/components/cart-drawer"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    const productId = Number.parseInt(params.id as string)
    const foundProduct = products.find((p) => p.id === productId)
    if (foundProduct) {
      setProduct(foundProduct)
    }
  }, [params.id])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <Button onClick={() => router.push("/")}>Retour au Magasin</Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, selectedColor)
    }

    setIsAddingToCart(false)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1500)
  }

  const handleBuyNow = async () => {
    setIsBuyingNow(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, selectedColor)
    }

    setIsBuyingNow(false)
    router.push("/checkout")
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  const getCategoryName = (category: string) => {
    // Map the French category names as in your data
    switch (category) {
      case "Chemises":
        return "Chemises"
      case "Pantalons":
        return "Pantalons"
      case "Accessoires":
        return "Accessoires"
      default:
        return category
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Cart Icon at top right */}
        <div className="flex justify-end mb-4">
          <CartDrawer />
        </div>
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border bg-gray-50">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 aspect-square w-20 h-20 overflow-hidden rounded-md border-2 transition-all ${
                      selectedImage === index ? "border-orange-500" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {getCategoryName(product.category)}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">{renderStars(product.rating)}</div>
                <span className="text-sm text-muted-foreground">({product.rating}/5)</span>
                <span className="text-sm text-muted-foreground">• 127 avis</span>
              </div>
              <p className="text-3xl font-bold text-orange-600">{product.price} DH</p>
            </div>

            <Separator />

            <div>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <Label className="text-base font-medium mb-3 block">Taille</Label>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <div key={size} className="flex items-center">
                      <RadioGroupItem value={size} id={size} className="sr-only" />
                      <Label
                        htmlFor={size}
                        className={`cursor-pointer px-4 py-2 border rounded-md text-sm font-medium transition-all ${
                          selectedSize === size
                            ? "border-orange-500 bg-orange-50 text-orange-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <Label className="text-base font-medium mb-3 block">Couleur</Label>
                <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <div key={color} className="flex items-center">
                      <RadioGroupItem value={color} id={color} className="sr-only" />
                      <Label
                        htmlFor={color}
                        className={`cursor-pointer px-4 py-2 border rounded-md text-sm font-medium transition-all ${
                          selectedColor === color
                            ? "border-orange-500 bg-orange-50 text-orange-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {color}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Quantity */}
            <div>
              <Label className="text-base font-medium mb-3 block">Quantité</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  +
                </Button>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleBuyNow}
                className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-300 hover:scale-105"
                size="lg"
                disabled={isBuyingNow}
              >
                <Zap className={`mr-2 h-5 w-5 ${isBuyingNow ? "animate-spin" : ""}`} />
                {isBuyingNow ? "Redirection..." : "Acheter Maintenant"}
              </Button>

              <Button
                onClick={handleAddToCart}
                variant={addedToCart ? "default" : "outline"}
                className={`w-full transition-all duration-300 hover:scale-105 bg-transparent ${addedToCart ? "bg-green-500 text-white border-green-600" : ""}`}
                size="lg"
                disabled={isAddingToCart || addedToCart}
              >
                <ShoppingCart className={`mr-2 h-5 w-5 ${isAddingToCart ? "animate-bounce" : ""}`} />
                {addedToCart ? "Ajouté !" : isAddingToCart ? "Ajout..." : "Ajouter au Panier"}
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`transition-all duration-300 ${isFavorite ? "text-red-500 border-red-300" : ""}`}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <p className="text-xs text-muted-foreground">Livraison gratuite dès 100€</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-xs text-muted-foreground">Retours gratuits 30 jours</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-xs text-muted-foreground">Garantie qualité</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Spécifications</TabsTrigger>
              <TabsTrigger value="reviews">Avis (127)</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Description détaillée</h3>
                  <div className="prose max-w-none">
                    <p className="mb-4">{product.description}</p>
                    <p className="mb-4">
                      Ce produit de qualité supérieure a été conçu avec le plus grand soin pour vous offrir confort,
                      style et durabilité. Chaque détail a été pensé pour répondre aux exigences des clients les plus
                      exigeants.
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Matériaux de qualité premium</li>
                      <li>Finitions soignées et durables</li>
                      <li>Design moderne et intemporel</li>
                      <li>Confort optimal pour un usage quotidien</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Spécifications techniques</h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Catégorie</p>
                        <p className="text-muted-foreground">{getCategoryName(product.category)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Note</p>
                        <p className="text-muted-foreground">{product.rating}/5 étoiles</p>
                      </div>
                    </div>
                    {product.sizes && (
                      <div>
                        <p className="font-medium">Tailles disponibles</p>
                        <p className="text-muted-foreground">{product.sizes.join(", ")}</p>
                      </div>
                    )}
                    {product.colors && (
                      <div>
                        <p className="font-medium">Couleurs disponibles</p>
                        <p className="text-muted-foreground">{product.colors.join(", ")}</p>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">Matière</p>
                      <p className="text-muted-foreground">
                        {product.category === "Chemises" && "100% Coton biologique"}
                        {product.category === "Pantalons" && "98% Coton, 2% Élasthanne"}
                        {product.category === "Accessoires" && "Matériaux premium sélectionnés"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Avis clients</h3>
                  <div className="space-y-6">
                    {/* Sample reviews */}
                    <div className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">{renderStars(5)}</div>
                        <span className="font-medium">Marie L.</span>
                        <span className="text-sm text-muted-foreground">• Il y a 2 jours</span>
                      </div>
                      <p className="text-muted-foreground">
                        Excellent produit ! La qualité est au rendez-vous et la taille correspond parfaitement. Je
                        recommande vivement.
                      </p>
                    </div>
                    <div className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">{renderStars(4)}</div>
                        <span className="font-medium">Pierre M.</span>
                        <span className="text-sm text-muted-foreground">• Il y a 1 semaine</span>
                      </div>
                      <p className="text-muted-foreground">
                        Très satisfait de mon achat. Le produit correspond à la description et la livraison a été
                        rapide.
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">{renderStars(5)}</div>
                        <span className="font-medium">Sophie D.</span>
                        <span className="text-sm text-muted-foreground">• Il y a 2 semaines</span>
                      </div>
                      <p className="text-muted-foreground">
                        Parfait ! Exactement ce que je cherchais. La qualité est exceptionnelle pour ce prix.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
