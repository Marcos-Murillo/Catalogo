"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { db, isFirebaseAvailable, uploadImageToImgBB } from "@/lib/firebase"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { Navigation } from "@/components/navigation"

export default function AdminDictionaryPage() {
  const [form, setForm] = useState({
    name: "Aguamarina",
    // YACIMIENTOS
    locations:
      "Según los datos de mindat.org, existen más de 600 localidades documentadas, asociadas a este mineral.",
    mainCountries: "Los más importantes están en Estados Unidos, Brasil, Argentina y Pakistán",
    // MORFOLOGÍA
    crystalSystem: "Hexagonal",
    crystalHabit: "Prismático",
    // PROPIEDADES QUÍMICAS
    group: "Silicatos – ciclosilicatos",
    chemicalFormula: "Be3Al2Si6O18",
    solubility: "Nula",
    // PROPIEDADES FÍSICAS
    hardness: "7,5 – 8",
    fracture: "De desigual a concoidea",
    cleavage: "Imperfecta",
    streak: "Blanca",
    tenacity: "Frágil",
    specificGravity: "2,6 – 2,8",
    // PROPIEDADES ÓPTICAS
    color: "Verde azulado claro, azul celeste",
    luster: "Vítreo, mate",
    transparency: "Transparente a translúcido",
    luminescence: "Verde amarillenta",
    // Aplicaciones/Descripción
    applications: "Joyería fina; meditación; sanación energética; protección en viajes marítimos.",
    description:
      "Variedad del berilo, apreciada por su tono azul verdoso. Conocida como piedra de comunicación clara y valentía.",
  })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setStatus({ ok: false, message: "Selecciona un archivo de imagen válido" })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus({ ok: false, message: "La imagen es muy grande. Máximo 5MB." })
      return
    }
    setImage(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    setIsLoading(true)
    try {
      let imageUrl = "/placeholder.svg?height=600&width=900"
      if (image) {
        imageUrl = await uploadImageToImgBB(image)
      }

      if (isFirebaseAvailable && db) {
        await addDoc(collection(db, "dictionary"), {
          name: form.name.trim(),
          imageUrl,
          // Yacimientos
          locations: form.locations.trim(),
          mainCountries: form.mainCountries.trim(),
          // Morfología
          crystalSystem: form.crystalSystem.trim(),
          crystalHabit: form.crystalHabit.trim(),
          // Químicas
          group: form.group.trim(),
          chemicalFormula: form.chemicalFormula.trim(),
          solubility: form.solubility.trim(),
          // Físicas
          hardness: form.hardness.trim(),
          fracture: form.fracture.trim(),
          cleavage: form.cleavage.trim(),
          streak: form.streak.trim(),
          tenacity: form.tenacity.trim(),
          specificGravity: form.specificGravity.trim(),
          // Ópticas
          color: form.color.trim(),
          luster: form.luster.trim(),
          transparency: form.transparency.trim(),
          luminescence: form.luminescence.trim(),
          // Aplicaciones/Descripción
          applications: form.applications.trim(),
          description: form.description.trim(),
          createdAt: Timestamp.now(),
        })
        setStatus({ ok: true, message: "Entrada de diccionario agregada correctamente" })
      } else {
        setStatus({
          ok: true,
          message: "Entrada agregada (modo demo). Configura Firebase para persistencia real.",
        })
      }

      setImage(null)
      setImagePreview(null)
    } catch (err: any) {
      console.error("Error al guardar entrada:", err)
      setStatus({ ok: false, message: err?.message || "Error al guardar la entrada" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <Navigation />

      {/* Form */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {status && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              status.ok ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
            }`}
          >
            {status.ok ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <p className={status.ok ? "text-green-800" : "text-red-800"}>{status.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del mineral</label>
            {imagePreview ? (
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
                <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null)
                    setImagePreview(null)
                  }}
                  className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                >
                  <span className="sr-only">Eliminar</span>×
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-[16/9] border-2 border-dashed border-purple-300 rounded-2xl cursor-pointer hover:border-purple-400 transition-colors bg-purple-50">
                <Upload className="w-10 h-10 text-purple-400 mb-3" />
                <span className="text-purple-600 font-medium">Toca para subir imagen</span>
                <span className="text-purple-400 text-sm mt-1">JPG/PNG (máx. 5MB)</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>

          {/* Datos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            {/* Yacimientos */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Yacimientos (descripción)</label>
              <textarea
                value={form.locations}
                onChange={(e) => setForm({ ...form, locations: e.target.value })}
                rows={3}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Países principales</label>
              <input
                type="text"
                value={form.mainCountries}
                onChange={(e) => setForm({ ...form, mainCountries: e.target.value })}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Morfología y Químicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Morfología</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sistema cristalino</label>
                <input
                  type="text"
                  value={form.crystalSystem}
                  onChange={(e) => setForm({ ...form, crystalSystem: e.target.value })}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hábito cristalino</label>
                <input
                  type="text"
                  value={form.crystalHabit}
                  onChange={(e) => setForm({ ...form, crystalHabit: e.target.value })}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Propiedades químicas</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Grupo</label>
                <input
                  type="text"
                  value={form.group}
                  onChange={(e) => setForm({ ...form, group: e.target.value })}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fórmula química</label>
                <input
                  type="text"
                  value={form.chemicalFormula}
                  onChange={(e) => setForm({ ...form, chemicalFormula: e.target.value })}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Solubilidad</label>
                <input
                  type="text"
                  value={form.solubility}
                  onChange={(e) => setForm({ ...form, solubility: e.target.value })}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Físicas y Ópticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Propiedades físicas</h3>
              {[
                ["Dureza", "hardness"],
                ["Fractura", "fracture"],
                ["Exfoliación", "cleavage"],
                ["Raya", "streak"],
                ["Tenacidad", "tenacity"],
                ["Peso específico", "specificGravity"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700">{label}</label>
                  <input
                    type="text"
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value } as any)}
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Propiedades ópticas</h3>
              {[
                ["Color", "color"],
                ["Brillo", "luster"],
                ["Transparencia", "transparency"],
                ["Luminiscencia", "luminescence"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700">{label}</label>
                  <input
                    type="text"
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value } as any)}
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Aplicaciones y Descripción */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Aplicaciones</label>
              <textarea
                rows={5}
                value={form.applications}
                onChange={(e) => setForm({ ...form, applications: e.target.value })}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Guardando..." : "Guardar entrada"}
          </motion.button>
        </form>
      </main>
    </div>
  )
}
