"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db, isFirebaseAvailable, type DictionaryEntry, mockDictionaryEntries } from "@/lib/firebase"
import Image from "next/image"
import Link from "next/link"
import { DictionaryModal } from "@/components/dictionary-modal"
import { Plus } from 'lucide-react'
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function DiccionarioPage() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState<DictionaryEntry | null>(null)

  const fetchEntries = async () => {
    try {
      if (isFirebaseAvailable && db) {
        const q = query(collection(db, "dictionary"), orderBy("name", "asc"))
        const snap = await getDocs(q)
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.() || new Date(),
        })) as DictionaryEntry[]
        setEntries(data)
      } else {
        setEntries(mockDictionaryEntries)
      }
    } catch (e) {
      console.error("Error cargando diccionario:", e)
      setEntries(mockDictionaryEntries)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Galeria Espiritual"
  const appDescription = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Cuarzos y cristales naturales"

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Navigation */}
      <Navigation />

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Diccionario de{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Cuarzos y Cristales
            </span>
          </h2>
          <p className="text-gray-600 text-lg">Explora propiedades, morfología y aplicaciones.</p>
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative w-16 h-16 mx-auto mb-4 opacity-40">
              <Image src="/logo.png" alt="Logo" fill className="object-contain grayscale" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No hay entradas aún</h3>
            <p className="text-gray-500">Agrega la primera entrada desde el Administrador</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {entries.map((e) => (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(e)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={e.imageUrl || "/placeholder.svg?height=400&width=400&query=quartz"}
                    alt={e.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-center">{e.name}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal */}
      <DictionaryModal entry={selected} isOpen={!!selected} onClose={() => setSelected(null)} />
    </div>
  )
}
