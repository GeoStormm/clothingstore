"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

const categories = [
  { id: "all", name: "Tous" },
  { id: "Chemises", name: "Chemises" },
  { id: "Pantalons", name: "Pantalons" },
  { id: "Accessoires", name: "Accessoires" },
]

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectCategory(category.id)}
          className={cn("transition-all duration-200", selectedCategory === category.id && "shadow-md")}
        >
          {category.name}
        </Button>
      ))}
    </div>
  )
}
