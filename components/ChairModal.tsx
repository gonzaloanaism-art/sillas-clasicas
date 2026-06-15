'use client'

import { useEffect } from 'react'
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

interface ChairModalProps {
  chair: Chair
  onClose: () => void
}

export default function ChairModal({ chair, onClose }: ChairModalProps) {
  const modelSrc = chair.modelFile ? `/models/${chair.modelFile}` : `/models/${chair.slug}.stl`
  const ext = modelSrc.split('.').pop()?.toUpperCase() ?? 'STL'
  const badgeClass = eraColors[chair.era] ?? 'bg-zinc-100 text-zinc-600 ring-zinc-200'

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col lg:flex-row"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-chair-title"
      >
        {/* ── 3D Viewer ── */}
        <div className="lg:w-[58%] min-h-64 lg:min-h-0 bg-zinc-50 flex-shrink-0">
          <STLViewer src={modelSrc} chairName={chair.name} />
        </div>

        {/* ── Info panel ── */}
        <div className="lg:w-[42%] flex flex-col gap-6 p-7 lg:p-8 overflow-y-auto">

          {/* Close */}
          <div className="flex items-start justify-between gap-4">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${badgeClass}`}>
              {chair.era}
            </span>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M2 2l12 12M14 2L2 14" />
              </svg>
            </button>
          </div>

          {/* Title */}
          <div>
            <h2 id="modal-chair-title" className="text-2xl font-semibold leading-tight text-zinc-900">
              {chair.name}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {chair.designer}
              <span className="mx-2 text-zinc-200">·</span>
              <span className="tabular-nums">{chair.year}</span>
              <span className="mx-2 text-zinc-200">·</span>
              {chair.origin}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-zinc-600">{chair.description}</p>

          {/* Style */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.15em] text-zinc-400 uppercase mb-2">Estilo</p>
            <p className="text-sm text-zinc-700">{chair.style}</p>
          </div>

          {/* Materials */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.15em] text-zinc-400 uppercase mb-2">Materiales</p>
            <ul className="flex flex-col gap-1">
              {chair.materials.map((m) => (
                <li key={m} className="flex items-center gap-2 text-sm text-zinc-700">
                  <span className="w-1 h-1 rounded-full bg-zinc-300 flex-shrink-0" aria-hidden="true" />
                  {m}
                </li>
              ))}
            </ul>
          </div>

          {/* Download */}
          <div className="mt-auto pt-4 border-t border-zinc-100">
            <a
              href={modelSrc}
              download={chair.modelFile ?? `${chair.slug}.stl`}
              className="flex items-center justify-center gap-2 w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 cursor-pointer"
            >
              <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 3v10M6 9l4 4 4-4" />
                <path d="M3 15h14" />
              </svg>
              Descargar {ext}
            </a>
            <p className="mt-2 text-center text-[10px] text-zinc-400">
              {chair.modelFile ?? `${chair.slug}.stl`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
