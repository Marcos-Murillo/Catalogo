import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Galeria Espiritual - Cuarzos y Cristales",
  description:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
    "Descubre nuestra colección de cuarzos y cristales naturales para tu bienestar espiritual",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
