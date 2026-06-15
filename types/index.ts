export interface Chair {
  id: number
  slug: string
  name: string
  designer: string
  year: number
  era: Era
  style: string
  description: string
  posterGradient: string
  modelSrc?: string
  materials: string[]
  origin: string
}

export type Era =
  | 'Bauhaus & Vanguardia'
  | 'Art Déco & Modernismo'
  | 'Mid-Century Modern'
  | 'Escandinavo'
  | 'Pop Design'

export type EraFilter = 'Todos' | Era
