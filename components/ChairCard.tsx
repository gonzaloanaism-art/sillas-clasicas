'use client'

import dynamic from 'next/dynamic'
import type { Chair } from '@/types'

const STLViewer = dynamic(() => import('./STLViewer'), { ssr: false })

const eraColors: Record<string, string> = {
  'Bauhaus & Vanguardia': 'bg-amber-50 text-amber-700 ring-amber-200',
  'Art Déco & Modernismo': 'bg-stone-100 text-stone-700 ring-stone-200',
  'Mid-Century Modern': 'bg-sky-50 text-sky-700 ring-sky-200',
  'Escandinavo': 'bg-teal-50 text-teal-700 ring-teal-200',
  'Pop Design': 'bg-violet-50 text-violet-700 ring-violet-200',
}

interface ChairCardProps {
  chair: Chair
  onClick: () => void
}

function resolveModelSrc(chair: import('@/types').Chair): string | string[] {
  if (!chair.modelFile) return `/models/${chair.slug}.stl`
  if (Array.isArray(chair.modelFile)) return chair.modelFile.map(f => `/models/${f}`)
  return `/models/${chair.modelFile}`
}

export default function ChairCard({ chair, onClick }: ChairCardProps) {
  const badgeClass = eraColors[chair.era] ?? 'bg-zinc-100 text-zinc-600 ring-zinc-200'
  const modelSrc = resolveModelSrc(chair)
  // For compact card preview, show only the first part to avoid print-layout scatter
  const previewSrc = Array.isArray(modelSrc) ? modelSrc[0] : modelSrc

  return (
    <article
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
      tabIndex={0}
      role="button"
      aria-label={`Ver ${chair.name} de ${chair.designer}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200 transition-all duration-200 hover:ring-zinc-400 hover:shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
    >
      {/* Visual area */}
      <div className={`relative aspect-4/3 bg-gradient-to-br ${chair.posterGradient} flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0">
          <STLViewer src={previewSrc} chairName={chair.name} compact />
        </div>

        {/* Hover overlay — expand icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/5 transition-colors duration-200">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200/60">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8zM8 5v6M5 8h6" />
            </svg>
            Ver en 3D
          </span>
        </div>

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
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${badgeClass}`}>
            {chair.era}
          </span>
          <span className="text-xs text-zinc-400">{chair.origin}</span>
        </div>
      </div>
    </article>
  )
}
