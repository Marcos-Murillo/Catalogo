"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { doc, updateDoc, Timestamp } from "firebase/firestore"
import { db, isFirebaseAvailable, uploadImageToImgBB, type Product } from "@/lib/firebase"
import { X, Upload, DollarSign, Type, FileText, Save } from "lucide-react"
import Image from "next/image"

interface EditProductModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  onUpdate: (product: Product) => void
}

export function EditProductModal({ product, isOpen, onClose, onUpdate }: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price.toString(),
    description: product.description,
  })
  const [newImage, setNewImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>("")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Verificar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen es muy grande. Máximo 5MB.")
        return
      }

      setNewImage(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.price || !formData.description) {
      alert("Por favor completa todos los campos")
      return
    }

    setIsLoading(true)

    try {
      let imageUrl = product.imageUrl

      // Si hay nueva imagen, subirla a ImgBB
      if (newImage) {
        setUploadProgress("Subiendo nueva imagen...")
        imageUrl = await uploadImageToImgBB(newImage)
        console.log("✅ Nueva imagen subida:", imageUrl)
      }

      if (isFirebaseAvailable && db) {
        // Actualizar documento en Firestore
        setUploadProgress("Actualizando producto...")
        await updateDoc(doc(db, "products", product.id), {
          name: formData.name.trim(),
          price: Number.parseFloat(formData.price),
          description: formData.description.trim(),
          imageUrl,
          updatedAt: Timestamp.now(),
        })
      }

      // Actualizar producto localmente
      const updatedProduct: Product = {
        ...product,
        name: formData.name.trim(),
        price: Number.parseFloat(formData.price),
        description: formData.description.trim(),
        imageUrl,
      }

      onUpdate(updatedProduct)
      alert("Producto actualizado exitosamente")
    } catch (error) {
      console.error("Error al actualizar producto:", error)
      alert("Error al actualizar el producto")
    } finally {
      setIsLoading(false)
      setUploadProgress("")
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
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Editar Cuarzo</h2>
                <button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 p-2 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isLoading && uploadProgress && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3"
                >
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  <p className="text-blue-700 text-sm">{uploadProgress}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Imagen actual y nueva */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Imagen del Cuarzo</label>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Imagen actual */}
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Imagen actual</p>
                      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                        <Image
                          src={product.imageUrl || "/placeholder.svg"}
                          alt="Actual"
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Nueva imagen o botón para subir */}
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Nueva imagen (opcional)</p>
                      {imagePreview ? (
                        <div className="relative aspect-square rounded-xl overflow-hidden">
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Nueva"
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setNewImage(null)
                              setImagePreview(null)
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 transition-colors bg-gray-50">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-gray-600 text-sm">Cambiar imagen</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Nombre */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nombre del Cuarzo</label>
                  <div className="relative">
                    <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Precio */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Precio</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
