import { type NextRequest, NextResponse } from "next/server"

const IMGBB_API_KEY = process.env.IMGBB_API_KEY

export async function POST(request: NextRequest) {
  try {
    if (!IMGBB_API_KEY) {
      console.error("❌ IMGBB_API_KEY no está configurada")
      return NextResponse.json({ error: "Configuración de ImgBB faltante" }, { status: 500 })
    }

    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    console.log("📤 Subiendo imagen a ImgBB...")

    // Crear FormData para ImgBB
    const formData = new FormData()
    formData.append("key", IMGBB_API_KEY)
    formData.append("image", image) // imagen en base64 sin prefijo

    // Subir a ImgBB
    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("❌ Error de ImgBB:", data)
      return NextResponse.json({ error: "Error al subir imagen a ImgBB" }, { status: 500 })
    }

    if (data.success) {
      console.log("✅ Imagen subida exitosamente:", data.data.url)
      return NextResponse.json({
        success: true,
        url: data.data.url,
        delete_url: data.data.delete_url,
      })
    } else {
      console.error("❌ ImgBB no pudo procesar la imagen:", data)
      return NextResponse.json({ error: "ImgBB no pudo procesar la imagen" }, { status: 500 })
    }
  } catch (error) {
    console.error("❌ Error en upload-image:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}


