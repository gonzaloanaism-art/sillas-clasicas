import Hero from '@/components/Hero'
import Gallery from '@/components/Gallery'

export default function Home() {
  return (
    <>
      <Hero />
      <Gallery />
      <footer className="border-t border-zinc-200 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-400">
            Sillas Clásicas — Colección de Diseño del Siglo XX
          </p>
          <p className="text-xs text-zinc-300">
            Agrega tus modelos GLB en{' '}
            <code className="font-mono text-zinc-400">/public/models/</code>
          </p>
        </div>
      </footer>
    </>
  )
}
