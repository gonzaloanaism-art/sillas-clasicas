'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

interface STLViewerProps {
  src: string
  chairName: string
}

type Status = 'loading' | 'ready' | 'error'

export default function STLViewer({ src, chairName }: STLViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let animId: number
    let disposed = false

    // — Scene —
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf9f9f9)

    // Subtle grid floor
    const grid = new THREE.GridHelper(12, 24, 0xe4e4e7, 0xe4e4e7)
    grid.position.y = -1.6
    scene.add(grid)

    // — Camera —
    const w = container.clientWidth
    const h = container.clientHeight
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.01, 500)
    camera.position.set(3, 2.5, 4)

    // — Renderer —
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)

    // — Lights —
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const key = new THREE.DirectionalLight(0xffffff, 1.2)
    key.position.set(4, 8, 5)
    key.castShadow = true
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xf0f4ff, 0.4)
    fill.position.set(-4, 2, -3)
    scene.add(fill)

    // — Orbit controls —
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.autoRotate = !prefersReducedMotion
    controls.autoRotateSpeed = 1.2
    controls.minDistance = 1
    controls.maxDistance = 30
    controls.target.set(0, 0, 0)

    // Stop auto-rotate when user interacts
    renderer.domElement.addEventListener('pointerdown', () => {
      controls.autoRotate = false
    })

    // — Load STL —
    const loader = new STLLoader()
    loader.load(
      src,
      (geometry) => {
        if (disposed) return
        geometry.computeVertexNormals()
        geometry.center()

        // Scale to fit ~3 units using geometry bounding box
        geometry.computeBoundingBox()
        const geoBox = geometry.boundingBox ?? new THREE.Box3()
        const size = geoBox.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z) || 1
        const scale = 3 / maxDim

        const material = new THREE.MeshPhysicalMaterial({
          color: 0x1c1c1e,
          roughness: 0.55,
          metalness: 0.08,
          clearcoat: 0.15,
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.scale.setScalar(scale)
        mesh.castShadow = true

        // Sit the mesh on the grid after scaling
        const scaledBox = new THREE.Box3().setFromObject(mesh)
        mesh.position.y = -scaledBox.min.y - 1.6
        scene.add(mesh)

        setStatus('ready')
      },
      undefined,
      () => {
        if (!disposed) setStatus('error')
      },
    )

    // — Render loop —
    const animate = () => {
      animId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // — Resize —
    const ro = new ResizeObserver(() => {
      if (!container || disposed) return
      const nw = container.clientWidth
      const nh = container.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    })
    ro.observe(container)

    return () => {
      disposed = true
      cancelAnimationFrame(animId)
      ro.disconnect()
      controls.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [src])

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" aria-label={`Modelo 3D de ${chairName}`} />

      {/* Loading */}
      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-50">
          <div className="w-8 h-8 rounded-full border-2 border-zinc-200 border-t-zinc-700 animate-spin" />
          <p className="text-xs text-zinc-400 font-medium tracking-wide">Cargando modelo…</p>
        </div>
      )}

      {/* Error / no file */}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-50 px-8 text-center">
          <svg viewBox="0 0 48 48" className="w-12 h-12 text-zinc-200" fill="currentColor" aria-hidden="true">
            <rect x="8" y="18" width="32" height="5" rx="2" />
            <rect x="10" y="6" width="28" height="14" rx="2" />
            <rect x="10" y="23" width="4" height="19" rx="2" />
            <rect x="34" y="23" width="4" height="19" rx="2" />
          </svg>
          <div>
            <p className="text-sm font-medium text-zinc-500">Modelo no disponible</p>
            <p className="mt-1 text-xs text-zinc-400">
              Sube el archivo a{' '}
              <code className="font-mono text-zinc-500">
                /public/models/{src.split('/').pop()}
              </code>
            </p>
          </div>
        </div>
      )}

      {/* Controls hint */}
      {status === 'ready' && (
        <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-zinc-400 pointer-events-none select-none tracking-wide">
          Arrastra · Scroll para zoom
        </p>
      )}
    </div>
  )
}
