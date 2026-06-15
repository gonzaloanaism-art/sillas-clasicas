'use client'

import dynamic from 'next/dynamic'
import type { Chair } from '@/types'

const ModelViewer = dynamic(() => import('./ModelViewer'), { ssr: false })

const eraColors: Record<string, string> = {
  'Bauhaus & Vanguardia': 'bg-amber-50 text-amber-700 ring-amber-200',
  'Art Déco & Modernismo': 'bg-stone-100 text-stone-700 ring-stone-200',
  'Mid-Century Modern': 'bg-sky-50 text-sky-700 ring-sky-200',
  'Escandinavo': 'bg-teal-50 text-teal-700 ring-teal-200',
  'Pop Design': 'bg-violet-50 text-violet-700 ring-violet-200',
}

interface ChairCardProps {
  chair: Chair
}

export default function ChairCard({ chair }: ChairCardProps) {
  const badgeClass = eraColors[chair.era] ?? 'bg-zinc-100 text-zinc-600 ring-zinc-200'

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200 transition-all duration-200 hover:ring-zinc-400 hover:shadow-lg cursor-pointer">
      {/* Visual area */}
      <div className={`relative aspect-4/3 bg-gradient-to-br ${chair.posterGradient} flex items-center justify-center overflow-hidden`}>
        {chair.modelSrc ? (
          <ModelViewer
            src={chair.modelSrc}
            alt={`Modelo 3D de la ${chair.name}`}
            className="w-full h-full"
          />
        ) : (
          <Placeholder name={chair.name} />
        )}

        {/* Year badge */}
        <span className="absolute top-3 right-3 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium tabular-nums text-zinc-600 backdrop-blur-sm ring-1 ring-zinc-200/60">
          {chair.year}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-semibold text-zinc-900 leading-snug group-hover:text-zinc-700 transition-colors">
            {chair.name}
          </h3>
          <p className="mt-0.5 text-sm text-zinc-500">{chair.designer}</p>
        </div>

        <p className="text-sm leading-relaxed text-zinc-500 line-clamp-2 flex-1">
          {chair.description}
        </p>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-100">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${badgeClass}`}
          >
            {chair.era}
          </span>
          <span className="text-xs text-zinc-400">{chair.origin}</span>
        </div>
      </div>
    </article>
  )
}

function Placeholder({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* Chair silhouette SVG */}
      <svg
        viewBox="0 0 80 80"
        className="w-16 h-16 text-zinc-300 group-hover:text-zinc-400 transition-colors duration-200"
        fill="currentColor"
        aria-hidden="true"
      >
        {/* seat */}
        <rect x="14" y="32" width="52" height="8" rx="2" />
        {/* back */}
        <rect x="18" y="12" width="44" height="22" rx="2" />
        {/* legs */}
        <rect x="16" y="40" width="6" height="28" rx="2" />
        <rect x="58" y="40" width="6" height="28" rx="2" />
        <rect x="22" y="40" width="4" height="20" rx="2" />
        <rect x="54" y="40" width="4" height="20" rx="2" />
      </svg>
      <span className="text-xs font-medium tracking-widest text-zinc-300 uppercase">
        {initials} · 3D
      </span>
      <span className="text-[10px] text-zinc-300">Agrega el modelo GLB</span>
    </div>
  )
}
