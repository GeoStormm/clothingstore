"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import CartDrawer from "./cart-drawer"
import Image from "next/image"

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div style={{ width: 180 }}>
            <Image
              src="/voguevibe-logo.png"
              alt="VogueVibe Logo"
              width={180}
              height={40}
              priority
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des produits..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            <CartDrawer />
          </div>
        </div>
      </div>
    </header>
  )
}
