export interface Product {
  id: number
  name: string
  price: number
  rating: number
  images: string[]
  category: "pants" | "shirts" | "shoes" | "accessories" | "Chemises" | "Pantalons" | "Chaussures" | "Accessoires" | "food" | "drinks" | "desserts"
  description: string
  sizes?: string[]
  colors?: string[]
}

export interface CartItem extends Product {
  quantity: number
  selectedSize?: string
  selectedColor?: string
}
