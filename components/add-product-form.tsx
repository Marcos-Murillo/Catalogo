"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { collection, addDoc, Timestamp } from "firebase/firestore"
// Importar los tipos de productos
import { db, isFirebaseAvailable, uploadImageToImgBB, productTypes } from "@/lib/firebase"
import { Upload, DollarSign, Type, FileText, CheckCircle, AlertCircle, ImageIcon, Heart, Weight } from "lucide-react"
import Image from "next/image"

export function AddProductForm() {
  // Actualizar el estado del formulario para incluir los nuevos campos
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    type: "bruto" as "collar" | "anillo" | "forma" | "bruto",
    spiritualProperties: "",
    // Campos para piedras en bruto (nueva lógica)
    minWeight: "",
    maxWeight: "",
    pricePerGram: "",
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
    if (!image || !formData.name || !formData.description || !formData.spiritualProperties) {
      setError("Por favor completa todos los campos obligatorios")
      return
    }

    // Validaciones específicas por tipo
    if (formData.type === "bruto") {
      if (!formData.minWeight || !formData.maxWeight || !formData.pricePerGram) {
        setError("Para piedras en bruto, completa el rango de gramaje y precio por gramo")
        return
      }
      if (Number(formData.minWeight) >= Number(formData.maxWeight)) {
        setError("El gramaje máximo debe ser mayor al mínimo")
        return
      }
      if (Number(formData.minWeight) < 1) {
        setError("El gramaje mínimo debe ser al menos 1 gramo")
        return
      }
    } else {
      if (!formData.price) {
        setError("Por favor ingresa el precio del producto")
        return
      }
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

        const productData: any = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          spiritualProperties: formData.spiritualProperties.trim(),
          type: formData.type,
          imageUrl,
          createdAt: Timestamp.now(),
        }

        // Lógica específica por tipo
        if (formData.type === "bruto") {
          productData.minWeight = Number(formData.minWeight)
          productData.maxWeight = Number(formData.maxWeight)
          productData.pricePerGram = Number(formData.pricePerGram)
          productData.price = Number(formData.pricePerGram) // precio base por gramo
        } else {
          productData.price = Number.parseFloat(formData.price)
        }

        const docRef = await addDoc(collection(db, "products"), productData)
        console.log("✅ Producto agregado con ID:", docRef.id)
      }

      setUploadProgress("¡Completado!")
      setSuccess(true)

      // Disparar evento para actualizar la página principal
      window.dispatchEvent(new Event("productAdded"))

      // Limpiar formulario
      setFormData({
        name: "",
        price: "",
        description: "",
        type: "bruto",
        spiritualProperties: "",
        minWeight: "",
        maxWeight: "",
        pricePerGram: "",
      })
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

        {/* Tipo de Producto */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Tipo de Producto *</label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as "collar" | "anillo" | "forma" | "bruto" })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            required
          >
            {productTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Campos específicos para piedras en bruto */}
        {formData.type === "bruto" ? (
          <div className="space-y-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Weight className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Configuración de Piedra en Bruto</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Gramaje mínimo *</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    value={formData.minWeight}
                    onChange={(e) => setFormData({ ...formData, minWeight: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="3"
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">g</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Gramaje máximo *</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    value={formData.maxWeight}
                    onChange={(e) => setFormData({ ...formData, maxWeight: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="20"
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">g</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Precio por gramo *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.pricePerGram}
                  onChange={(e) => setFormData({ ...formData, pricePerGram: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="6000"
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">/g</span>
              </div>
            </div>

            {formData.minWeight && formData.maxWeight && formData.pricePerGram && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-xl border border-green-300 shadow-sm"
              >
                <h4 className="font-medium text-green-800 mb-2">💰 Rango de precios calculado:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-2 bg-green-100 rounded-lg">
                    <p className="text-green-600 font-medium">Precio mínimo</p>
                    <p className="text-green-800 font-bold text-lg">
                      ${(Number(formData.minWeight) * Number(formData.pricePerGram)).toLocaleString()}
                    </p>
                    <p className="text-green-600 text-xs">({formData.minWeight}g)</p>
                  </div>
                  <div className="text-center p-2 bg-green-100 rounded-lg">
                    <p className="text-green-600 font-medium">Precio máximo</p>
                    <p className="text-green-800 font-bold text-lg">
                      ${(Number(formData.maxWeight) * Number(formData.pricePerGram)).toLocaleString()}
                    </p>
                    <p className="text-green-600 text-xs">({formData.maxWeight}g)</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          /* Precio para otros tipos de productos */
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
                placeholder="45000"
                required
              />
            </div>
          </div>
        )}

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
              placeholder="Describe las características físicas del cuarzo..."
              required
            />
          </div>
        </div>

        {/* Propiedades Espirituales */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Propiedades Espirituales *</label>
          <div className="relative">
            <Heart className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <textarea
              value={formData.spiritualProperties}
              onChange={(e) => setFormData({ ...formData, spiritualProperties: e.target.value })}
              rows={3}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Describe las propiedades energéticas y espirituales del cuarzo..."
              required
            />
          </div>
        </div>

        {/* Información del servicio */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Almacenamiento de Imágenes</span>
          </div>
          <p className="text-blue-700 text-xs">Las imágenes se suben a ImgBB (servicio gratuito y confiable)</p>
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
