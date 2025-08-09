"use client"

import { motion } from "framer-motion"
import { ProductCard } from "./product-card"
import type { Product } from "@/lib/firebase"

interface RecommendedProductsProps {
  products: Product[]
  onProductClick: (product: Product) => void
}

// Función para generar productos recomendados que cambian cada mes
function getMonthlyRecommendedProducts(products: Product[], count: number = 4): Product[] {
  if (products.length === 0) return []
  
  // Crear semilla basada en año-mes para consistencia mensual
  const now = new Date()
  const seed = now.getFullYear() * 12 + now.getMonth()
  
  // Función de random seeded simple
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }
  
  // Crear array de productos con índices aleatorios
  const shuffled = [...products]
    .map((product, index) => ({ product, sort: seededRandom(seed + index) }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ product }) => product)
  
  return shuffled.slice(0, Math.min(count, products.length))
}

export function RecommendedProducts({ products, onProductClick }: RecommendedProductsProps) {
  const recommendedProducts = getMonthlyRecommendedProducts(products, 4)
  
  if (recommendedProducts.length === 0) return null

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Productos{" "}
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Recomendados
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Selección especial de cuarzos que cambia cada mes, elegidos por sus propiedades únicas
        </p>
      </motion.div>

      <motion.div 
        layout 
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {recommendedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard 
              product={product} 
              onClick={() => onProductClick(product)} 
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8"
      >
        <p className="text-sm text-gray-500">
          ✨ Esta selección se actualiza automáticamente cada mes
        </p>
      </motion.div>
    </section>
  )
}
