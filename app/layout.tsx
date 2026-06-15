import type { Metadata } from 'next'
import { Archivo, Space_Grotesk } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Sillas Clásicas — Colección de Diseño 3D',
  description:
    'Una colección de las sillas más icónicas del diseño moderno. Explora modelos 3D de Eames, Mies van der Rohe, Jacobsen y más.',
  openGraph: {
    title: 'Sillas Clásicas',
    description: 'Colección de diseño clásico en 3D',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${archivo.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
        strategy="afterInteractive"
      />
    </html>
  )
}
