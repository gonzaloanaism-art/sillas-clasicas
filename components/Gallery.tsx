'use client'

import { useState } from 'react'
import { chairs, eras } from '@/data/chairs'
import type { EraFilter } from '@/types'
import ChairCard from './ChairCard'

export default function Gallery() {
  const [active, setActive] = useState<EraFilter>('Todos')

  const filtered = active === 'Todos' ? chairs : chairs.filter((c) => c.era === active)

  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Filter bar */}
        <div
          role="tablist"
          aria-label="Filtrar por época"
          className="flex flex-wrap gap-2"
        >
          {eras.map((era) => (
            <button
              key={era}
              role="tab"
              aria-selected={active === era}
              onClick={() => setActive(era as EraFilter)}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 ring-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2
                ${
                  active === era
                    ? 'bg-zinc-900 text-white ring-zinc-900'
                    : 'bg-white text-zinc-600 ring-zinc-200 hover:ring-zinc-400 hover:text-zinc-900'
                }`}
            >
              {era}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-sm text-zinc-400">
          {filtered.length === 1
            ? '1 silla'
            : `${filtered.length} sillas`}
          {active !== 'Todos' && ` en "${active}"`}
        </p>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((chair) => (
            <ChairCard key={chair.id} chair={chair} />
          ))}
        </div>
      </div>
    </main>
  )
}
