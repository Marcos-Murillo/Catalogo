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

// Actualizar la interfaz Product para incluir el tipo
export interface Product {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
  type: "collar" | "anillo" | "forma" | "bruto"
  createdAt: Date
}

// Actualizar los datos de ejemplo para incluir tipos
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Cuarzo Rosa Natural",
    price: 45000,
    description:
      "Hermoso cuarzo rosa natural que promueve el amor propio y la sanación emocional. Perfecto para meditación y equilibrio energético. Sus suaves tonos rosados transmiten paz y armonía.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    type: "bruto",
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
    createdAt: new Date("2024-01-12"),
  },
  {
    id: "5",
    name: "Turmalina Negra",
    price: 41000,
    description:
      "Poderosa piedra de protección que absorbe energías negativas y proporciona conexión a tierra. Esencial para la limpieza energética y protección del hogar.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    type: "bruto",
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
    createdAt: new Date("2024-01-10"),
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

// Agregar tipos de productos disponibles
export const productTypes = [
  { value: "collar", label: "Collar" },
  { value: "anillo", label: "Anillo" },
  { value: "forma", label: "Forma" },
  { value: "bruto", label: "En Bruto" },
] as const
