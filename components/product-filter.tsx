"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, X } from "lucide-react"
import { productTypes } from "@/lib/firebase"

interface ProductFiltersProps {
  searchTerm: string
  selectedType: string
  onSearchChange: (search: string) => void
  onTypeChange: (type: string) => void
  onClearFilters: () => void
  totalProducts: number
  filteredCount: number
}

export function ProductFilters({
  searchTerm,
  selectedType,
  onSearchChange,
  onTypeChange,
  onClearFilters,
  totalProducts,
  filteredCount,
}: ProductFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const hasActiveFilters = searchTerm || selectedType !== "all"

  return (
    <div className="mb-8">
      {/* Barra de búsqueda principal */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por nombre del cuarzo o producto..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm text-lg"
        />
      </div>

      {/* Filtros y resultados */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Botón de filtros y tipos */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              isFilterOpen || selectedType !== "all"
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </motion.button>

          {/* Filtros rápidos de tipo */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => onTypeChange("all")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedType === "all" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>
            {productTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => onTypeChange(type.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedType === type.value
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contador de resultados y limpiar filtros */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {filteredCount} de {totalProducts} productos
          </span>

          {hasActiveFilters && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClearFilters}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </motion.button>
          )}
        </div>
      </div>

      {/* Panel de filtros expandible (móvil) */}
      {isFilterOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="sm:hidden mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
        >
          <h3 className="font-medium text-gray-800 mb-3">Tipo de Producto</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onTypeChange("all")
                setIsFilterOpen(false)
              }}
              className={`p-3 rounded-xl text-sm font-medium transition-colors ${
                selectedType === "all" ? "bg-purple-100 text-purple-700" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              Todos
            </button>
            {productTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => {
                  onTypeChange(type.value)
                  setIsFilterOpen(false)
                }}
                className={`p-3 rounded-xl text-sm font-medium transition-colors ${
                  selectedType === type.value
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Filtros activos */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex flex-wrap gap-2"
        >
          {searchTerm && (
            <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              <span>Búsqueda: "{searchTerm}"</span>
              <button onClick={() => onSearchChange("")} className="hover:bg-blue-200 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {selectedType !== "all" && (
            <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
              <span>Tipo: {productTypes.find((t) => t.value === selectedType)?.label}</span>
              <button onClick={() => onTypeChange("all")} className="hover:bg-purple-200 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
