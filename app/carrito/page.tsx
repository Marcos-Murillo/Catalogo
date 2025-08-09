"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getCartItems, updateCartItemQuantity, removeFromCart, getCartTotal, clearCart, type CartItem } from "@/lib/firebase"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, MessageCircle } from 'lucide-react'
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function CarritoPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadCartItems = () => {
    const items = getCartItems()
    setCartItems(items)
    setIsLoading(false)
  }

  useEffect(() => {
    loadCartItems()

    const handleCartUpdate = () => {
      loadCartItems()
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    return () => window.removeEventListener("cartUpdated", handleCartUpdate)
  }, [])

  const updateQuantity = (itemId: string, newQuantity: number) => {
    updateCartItemQuantity(itemId, newQuantity)
    loadCartItems()
  }

  const removeItem = (itemId: string) => {
    removeFromCart(itemId)
    loadCartItems()
  }

  const handleWhatsAppOrder = () => {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573123456789"
    
    let message = "¡Hola! Me interesa hacer el siguiente pedido:\n\n"
    
    cartItems.forEach((item, index) => {
      const price = item.selectedVariant?.price || item.product.price
      const weight = item.selectedVariant?.weight || item.product.weight
      const weightText = weight ? ` (${weight}g)` : ""
      
      message += `${index + 1}. ${item.product.name}${weightText}\n`
      message += `   Cantidad: ${item.quantity}\n`
      message += `   Precio unitario: $${price.toLocaleString()}\n`
      message += `   Subtotal: $${(price * item.quantity).toLocaleString()}\n\n`
    })
    
    message += `Total: $${getCartTotal().toLocaleString()}\n\n`
    message += "¿Podrías confirmar disponibilidad y forma de pago?"
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleClearCart = () => {
    if (confirm("¿Estás seguro de vaciar el carrito?")) {
      clearCart()
      loadCartItems()
    }
  }

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Galeria Espiritual"

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <Navigation />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center py-16"
          >
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-6">Agrega algunos cuarzos para comenzar tu pedido</p>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors"
              >
                Ver Catálogo
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Items del carrito */}
            <div className="space-y-4">
              {cartItems.map((item) => {
                const price = item.selectedVariant?.price || item.product.price
                const weight = item.selectedVariant?.weight || item.product.weight
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <div className="flex gap-4">
                      {/* Imagen */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.product.imageUrl || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Información */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.product.type === "collar"
                                    ? "bg-pink-100 text-pink-700"
                                    : item.product.type === "anillo"
                                      ? "bg-blue-100 text-blue-700"
                                      : item.product.type === "forma"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {item.product.type === "collar"
                                  ? "Collar"
                                  : item.product.type === "anillo"
                                    ? "Anillo"
                                    : item.product.type === "forma"
                                      ? "Forma"
                                      : "En Bruto"}
                              </span>
                              {weight && <span>({weight}g)</span>}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Controles de cantidad */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-medium min-w-[2rem] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Precio */}
                          <div className="text-right">
                            <div className="text-lg font-bold text-purple-600">
                              ${(price * item.quantity).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              ${price.toLocaleString()} c/u
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Resumen y botón de pedido */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold text-gray-800">Total</span>
                <span className="text-3xl font-bold text-purple-600">
                  ${getCartTotal().toLocaleString()}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsAppOrder}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Hacer Pedido por WhatsApp
              </motion.button>

              <p className="text-center text-gray-500 text-sm mt-3">
                Te redirigiremos a WhatsApp con el resumen de tu pedido
              </p>
            </motion.div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
