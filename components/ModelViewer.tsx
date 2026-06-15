'use client'

interface ModelViewerProps {
  src: string
  alt: string
  poster?: string
  className?: string
}

// model-viewer is a web component loaded via CDN script in layout.tsx
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MV = 'model-viewer' as any

export default function ModelViewer({ src, alt, poster, className }: ModelViewerProps) {
  return (
    <MV
      src={src}
      alt={alt}
      poster={poster}
      auto-rotate
      camera-controls
      shadow-intensity="1"
      exposure="0.8"
      loading="lazy"
      class={className}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
