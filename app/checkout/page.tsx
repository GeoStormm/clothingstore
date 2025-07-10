"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, CreditCard, User, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "../context/cart-context"
import Image from "next/image"
import dayjs from "dayjs"

interface CustomerInfo {
  fullName: string
  phoneNumber: string
  email: string
  address: string
  city: string
  zipCode: string
  notes: string
  useLocation: boolean
  latitude?: number
  longitude?: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart } = useCart()
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    notes: "",
    useLocation: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tax = cartTotal * 0.08
  const shipping = cartTotal > 100 ? 0 : 9.99
  const grandTotal = cartTotal + tax + shipping

  const handleInputChange = (field: keyof CustomerInfo, value: string | boolean) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCustomerInfo((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            useLocation: true,
          }))
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("Impossible d'obtenir votre position. Veuillez saisir votre adresse manuellement.")
        },
      )
    } else {
      alert("La géolocalisation n'est pas supportée par ce navigateur.")
    }
  }

  const sendOrderToTelegram = async (orderInfo: string) => {
    const chatId = "6052412538";
    const apiKey = "7902221623:AAE7WLib0vk9eJ3Bnw0ewLYeKzX0tWVdoL8";
    await fetch(`https://api.telegram.org/bot${apiKey}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: orderInfo,
        // parse_mode removed
      }),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerInfo.fullName || !customerInfo.phoneNumber) {
      alert("Veuillez remplir tous les champs obligatoires.")
      return
    }

    setIsSubmitting(true)

    // Format order info for Telegram (modern style, no <b> tags)
    const orderDetails = cart.map(item =>
      `• ${item.name}${item.selectedSize ? ` (${item.selectedSize})` : ""}${item.selectedColor ? ` (${item.selectedColor})` : ""} - Qty: ${item.quantity} - ${item.price.toFixed(2)} DH`
    ).join("\n")

    const now = dayjs().format("DD/MM/YYYY HH:mm:ss")

    const message =
      '🛒 Nouvelle Commande Reçue!\n' +
      '\n' +
      `👤 Client: ${customerInfo.fullName}\n` +
      `📞 Téléphone: ${customerInfo.phoneNumber}\n` +
      (customerInfo.email ? `✉️ Email: ${customerInfo.email}\n` : "") +
      (customerInfo.address || customerInfo.city || customerInfo.zipCode ? `🏠 Adresse: ${customerInfo.address || "-"}, ${customerInfo.city || "-"} ${customerInfo.zipCode || "-"}\n` : "") +
      (customerInfo.useLocation && customerInfo.latitude && customerInfo.longitude ? `📍 Position: ${customerInfo.latitude}, ${customerInfo.longitude}\n` : "") +
      (customerInfo.notes ? `📝 Notes: ${customerInfo.notes}\n` : "") +
      '\n' +
      '📦 Produits commandés:\n' +
      orderDetails +
      '\n' +
      `\n💰 Total: ${grandTotal.toFixed(2)} DH` +
      '\n' +
      `\n⏰ Date: ${now}`;

    try {
      await sendOrderToTelegram(message);
    } catch (err) {
      console.error("Erreur lors de l'envoi à Telegram:", err);
      alert("Erreur lors de l'envoi de la commande à Telegram.");
      setIsSubmitting(false);
      return;
    }

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real app, you would send this data to your backend
    console.log("Commande soumise:", {
      customerInfo,
      cart,
      total: grandTotal,
    })

    clearCart()
    router.push("/order-success")
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-6">Ajoutez des articles à votre panier avant de commander</p>
          <Button onClick={() => router.push("/")}>Continuer les Achats</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au Magasin
        </Button>

        <h1 className="text-3xl font-bold mb-8">Commande</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Customer Information Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Informations Client
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="fullName">Nom Complet *</Label>
                      <Input
                        id="fullName"
                        value={customerInfo.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Numéro de Téléphone *</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={customerInfo.phoneNumber}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email (Optionnel)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center">
                      <Home className="mr-2 h-4 w-4" />
                      Adresse de Livraison
                    </h3>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="useLocation"
                        checked={customerInfo.useLocation}
                        onCheckedChange={(checked) => handleInputChange("useLocation", checked as boolean)}
                      />
                      <Label htmlFor="useLocation">Utiliser ma position actuelle</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGetLocation}
                        className="ml-auto bg-transparent"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Obtenir Position
                      </Button>
                    </div>

                    {customerInfo.useLocation && customerInfo.latitude && customerInfo.longitude && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-800">
                          Position capturée: {customerInfo.latitude.toFixed(6)}, {customerInfo.longitude.toFixed(6)}
                        </p>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="city">Ville</Label>
                        <Input
                          id="city"
                          value={customerInfo.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">Code Postal</Label>
                        <Input
                          id="zipCode"
                          value={customerInfo.zipCode}
                          onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Instructions Spéciales (Optionnel)</Label>
                    <Textarea
                      id="notes"
                      value={customerInfo.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Instructions de livraison spéciales..."
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    <CreditCard className="mr-2 h-4 w-4" />
                                            {isSubmitting ? "Traitement de la Commande..." : `Passer Commande - ${grandTotal} DH`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Résumé de la Commande</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                        <Image
                          src={item.images[0] || "/placeholder.svg"}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <div className="text-xs text-muted-foreground">
                          {item.selectedSize && <p>Taille: {item.selectedSize}</p>}
                          {item.selectedColor && <p>Couleur: {item.selectedColor}</p>}
                          <p>Qté: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{(item.price * item.quantity)} DH</p>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p>Sous-total</p>
                      <p>{cartTotal} DH</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Taxe</p>
                      <p>{tax} DH</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Livraison</p>
                      <p>{shipping === 0 ? "Gratuit" : `${shipping} DH`}</p>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <p>Total</p>
                      <p>{grandTotal} DH</p>
                    </div>
                  </div>

                  {cartTotal > 100 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800 font-medium">
                        🎉 Livraison gratuite pour les commandes de plus de 100 DH!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
