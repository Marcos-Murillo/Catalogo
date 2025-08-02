"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db, type Product, mockProducts, isFirebaseAvailable } from "@/lib/firebase"
import { ProductCard } from "@/components/product-card"
import { ProductModal } from "@/components/product-modal"
import { Sparkles, Plus } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      if (isFirebaseAvailable && db) {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Product[]
        setProducts(productsData)
      } else {
        // Usar datos de ejemplo cuando Firebase no esté disponible
        console.log("Usando datos de ejemplo - Firebase no configurado")
        setProducts(mockProducts)
      }
    } catch (error) {
      console.error("Error al cargar productos:", error)
      // Fallback a datos de ejemplo en caso de error
      setProducts(mockProducts)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()

    // Escuchar cambios en localStorage para actualizar cuando se agregue un producto
    const handleStorageChange = () => {
      fetchProducts()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("productAdded", fetchProducts)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("productAdded", fetchProducts)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Galeria Espiritual</h1>
                <p className="text-sm text-gray-600">Cuarzos y cristales naturales</p>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Descubre la Magia de los{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Cuarzos</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encuentra el cristal perfecto para tu energía y bienestar espiritual
          </p>
        </motion.div>

        {/* Products Grid - 2 columnas en móvil, más en desktop */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No hay productos aún</h3>
            <p className="text-gray-500 mb-6">Comienza agregando tu primer cuarzo al catálogo</p>
            <Link href="/admin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl font-medium"
              >
                Agregar Primer Producto
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
            ))}
          </motion.div>
        )}
      </main>

      {/* Product Modal */}
      <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  )
}
