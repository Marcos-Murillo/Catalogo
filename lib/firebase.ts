import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Verificar si Firebase está configurado
const isFirebaseConfigured = Object.values(firebaseConfig).every((value) => value && value !== "undefined")

let app: FirebaseApp | undefined
let db: Firestore | undefined
let storage: FirebaseStorage | undefined

if (isFirebaseConfigured) {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
      db = getFirestore(app)
      storage = getStorage(app)
      console.log("✅ Firebase inicializado correctamente")
    } else {
      app = getApps()[0]
      db = getFirestore(app)
      storage = getStorage(app)
    }
  } catch (error) {
    console.error("❌ Error al inicializar Firebase:", error)
  }
} else {
  console.warn("⚠️ Firebase no está configurado - usando datos de ejemplo")
}

export { db, storage }

// Actualizar la interfaz Product con la nueva lógica
export interface Product {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
  type: "collar" | "anillo" | "forma" | "bruto"
  createdAt: Date
  spiritualProperties: string // Nuevo campo
  // Campos para piedras en bruto (nueva lógica)
  minWeight?: number // gramaje mínimo disponible
  maxWeight?: number // gramaje máximo disponible
  pricePerGram?: number // precio por gramo
  // Campos legacy (mantener compatibilidad)
  weight?: number
  variants?: ProductVariant[]
}

// Mantener interfaz de variantes para compatibilidad
export interface ProductVariant {
  id: string
  weight: number
  price: number
  createdAt: Date
}

// Nueva interfaz para el diccionario
export interface DictionaryEntry {
  id: string
  name: string
  imageUrl: string
  // Yacimientos
  locations: string
  mainCountries: string
  // Morfología
  crystalSystem: string
  crystalHabit: string
  // Propiedades químicas
  group: string
  chemicalFormula: string
  solubility: string
  // Propiedades físicas
  hardness: string
  fracture: string
  cleavage: string
  streak: string
  tenacity: string
  specificGravity: string
  // Propiedades ópticas
  color: string
  luster: string
  transparency: string
  luminescence: string
  // Aplicaciones y descripción
  applications: string
  description: string
  createdAt: Date
}

// Nueva interfaz para el carrito
export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  selectedWeight?: number // Para productos en bruto con nueva lógica
  selectedVariant?: ProductVariant // Mantener para compatibilidad
  addedAt: Date
}

// Actualizar los datos de ejemplo con la nueva lógica - CORREGIDO
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Cuarzo Rosa Natural",
    price: 300, // precio base por gramo
    description:
      "Hermoso cuarzo rosa natural que promueve el amor propio y la sanación emocional. Perfecto para meditación y equilibrio energético. Sus suaves tonos rosados transmiten paz y armonía.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    type: "bruto",
    spiritualProperties:
      "Promueve el amor propio, sanación emocional, paz interior y armonía. Ideal para trabajar el chakra del corazón y atraer relaciones amorosas.",
    minWeight: 2,
    maxWeight: 5,
    pricePerGram: 5000,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Amatista Uruguaya",
    price: 78000,
    description:
      "Amatista de alta calidad proveniente de Uruguay. Conocida por sus propiedades de protección espiritual y claridad mental. Su color púrpura intenso la convierte en una pieza única.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    type: "forma",
    spiritualProperties:
      "Protección espiritual, claridad mental, conexión con la intuición y transformación espiritual. Excelente para meditación y desarrollo psíquico.",
    createdAt: new Date("2024-01-14"),
  },
  {
    id: "3",
    name: "Collar de Cuarzo Transparente",
    price: 32000,
    description:
      "Collar elegante con cuarzo transparente puro, amplificador de energía universal. Ideal para uso diario y protección energética. Su claridad excepcional refleja la pureza de la energía.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    type: "collar",
    spiritualProperties:
      "Amplificación de energía, purificación, claridad mental y protección energética. Maestro sanador que potencia otras piedras.",
    createdAt: new Date("2024-01-13"),
  },
  {
    id: "4",
    name: "Anillo de Citrino Natural",
    price: 56000,
    description:
      "Anillo artesanal con citrino natural que atrae la abundancia y prosperidad. Conocido como la piedra del éxito y la manifestación. Su color dorado irradia energía positiva y vitalidad.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    type: "anillo",
    spiritualProperties:
      "Abundancia, prosperidad, éxito, manifestación y energía positiva. Estimula la creatividad y la confianza personal.",
    createdAt: new Date("2024-01-12"),
  },
  {
    id: "5",
    name: "Turmalina Negra",
    price: 6000, // precio por gramo
    description:
      "Poderosa piedra de protección que absorbe energías negativas y proporciona conexión a tierra. Esencial para la limpieza energética y protección del hogar.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    type: "bruto",
    spiritualProperties:
      "Protección contra energías negativas, conexión a tierra, limpieza energética y escudo psíquico. Ideal para espacios de trabajo y hogar.",
    minWeight: 3,
    maxWeight: 20,
    pricePerGram: 6000,
    createdAt: new Date("2024-01-11"),
  },
  {
    id: "6",
    name: "Collar de Aventurina Verde",
    price: 38000,
    description:
      "Collar de aventurina verde que promueve la suerte, prosperidad y crecimiento personal. Excelente para el chakra del corazón. Su energía suave fomenta la calma y el equilibrio emocional.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    type: "collar",
    spiritualProperties:
      "Suerte, prosperidad, crecimiento personal, calma emocional y equilibrio del chakra del corazón. Atrae oportunidades positivas.",
    createdAt: new Date("2024-01-10"),
  },
]

