"use client"

import { motion } from "framer-motion"
import type { Product } from "@/lib/firebase"
import Image from "next/image"

interface ProductCardProps {
  product: Product
  onClick: () => void
  showAddStoneButton?: boolean // Nueva prop para controlar si mostrar el botón
}

export function ProductCard({ product, onClick, showAddStoneButton = false }: ProductCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4">
        {/* Badge del tipo */}
        <div className="flex items-center justify-between mb-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.type === "collar"
                ? "bg-pink-100 text-pink-700"
                : product.type === "anillo"
                  ? "bg-blue-100 text-blue-700"
                  : product.type === "forma"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
            }`}
          >
            {product.type === "collar"
              ? "Collar"
              : product.type === "anillo"
                ? "Anillo"
                : product.type === "forma"
                  ? "Forma"
                  : "En Bruto"}
          </span>
        </div>

        <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-purple-600">${product.price.toLocaleString()}</span>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium"
            >
              Ver más
            </motion.button>
            {/* Solo mostrar el botón "Añadir piedra" si showAddStoneButton es true y es producto en bruto */}
            {showAddStoneButton && product.type === "bruto" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation()
                  window.dispatchEvent(new CustomEvent("openAddVariant", { detail: product }))
                }}
                className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium"
              >
                Añadir piedra
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
