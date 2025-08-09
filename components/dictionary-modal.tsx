"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { DictionaryEntry } from "@/lib/firebase"
import Image from "next/image"
import { X, ArrowRight } from 'lucide-react'

interface DictionaryModalProps {
  entry: DictionaryEntry | null
  isOpen: boolean
  onClose: () => void
}

export function DictionaryModal({ entry, isOpen, onClose }: DictionaryModalProps) {
  if (!entry) return null

  const goToCatalogWithFilter = () => {
    const url = `/?q=${encodeURIComponent(entry.name)}`
    window.location.href = url
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
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen superior a todo el ancho */}
            <div className="relative w-full h-64 md:h-80 bg-gradient-to-br from-purple-100 to-pink-100">
              <Image
                src={entry.imageUrl || "/placeholder.svg?height=600&width=900&query=cristal"}
                alt={entry.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1024px"
              />
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={onClose}
                  className="bg-white/90 hover:bg-white transition-colors p-2 rounded-xl shadow"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Contenido inferior con dos columnas: izq mayor (aplicaciones/descripcion), der ficha técnica */}
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{entry.name}</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Izquierda (ocupa 2/3) */}
                <div className="lg:col-span-2 space-y-6">
                  <section className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">Aplicaciones</h3>
                    <p className="text-purple-800 leading-relaxed">{entry.applications}</p>
                  </section>

                  <section className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Descripción</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {entry.description}
                    </p>
                  </section>
                </div>

                {/* Derecha (ficha técnica) */}
                <aside className="space-y-5">
                  <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-3">Yacimientos</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-500">Descripción</p>
                        <p className="text-gray-800">{entry.locations}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Principales países</p>
                        <p className="text-gray-800">{entry.mainCountries}</p>
                      </div>
                    </div>
                  </section>

                  <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-3">Morfología</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">Sistema</span>
                        <span className="text-gray-800">{entry.crystalSystem}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">Hábito</span>
                        <span className="text-gray-800">{entry.crystalHabit}</span>
                      </div>
                    </div>
                  </section>

                  <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-3">Propiedades químicas</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">Grupo</span>
                        <span className="text-gray-800">{entry.group}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">Fórmula</span>
                        <span className="text-gray-800">{entry.chemicalFormula}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">Solubilidad</span>
                        <span className="text-gray-800">{entry.solubility}</span>
                      </div>
                    </div>
                  </section>

                  <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-3">Propiedades físicas</h4>
                    <div className="space-y-2 text-sm">
                      <Row label="Dureza" value={entry.hardness} />
                      <Row label="Fractura" value={entry.fracture} />
                      <Row label="Exfoliación" value={entry.cleavage} />
                      <Row label="Raya" value={entry.streak} />
                      <Row label="Tenacidad" value={entry.tenacity} />
                      <Row label="Peso específico" value={entry.specificGravity} />
                    </div>
                  </section>

                  <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-3">Propiedades ópticas</h4>
                    <div className="space-y-2 text-sm">
                      <Row label="Color" value={entry.color} />
                      <Row label="Brillo" value={entry.luster} />
                      <Row label="Transparencia" value={entry.transparency} />
                      <Row label="Luminiscencia" value={entry.luminescence} />
                    </div>
                  </section>
                </aside>
              </div>

              {/* Botón al final */}
              <div className="mt-8 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={goToCatalogWithFilter}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-5 rounded-2xl flex items-center gap-2 shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Productos con este cuarzo
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 text-right">{value}</span>
    </div>
  )
}
