"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { db, isFirebaseAvailable, uploadImageToImgBB } from "@/lib/firebase"
import { Upload, DollarSign, Type, FileText, CheckCircle, AlertCircle, ImageIcon } from "lucide-react"
import Image from "next/image"

export function AddProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setError(null)
      console.log("📁 Archivo seleccionado:", file.name, file.size, "bytes")

      // Verificar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen es muy grande. Máximo 5MB.")
        return
      }

      // Verificar tipo
      if (!file.type.startsWith("image/")) {
        setError("Por favor selecciona un archivo de imagen válido.")
        return
      }

      setImage(file)

      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!image || !formData.name || !formData.price || !formData.description) {
      setError("Por favor completa todos los campos")
      return
    }

    setIsLoading(true)
    setError(null)
    setUploadProgress("Preparando imagen...")

    try {
      console.log("🚀 Iniciando subida del producto...")

      // Subir imagen a ImgBB
      setUploadProgress("Subiendo imagen a ImgBB...")
      const imageUrl = await uploadImageToImgBB(image)
      console.log("✅ Imagen subida a ImgBB:", imageUrl)

      if (isFirebaseAvailable && db) {
        // Guardar producto en Firestore
        setUploadProgress("Guardando producto en base de datos...")
        const productData = {
          name: formData.name.trim(),
          price: Number.parseFloat(formData.price),
          description: formData.description.trim(),
          imageUrl,
          createdAt: Timestamp.now(),
        }

        const docRef = await addDoc(collection(db, "products"), productData)
        console.log("✅ Producto agregado con ID:", docRef.id)
      }

      setUploadProgress("¡Completado!")
      setSuccess(true)

      // Disparar evento para actualizar la página principal
      window.dispatchEvent(new Event("productAdded"))

      // Limpiar formulario
      setFormData({ name: "", price: "", description: "" })
      setImage(null)
      setImagePreview(null)

      // Redirigir después de 3 segundos
      setTimeout(() => {
        window.location.href = "/"
      }, 3000)
    } catch (error: any) {
      console.error("❌ Error completo:", error)

      let errorMessage = "Error desconocido al agregar el producto"

      if (error.message.includes("ImgBB")) {
        errorMessage = "Error al subir la imagen. Intenta con otra imagen."
      } else if (error.message.includes("Firestore")) {
        errorMessage = "Error al guardar en la base de datos."
      } else if (error.message) {
        errorMessage = error.message
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
      setUploadProgress("")
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 text-center"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Producto Agregado!</h2>
        <p className="text-gray-600 mb-4">El cuarzo se ha agregado exitosamente al catálogo</p>
        <p className="text-sm text-gray-500">Redirigiendo al catálogo...</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Agregar Nuevo Cuarzo</h2>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </motion.div>
      )}

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
        {/* Upload de imagen */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Foto del Cuarzo *</label>

          {imagePreview ? (
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
              <button
                type="button"
                onClick={() => {
                  setImage(null)
                  setImagePreview(null)
                  setError(null)
                }}
                className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-purple-300 rounded-2xl cursor-pointer hover:border-purple-400 transition-colors bg-purple-50">
              <Upload className="w-12 h-12 text-purple-400 mb-4" />
              <span className="text-purple-600 font-medium">Toca para subir foto</span>
              <span className="text-purple-400 text-sm mt-2">JPG, PNG (máx. 5MB)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Nombre */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Nombre del Cuarzo *</label>
          <div className="relative">
            <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ej: Cuarzo Rosa Natural"
              required
            />
          </div>
        </div>

        {/* Precio */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Precio *</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              min="0"
              step="1000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0"
              required
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Descripción *</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Describe las propiedades y características del cuarzo..."
              required
            />
          </div>
        </div>

        {/* Información del servicio */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Almacenamiento de Imágenes</span>
          </div>
          <p className="text-green-700 text-xs">Las imágenes se suben a ImgBB (servicio gratuito y confiable)</p>
        </div>

        {/* Botón de envío */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? uploadProgress || "Agregando..." : "Agregar Cuarzo"}
        </motion.button>
      </form>
    </motion.div>
  )
}
