"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore"
import { db, type Product, mockProducts, isFirebaseAvailable } from "@/lib/firebase"
import { AddProductForm } from "@/components/add-product-form"
import { EditProductModal } from "@/components/edit-product-modal"
import { AdminNavigation } from "@/components/admin-navigation"
import { Trash2, Edit } from 'lucide-react'
import Image from "next/image"

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

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
  }, [])

  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Estás seguro de eliminar "${product.name}"?`)) return

    try {
      if (isFirebaseAvailable && db) {
        await deleteDoc(doc(db, "products", product.id))
        setProducts(products.filter((p) => p.id !== product.id))
        alert("Producto eliminado exitosamente")
      } else {
        setProducts(products.filter((p) => p.id !== product.id))
        alert("Producto eliminado (modo demo)")
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error)
      alert("Error al eliminar el producto")
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
  }

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
    setEditingProduct(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header con navegación específica de admin */}
      <AdminNavigation 
        showAddForm={showAddForm} 
        onToggleAddForm={() => setShowAddForm(!showAddForm)} 
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showAddForm ? (
          <AddProductForm />
        ) : (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Productos en el Catálogo</h2>
              <p className="text-gray-600">Gestiona todos los cuarzos de tu inventario</p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl h-64 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <div className="relative w-16 h-16 mx-auto mb-4 opacity-40">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain grayscale" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-2">No hay productos</h3>
                <p className="text-gray-500 mb-6">Comienza agregando tu primer cuarzo</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddForm(true)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-xl font-medium"
                >
                  Agregar Primer Producto
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="p-6">
                      <div className="mb-2">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            product.type === "collar"
                              ? "bg-pink-100 text-pink-700"
                              : product.type === "anillo"
                                ? "bg-blue-100 text-blue-700"
                                : product.type === "forma"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {product.type === "collar"
                            ? "Collar"
                            : product.type === "anillo"
                              ? "Anillo"
                              : product.type === "forma"
                                ? "Forma"
                                : "En Bruto"}
                        </span>
                      </div>

                      <h3 className="font-bold text-xl text-gray-800 mb-2">{product.name}</h3>
                      <p className="text-2xl font-bold text-purple-600 mb-3">${product.price.toLocaleString()}</p>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>

                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(product)}
                          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(product)}
                          className="flex-1 bg-red-500 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={handleUpdateProduct}
        />
      )}
    </div>
  )
}
