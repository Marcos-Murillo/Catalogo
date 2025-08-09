"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingCart, Menu, X, BookOpen, Settings } from 'lucide-react'
import { getCartItemsCount } from "@/lib/firebase"
import { usePathname } from "next/navigation"

export function Navigation() {
  const [cartCount, setCartCount] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Actualizar contador del carrito
    const updateCartCount = () => {
      setCartCount(getCartItemsCount())
    }

    updateCartCount()
    window.addEventListener("cartUpdated", updateCartCount)

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount)
    }
  }, [])

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Galeria Espiritual"
  const appDescription = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Cuarzos y cristales naturales"

  const navItems = [
    { href: "/", label: "Catálogo", icon: null },
    { href: "/diccionario", label: "Diccionario", icon: BookOpen },
  ]

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
                <div className="w-full h-full bg-transparent rounded-lg flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Logo Galeria Espiritual"
                    width={38}
                    height={38}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{appName}</h1>
                <p className="text-sm text-gray-600">{appDescription}</p>
              </div>
            </motion.div>
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-colors ${
                    isActive 
                      ? "bg-purple-100 text-purple-700" 
                      : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              )
            })}
            
            {/* Carrito */}
            <Link href="/carrito">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-2 rounded-xl transition-colors ${
                  pathname === "/carrito"
                    ? "bg-purple-600 text-white"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </motion.div>
            </Link>
          </nav>

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
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-colors ${
                      isActive 
                        ? "bg-purple-100 text-purple-700" 
                        : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {item.label}
                  </Link>
                )
              })}
              
              <Link 
                href="/carrito"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-colors ${
                  pathname === "/carrito"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="w-4 h-4" />
                Carrito {cartCount > 0 && `(${cartCount})`}
              </Link>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}
