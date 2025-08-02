"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { Product } from "@/lib/firebase"
import Image from "next/image"
import { X, MessageCircle } from "lucide-react"

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  if (!product) return null

  const handleWhatsAppOrder = () => {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573123456789"
    const message = `¡Hola! Me interesa el cuarzo "${product.name}" por $${product.price.toLocaleString()}. ¿Podrías darme más información?`
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all shadow-lg z-10"
            >
              <X className="w-5 h-5 text-gray-700" />
            </motion.button>

            <div className="flex flex-col md:flex-row h-full">
              {/* Imagen a la izquierda */}
              <div className="md:w-1/2 relative">
                <div className="aspect-square md:h-full relative overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                  <Image
                    src={
                      product.imageUrl ||
                      "/placeholder.svg?height=600&width=600&query=beautiful crystal quartz gemstone" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                </div>
              </div>

              {/* Información a la derecha */}
              <div className="md:w-1/2 p-8 flex flex-col justify-between relative">
                <div>
                  {/* Header */}
                  <div className="mb-6">
                    {/* Badge del tipo */}
                    <div className="mb-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
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

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{product.name}</h2>
                    <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-4">
                      ${product.price.toLocaleString()}
                    </div>
                  </div>

                  {/* Descripción completa */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Descripción</h3>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">{product.description}</p>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="space-y-4 mb-8">
                    <div className="bg-purple-50 rounded-xl p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">✨ Propiedades Espirituales</h4>
                      <p className="text-purple-700 text-sm">
                        Este cuarzo ha sido cuidadosamente seleccionado por sus propiedades energéticas únicas.
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4">
                      <h4 className="font-semibold text-green-800 mb-2">🌿 100% Natural</h4>
                      <p className="text-green-700 text-sm">Producto auténtico y natural, sin tratamientos químicos.</p>
                    </div>
                  </div>
                </div>

                {/* Botón de WhatsApp en la esquina inferior derecha */}
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWhatsAppOrder}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-6 rounded-2xl flex items-center gap-3 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Hacer Pedido
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
