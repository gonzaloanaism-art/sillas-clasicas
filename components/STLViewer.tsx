'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

interface STLViewerProps {
  src: string | string[]
  chairName: string
  compact?: boolean
}

type Status = 'loading' | 'ready' | 'error'

export default function STLViewer({ src, chairName, compact = false }: STLViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('loading')
  const srcKey = Array.isArray(src) ? src.join('|') : src

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let animId: number
    let disposed = false

    // — Scene —
    const scene = new THREE.Scene()
    if (!compact) {
      scene.background = new THREE.Color(0xf9f9f9)
      const grid = new THREE.GridHelper(12, 24, 0xe4e4e7, 0xe4e4e7)
      grid.position.y = -1.6
      scene.add(grid)
    }

    // — Camera —
    const w = container.clientWidth || 400
    const h = container.clientHeight || 300
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.01, 500)
    camera.position.set(3, 2.5, 4)

    // — Renderer —
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: compact })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    if (!compact) renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)

    // — Lights —
    scene.add(new THREE.AmbientLight(0xffffff, compact ? 1.2 : 0.7))
    const key = new THREE.DirectionalLight(0xffffff, 1.2)
    key.position.set(4, 8, 5)
    if (!compact) key.castShadow = true
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xf0f4ff, 0.4)
    fill.position.set(-4, 2, -3)
    scene.add(fill)

    // — Controls —
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.autoRotate = true
    controls.autoRotateSpeed = compact ? 2 : 1.2
    if (compact) {
      controls.enabled = false
    } else {
      controls.autoRotate = !prefersReducedMotion
      controls.minDistance = 1
      controls.maxDistance = 30
      renderer.domElement.addEventListener('pointerdown', () => { controls.autoRotate = false })
    }

    // — Material —
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x1c1c1e,
      roughness: 0.55,
      metalness: 0.08,
      clearcoat: 0.15,
    })

    // Centers + scales the group, places bottom on floor, aims camera.
    // Uses a wrapper so scale is always applied around the content center (not a shifted origin).
    function finalizeGroup(group: THREE.Group): THREE.Group {
      // Auto-orient: rotate so the longest dimension becomes Y (up axis).
      // STL files for 3D printing are often exported lying flat on the print bed.
      group.updateWorldMatrix(true, true)
      const size0 = new THREE.Box3().setFromObject(group).getSize(new THREE.Vector3())
      if (size0.x >= size0.y && size0.x >= size0.z) {
        // X is tallest → rotate around Z so X → Y
        group.rotation.z += Math.PI / 2
      } else if (size0.z >= size0.y && size0.z >= size0.x) {
        // Z is tallest → rotate around X so Z → Y
        group.rotation.x += -Math.PI / 2
      }

      group.updateWorldMatrix(true, true)
      const box = new THREE.Box3().setFromObject(group)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z) || 1
      const scale = 3 / maxDim

      // Inner group shifts content to origin; wrapper scales from origin
      group.position.sub(center)
      const wrapper = new THREE.Group()
      wrapper.add(group)
      wrapper.scale.setScalar(scale)

      // Place bottom on floor
      const scaledBox = new THREE.Box3().setFromObject(wrapper)
      wrapper.position.y = -scaledBox.min.y - 1.6

      const finalBox = new THREE.Box3().setFromObject(wrapper)
      const finalCenter = finalBox.getCenter(new THREE.Vector3())
      controls.target.copy(finalCenter)
      camera.lookAt(finalCenter)
      controls.update()

      return wrapper
    }

    const srcs = Array.isArray(src) ? src : [src]
    const firstExt = srcs[0].split('.').pop()?.toLowerCase()

    if (firstExt === 'obj') {
      // OBJ — single file only
      const loader = new OBJLoader()
      loader.load(
        srcs[0],
        (group) => {
          if (disposed) return
          group.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = material
              if (!compact) child.castShadow = true
            }
          })
          // OBJ files commonly exported Z-up; rotate to Y-up
          group.rotation.x = -Math.PI / 2
          scene.add(finalizeGroup(group))
          setStatus('ready')
        },
        undefined,
        () => { if (!disposed) setStatus('error') },
      )
    } else {
      // STL — one or multiple parts loaded into a shared group
      const group = new THREE.Group()
      let loaded = 0
      let failed = 0
      const total = srcs.length
      const loader = new STLLoader()

      srcs.forEach((fileSrc) => {
        loader.load(
          fileSrc,
          (geometry) => {
            if (disposed) return
            geometry.computeVertexNormals()

            const mesh = new THREE.Mesh(geometry, material)
            if (!compact) mesh.castShadow = true
            group.add(mesh)

            loaded++
            if (loaded + failed === total) {
              if (loaded > 0) {
                scene.add(finalizeGroup(group))
                setStatus('ready')
              } else {
                setStatus('error')
              }
            }
          },
          undefined,
          () => {
            if (disposed) return
            failed++
            if (loaded + failed === total) {
              if (loaded > 0) {
                scene.add(finalizeGroup(group))
                setStatus('ready')
              } else {
                setStatus('error')
              }
            }
          },
        )
      })
    }

    // — Loop —
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
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcKey, compact])

  if (compact) {
    return (
      <div className="w-full h-full">
        <div
          ref={containerRef}
          className="w-full h-full"
          style={{ pointerEvents: 'none' }}
          aria-hidden="true"
        />
      </div>
    )
  }

  const firstSrc = Array.isArray(src) ? src[0] : src

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" aria-label={`Modelo 3D de ${chairName}`} />

      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-50">
          <div className="w-8 h-8 rounded-full border-2 border-zinc-200 border-t-zinc-700 animate-spin" />
          <p className="text-xs text-zinc-400 font-medium tracking-wide">Cargando modelo…</p>
        </div>
      )}

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
              <code className="font-mono text-zinc-500">public/models/{firstSrc.split('/').pop()}</code>
            </p>
          </div>
        </div>
      )}

      {status === 'ready' && (
        <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-zinc-400 pointer-events-none select-none tracking-wide">
          Arrastra · Scroll para zoom
        </p>
      )}
    </div>
  )
}
