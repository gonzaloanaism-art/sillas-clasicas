import type React from 'react'

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string
        poster?: string
        alt?: string
        'auto-rotate'?: boolean | string
        'camera-controls'?: boolean | string
        'shadow-intensity'?: string
        exposure?: string
        ar?: boolean | string
        loading?: 'auto' | 'lazy' | 'eager'
      }
    }
  }
}