// Datos de ejemplo para el diccionario
export const mockDictionaryEntries: DictionaryEntry[] = [
  {
    id: "aguamarina-1",
    name: "Aguamarina",
    imageUrl: "/placeholder.svg?height=600&width=900",
    // YACIMIENTOS
    locations: "Según los datos de mindat.org, existen más de 600 localidades documentadas, asociadas a este mineral.",
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
    // Aplicaciones y descripción
    applications: "Joyería fina; meditación; sanación energética; protección en viajes marítimos.",
    description:
      "Variedad del berilo, apreciada por su tono azul verdoso. Conocida como piedra de comunicación clara y valentía.",
    createdAt: new Date(),
  },
]

export const isFirebaseAvailable = isFirebaseConfigured && !!db && !!storage

// Función para convertir imagen a base64 sin prefijo
export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remover el prefijo data:image/...;base64,
      const base64 = result.split(",")[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Función para redimensionar imagen
export const resizeImage = (file: File, maxWidth = 800, quality = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            })
            resolve(resizedFile)
          }
        },
        "image/jpeg",
        quality,
      )
    }

    img.src = URL.createObjectURL(file)
  })
}

// Función para subir imagen a ImgBB
export const uploadImageToImgBB = async (file: File): Promise<string> => {
  try {
    // Redimensionar imagen
    const resizedFile = await resizeImage(file, 800, 0.8)

    // Convertir a base64
    const base64Image = await convertImageToBase64(resizedFile)

    // Enviar a nuestra API route
    const response = await fetch("/api/upload-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: base64Image }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Error al subir imagen")
    }

    return data.url
  } catch (error) {
    console.error("Error al subir imagen:", error)
    throw error
  }
}

// Tipos de productos disponibles
export const productTypes = [
  { value: "collar", label: "Collar" },
  { value: "anillo", label: "Anillo" },
  { value: "forma", label: "Forma" },
  { value: "bruto", label: "En Bruto" },
  { value: "pulsera", label: "Pulsera" },
  { value: "rorado", label: "Rodado" },
] as const

// carrito 
export const getCartItems = (): CartItem[] => {
  if (typeof window === "undefined") return []
  const items = localStorage.getItem("cart")
  return items ? JSON.parse(items) : []
}

export const saveCartItems = (items: CartItem[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("cart", JSON.stringify(items))
  // Disparar evento para actualizar componentes
  window.dispatchEvent(new Event("cartUpdated"))
}

export const addToCart = (
  product: Product,
  quantity = 1,
  selectedWeight?: number,
  selectedVariant?: ProductVariant,
) => {
  const cartItems = getCartItems()

  // Para productos en bruto con nueva lógica, usar selectedWeight
  // Para compatibilidad, mantener selectedVariant
  const existingItemIndex = cartItems.findIndex(
    (item) =>
      item.productId === product.id &&
      (selectedWeight
        ? item.selectedWeight === selectedWeight
        : selectedVariant
          ? item.selectedVariant?.id === selectedVariant.id
          : !item.selectedWeight && !item.selectedVariant),
  )

  if (existingItemIndex >= 0) {
    cartItems[existingItemIndex].quantity += quantity
  } else {
    const newItem: CartItem = {
      id: `${product.id}-${selectedWeight || selectedVariant?.id || "default"}-${Date.now()}`,
      productId: product.id,
      product,
      quantity,
      selectedWeight,
      selectedVariant,
      addedAt: new Date(),
    }
    cartItems.push(newItem)
  }

  saveCartItems(cartItems)
}

export const removeFromCart = (itemId: string) => {
  const cartItems = getCartItems()
  const updatedItems = cartItems.filter((item) => item.id !== itemId)
  saveCartItems(updatedItems)
}

export const updateCartItemQuantity = (itemId: string, quantity: number) => {
  const cartItems = getCartItems()
  const itemIndex = cartItems.findIndex((item) => item.id === itemId)

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      removeFromCart(itemId)
    } else {
      cartItems[itemIndex].quantity = quantity
      saveCartItems(cartItems)
    }
  }
}

export const getCartTotal = (): number => {
  const cartItems = getCartItems()
  return cartItems.reduce((total, item) => {
    let price = item.product.price

    // Nueva lógica: si tiene selectedWeight y pricePerGram
    if (item.selectedWeight && item.product.pricePerGram) {
      price = item.selectedWeight * item.product.pricePerGram
    }
    // Lógica legacy: si tiene selectedVariant
    else if (item.selectedVariant) {
      price = item.selectedVariant.price
    }

    return total + price * item.quantity
  }, 0)
}

export const getCartItemsCount = (): number => {
  const cartItems = getCartItems()
  return cartItems.reduce((total, item) => total + item.quantity, 0)
}

export const clearCart = () => {
  saveCartItems([])
}
