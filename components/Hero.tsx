import { chairs } from '@/data/chairs'

export default function Hero() {
  const eras = [...new Set(chairs.map((c) => c.era))].length

  return (
    <section className="border-b border-zinc-200 bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          {/* Heading */}
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-medium tracking-[0.2em] text-zinc-400 uppercase">
              Colección de Diseño
            </p>
            <h1 className="text-5xl font-light tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
              Sillas
              <br />
              <span className="font-semibold">Clásicas</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-500">
              Una selección de las sillas que definieron el diseño del siglo XX.
              Desde la Bauhaus hasta el Pop, cada pieza es un manifesto de su
              época.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8 lg:gap-12">
            <div>
              <p className="text-4xl font-light tabular-nums text-zinc-900">
                {chairs.length}
              </p>
              <p className="mt-1 text-xs tracking-wide text-zinc-400 uppercase">
                Modelos
              </p>
            </div>
            <div className="w-px bg-zinc-200" />
            <div>
              <p className="text-4xl font-light tabular-nums text-zinc-900">
                {eras}
              </p>
              <p className="mt-1 text-xs tracking-wide text-zinc-400 uppercase">
                Épocas
              </p>
            </div>
            <div className="w-px bg-zinc-200" />
            <div>
              <p className="text-4xl font-light tabular-nums text-zinc-900">
                1917
              </p>
              <p className="mt-1 text-xs tracking-wide text-zinc-400 uppercase">
                Origen
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
