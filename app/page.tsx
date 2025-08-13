"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db, type Product, mockProducts, isFirebaseAvailable } from "@/lib/firebase"
import { ProductCard } from "@/components/product-card"
import { ProductModal } from "@/components/product-modal"
import Link from "next/link"
import { ProductFilters } from "@/components/product-filters"
import { Search } from "lucide-react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { AddVariantModal } from "@/components/add-variant-modal"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { RecommendedProducts } from "@/components/recommended-products"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedVariantProduct, setSelectedVariantProduct] = useState<Product | null>(null)

  const searchParams = useSearchParams()

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || product.type === selectedType

    return matchesSearch && matchesType
  })

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedType("all")
  }

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
        console.log("Usando datos de ejemplo - Firebase no configurado")
        setProducts(mockProducts)
      }
    } catch (error) {
      console.error("Error al cargar productos:", error)
      setProducts(mockProducts)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()

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

  useEffect(() => {
    const q = searchParams?.get("q") || ""
    if (q) setSearchTerm(q)
  }, [searchParams])

  useEffect(() => {
    // Listener para abrir modal de añadir variante
    const handleOpenAddVariant = (event: any) => {
      const product = event.detail
      setSelectedVariantProduct(product)
    }

    // Listener para notificaciones del carrito
    const handleCartItemAdded = (event: any) => {
      const { productName, quantity, weight } = event.detail
      const weightText = weight ? ` (${weight}g)` : ""
      // Aquí podrías mostrar una notificación toast
      console.log(`✅ ${quantity}x ${productName}${weightText} agregado al carrito`)
    }

    window.addEventListener("openAddVariant", handleOpenAddVariant)
    window.addEventListener("cartItemAdded", handleCartItemAdded)

    return () => {
      window.removeEventListener("openAddVariant", handleOpenAddVariant)
      window.removeEventListener("cartItemAdded", handleCartItemAdded)
    }
  }, [])

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Galeria Espiritual"
  const appDescription = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Conexión para la vida"

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <Navigation />

      {/* Main Content - Se ajusta cuando el modal está abierto pero mantiene interactividad */}
      <main
        className={`transition-all duration-300 ${
          selectedProduct ? "max-w-5xl mr-auto ml-4 sm:ml-6 lg:ml-8 pr-4" : "max-w-7xl mx-auto"
        } px-4 sm:px-6 lg:px-8 py-8`}
      >
        {/* Filtros de búsqueda */}
        {!isLoading && products.length > 0 && (
          <ProductFilters
            searchTerm={searchTerm}
            selectedType={selectedType}
            onSearchChange={setSearchTerm}
            onTypeChange={setSelectedType}
            onClearFilters={clearFilters}
            totalProducts={products.length}
            filteredCount={filteredProducts.length}
          />
        )}

        {/* Hero Section - solo mostrar si no hay filtros activos */}
        {!searchTerm && selectedType === "all" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Descubre la Magia de los{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Cuarzos
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Encuentra el cristal perfecto para tu energía y bienestar espiritual
            </p>
          </motion.div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div
            className={`grid gap-4 sm:gap-6 ${selectedProduct ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}
          >
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            {products.length === 0 ? (
              <>
                <div className="relative w-16 h-16 mx-auto mb-4 opacity-40">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain grayscale" />
                </div>
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
              </>
            ) : (
              <>
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-600 mb-2">No se encontraron productos</h3>
                <p className="text-gray-500 mb-6">Intenta con otros términos de búsqueda o filtros</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="bg-purple-600 text-white px-6 py-3 rounded-xl font-medium"
                >
                  Limpiar Filtros
                </motion.button>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            layout
            className={`grid gap-4 sm:gap-6 transition-all duration-300 ${
              selectedProduct
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {/* NO pasar showAddStoneButton=true aquí, solo en admin */}
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
            ))}
          </motion.div>
        )}

        {/* Productos recomendados - solo mostrar si hay productos y no hay filtros activos */}
        {!isLoading && products.length > 0 && !searchTerm && selectedType === "all" && !selectedProduct && (
          <RecommendedProducts products={products} onProductClick={setSelectedProduct} />
        )}
      </main>

      {/* Product Modal */}
      <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />

      {/* Modal para añadir variante */}
      <AddVariantModal
        product={selectedVariantProduct}
        isOpen={!!selectedVariantProduct}
        onClose={() => setSelectedVariantProduct(null)}
        onVariantAdded={fetchProducts}
      />

      {/* Footer - siempre visible */}
      <Footer />
    </div>
  )
}
