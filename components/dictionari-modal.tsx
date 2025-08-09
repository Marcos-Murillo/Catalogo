"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { db, isFirebaseAvailable, type Product } from "@/lib/firebase"
import { X, DollarSign, Plus } from 'lucide-react'

interface AddVariantModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  onVariantAdded: () => void
}

export function AddVariantModal({ product, isOpen, onClose, onVariantAdded }: AddVariantModalProps) {
  const [formData, setFormData] = useState({
    weight: 0,
    price: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.weight || !formData.price) {
      setError("Por favor completa todos los campos")
      return
    }

    // Verificar que no exista ya una variante con este gramaje
    const existingVariant = product.variants?.find(v => v.weight === formData.weight)
    if (existingVariant) {
      setError(`Ya existe una variante con ${formData.weight}g`)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (isFirebaseAvailable && db) {
        // Crear nueva variante en subcolección
        await addDoc(collection(db, "products", product.id, "variants"), {
          weight: formData.weight,
          price: Number.parseFloat(formData.price),
          createdAt: Timestamp.now(),
        })
      }

      onVariantAdded()
      setFormData({ weight: 0, price: "" })
      onClose()
    } catch (error: any) {
      console.error("Error al agregar variante:", error)
      setError("Error al agregar la variante")
    } finally {
      setIsLoading(false)
    }
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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Añadir Gramaje</h3>
              <button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 p-2 rounded-xl transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 text-sm">
                Agregando variante para: <span className="font-medium">{product.name}</span>
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gramaje</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formData.weight || ""}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="200"
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">g</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="60000"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {isLoading ? "Agregando..." : "Agregar"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
