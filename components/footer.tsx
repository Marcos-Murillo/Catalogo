"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react'

export function Footer() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Galeria Espiritual"
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573123456789"

  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 p-1">
                <div className="w-full h-full bg-transparent rounded-lg flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={41}
                    height={41}
                    className="object-contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">{appName}</h3>
                <p className="text-gray-400 text-sm">Conexión para la vida</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Descubre la magia de los cuarzos y cristales naturales. Productos auténticos para tu bienestar espiritual y energético.
            </p>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contacto</h4>
            <div className="space-y-3">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+57 3104412515</span>
              </a>
              <a
                href="mailto:info@galeriaespiritual.com"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>galeriaespiritual@gmail.com</span>
              </a>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>Colombia</span>
              </div>
            </div>
          </div>

          {/* Redes sociales y navegación */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Síguenos</h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/galeriaespiritual?igsh=cGlqNGd4czA4MXpt"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-xl hover:scale-105 transition-transform"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100083231491970"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 p-3 rounded-xl hover:scale-105 transition-transform"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Catálogo
              </Link>
              <Link href="/diccionario" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Diccionario
              </Link>
              <Link href="/carrito" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Carrito
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 {appName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
