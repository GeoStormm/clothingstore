"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Home, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrderSuccessPage() {
  const router = useRouter()
  const orderNumber = Math.floor(100000 + Math.random() * 900000)

  useEffect(() => {
    // Auto redirect after 10 seconds
    const timer = setTimeout(() => {
      router.push("/")
    }, 10000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Commande Confirmée!</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Merci pour votre achat! Votre commande a été passée avec succès.</p>

          <div className="p-4 bg-muted rounded-lg">
            <p className="font-semibold">Numéro de Commande</p>
            <p className="text-lg font-mono">#{orderNumber}</p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-center">
              <Package className="mr-2 h-4 w-4" />
              <span>Nous vous enverrons les informations de suivi par email</span>
            </div>
            <p>Livraison prévue: 3-5 jours ouvrables</p>
          </div>

          <div className="pt-4 space-y-2">
            <Button onClick={() => router.push("/")} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Continuer les Achats
            </Button>
            <p className="text-xs text-muted-foreground">Redirection automatique dans 10 secondes...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
