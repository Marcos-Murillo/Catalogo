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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3"
          onClick={onClose}
        >
          {/* VERSIÓN MÓVIL */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="md:hidden bg-white rounded-2xl w-full max-w-sm max-h-[90vh] overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar móvil */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all shadow-lg z-10"
            >
              <X className="w-4 h-4 text-gray-700" />
            </motion.button>

            {/* Imagen arriba - móvil */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
              <Image
                src={
                  product.imageUrl ||
                  "/placeholder.svg?height=400&width=400&query=beautiful crystal quartz gemstone" ||
                  "/placeholder.svg"
                }
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Contenido compacto - móvil */}
            <div className="p-4 space-y-3">
              {/* Badge y título compacto */}
              <div>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${
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
                <h2 className="text-lg font-bold text-gray-800 leading-tight">{product.name}</h2>
                <div className="text-xl font-bold text-purple-600">${product.price.toLocaleString()}</div>
              </div>

              {/* Descripción compacta */}
              <div>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{product.description}</p>
              </div>

              {/* Info adicional compacta */}
              <div className="space-y-2">
                <div className="bg-purple-50 rounded-lg p-2">
                  <h4 className="font-medium text-purple-800 text-xs mb-1">✨ Propiedades Espirituales</h4>
                  <p className="text-purple-700 text-xs">Seleccionado por sus propiedades energéticas únicas.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-2">
                  <h4 className="font-medium text-green-800 text-xs mb-1">🌿 100% Natural</h4>
                  <p className="text-green-700 text-xs">Producto auténtico, sin tratamientos químicos.</p>
                </div>
              </div>

              {/* Botón WhatsApp móvil */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsAppOrder}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                Hacer Pedido
              </motion.button>
            </div>
          </motion.div>

          {/* VERSIÓN DESKTOP */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="hidden md:block bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar desktop */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all shadow-lg z-10"
            >
              <X className="w-5 h-5 text-gray-700" />
            </motion.button>

            <div className="flex h-full">
              {/* Imagen izquierda - desktop */}
              <div className="w-1/2 relative">
                <div className="h-full relative overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                  <Image
                    src={
                      product.imageUrl ||
                      "/placeholder.svg?height=600&width=600&query=beautiful crystal quartz gemstone" ||
                      "/placeholder.svg"
                    }
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                </div>
              </div>

              {/* Información derecha - desktop */}
              <div className="w-1/2 p-8 flex flex-col justify-between">
                <div>
                  {/* Header desktop */}
                  <div className="mb-6">
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

                    <h2 className="text-4xl font-bold text-gray-800 mb-3">{product.name}</h2>
                    <div className="text-4xl font-bold text-purple-600 mb-4">${product.price.toLocaleString()}</div>
                  </div>

                  {/* Descripción desktop */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Descripción</h3>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">{product.description}</p>
                    </div>
                  </div>

                  {/* Información adicional desktop */}
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

                {/* Botón WhatsApp desktop */}
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
