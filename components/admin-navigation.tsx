"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Plus, BookOpen, Menu, X } from 'lucide-react'
import { usePathname } from "next/navigation"

interface AdminNavigationProps {
  showAddForm: boolean
  onToggleAddForm: () => void
}

export function AdminNavigation({ showAddForm, onToggleAddForm }: AdminNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Galeria Espiritual"

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y nombre */}
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 p-1">
                <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Logo Galeria Espiritual"
                    width={32}
                    height={32}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
                <p className="text-sm text-gray-600">{appName}</p>
              </div>
            </motion.div>
          </Link>

          {/* Navegación desktop */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleAddForm}
              className="bg-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {showAddForm ? "Ver Productos" : "Agregar Cuarzo"}
            </motion.button>
            
            <Link href="/admin-Rosita/diccionario">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-700 border border-purple-200 px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-purple-50 transition-colors"
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                Diccionario
              </motion.button>
            </Link>

            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Ver Catálogo
              </motion.button>
            </Link>
          </div>

          {/* Botón menú móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 py-4 border-t border-gray-200"
          >
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  onToggleAddForm()
                  setIsMenuOpen(false)
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-600 text-white font-medium"
              >
                <Plus className="w-4 h-4" />
                {showAddForm ? "Ver Productos" : "Agregar Cuarzo"}
              </button>
              
              <Link 
                href="/admin/diccionario"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-purple-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="w-4 h-4" />
                Diccionario
              </Link>

              <Link 
                href="/"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Ver Catálogo
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  )
}
