"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Product } from "@/lib/firebase"
import { addToCart } from "@/lib/firebase"
import Image from "next/image"
import { X, ShoppingCart, Plus, Minus, Heart, Leaf } from "lucide-react"

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedWeight, setSelectedWeight] = useState<number>(0)
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  // Calcular precio según el tipo de producto
  const getCurrentPrice = () => {
    if (product.type === "bruto" && product.pricePerGram && selectedWeight > 0) {
      return selectedWeight * product.pricePerGram
    }
    return product.price
  }

  // Generar opciones de gramaje para productos en bruto - CORREGIDO
  const getWeightOptions = () => {
    if (product.type !== "bruto" || !product.minWeight || !product.maxWeight) return []

    const options = []

    // Generar todas las opciones enteras en el rango
    for (let weight = product.minWeight; weight <= product.maxWeight; weight++) {
      options.push(weight)
    }

    return options
  }

  const weightOptions = getWeightOptions()

  // Inicializar peso seleccionado si no está establecido
  if (product.type === "bruto" && selectedWeight === 0 && weightOptions.length > 0) {
    setSelectedWeight(weightOptions[0])
  }

  const handleAddToCart = () => {
    if (product.type === "bruto" && selectedWeight > 0) {
      addToCart(product, quantity, selectedWeight)
    } else {
      addToCart(product, quantity)
    }

    // Mostrar feedback
    const event = new CustomEvent("cartItemAdded", {
      detail: {
        productName: product.name,
        quantity,
        weight: selectedWeight > 0 ? selectedWeight : undefined,
      },
    })
    window.dispatchEvent(event)

    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        /* Modal Sidebar Flotante - SIN overlay que bloquee */
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-4 right-4 bottom-4 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col rounded-2xl border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header con botón cerrar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-2xl">
            <h2 className="text-lg font-semibold text-gray-800">Detalles del Producto</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>

          {/* Contenido con scroll */}
          <div className="flex-1 overflow-y-auto">
            {/* Imagen del producto */}
            <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100">
              <Image
                src={
                  product.imageUrl || "/placeholder.svg?height=400&width=400&query=beautiful crystal quartz gemstone"
                }
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Información del producto */}
            <div className="p-6 space-y-6">
              {/* Header del producto */}
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${
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

                <h3 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h3>

                <div className="text-3xl font-bold text-purple-600">
                  ${getCurrentPrice().toLocaleString()}
                  {product.type === "bruto" && selectedWeight > 0 && (
                    <span className="text-lg text-gray-500 ml-2">({selectedWeight}g)</span>
                  )}
                </div>
              </div>

              {/* Selector de gramaje para productos en bruto */}
              {product.type === "bruto" && weightOptions.length > 0 && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-800">Selecciona el gramaje</label>
                  <select
                    value={selectedWeight}
                    onChange={(e) => setSelectedWeight(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-lg"
                  >
                    {weightOptions.map((weight) => (
                      <option key={weight} value={weight}>
                        {weight}g - ${(weight * (product.pricePerGram || 0)).toLocaleString()}
                      </option>
                    ))}
                  </select>

                  {product.pricePerGram && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                      <p className="text-sm text-blue-800">
                        💰 <strong>Precio por gramo:</strong> ${product.pricePerGram.toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Rango disponible: {product.minWeight}g - {product.maxWeight}g
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Selector de cantidad */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800">Cantidad</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-100 hover:bg-gray-200 p-3 rounded-xl transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="font-bold text-2xl min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-100 hover:bg-gray-200 p-3 rounded-xl transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-800">Descripción</h4>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Propiedades espirituales */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Propiedades Espirituales
                </h4>
                <p className="text-purple-700 leading-relaxed">{product.spiritualProperties}</p>
              </div>

              {/* Info adicional */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <Leaf className="w-5 h-5" />
                  100% Natural
                </h4>
                <p className="text-green-700 text-sm leading-relaxed">
                  Producto auténtico y natural, cuidadosamente seleccionado por sus propiedades únicas. Sin tratamientos
                  químicos.
                </p>
              </div>
            </div>
          </div>

          {/* Footer con botón de compra */}
          <div className="p-6 border-t border-gray-200 bg-white rounded-b-2xl">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              Añadir al carrito
            </motion.button>

            <p className="text-center text-gray-500 text-sm mt-3">
              Total:{" "}
              <span className="font-semibold text-purple-600">${(getCurrentPrice() * quantity).toLocaleString()}</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
