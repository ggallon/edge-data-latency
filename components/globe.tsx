import React, { useEffect, useRef } from "react"
import createGlobe from "cobe"

interface MarkerType {
  location: [number, number]
  size: number
}

const PI = Math.PI
const DOUBLE_PI = PI * 2

let width = 0
let currentPhi = 0
let currentTheta = 0

const MARKERS_LIST = [
  { location: [37.78, -122.412], size: 0.1 },
  { location: [44.8412, -0.5806], size: 0.1 },
  { location: [35.676, 139.65], size: 0.1 },
  { location: [-34.6, -58.38], size: 0.1 },
] as MarkerType[]

export function Globe() {
  const canvasRef = useRef(null)
  const globeRef = useRef(null)
  const pointerInteractingRef = useRef(null)
  const focusRef = useRef([0, 0])
  const pixelRatio = 2

  const locationToAngles = (lat: number, long: number): number[] => {
    return [PI - ((long * PI) / 180 - PI / 2), (lat * PI) / 180]
  }

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth
      }
    }

    window.addEventListener("resize", onResize)
    onResize()

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: pixelRatio,
      width: width * pixelRatio,
      height: width * pixelRatio,
      phi: 0,
      theta: 0.3,
      dark: 0,
      diffuse: 2,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [251 / 255, 200 / 255, 21 / 255],
      glowColor: [1.2, 1.2, 1.2],
      markers: MARKERS_LIST,
      onRender: (state) => {
        state.phi = currentPhi
        state.theta = currentTheta
        const [focusPhi, focusTheta] = focusRef.current
        const distPositive = (focusPhi - currentPhi + DOUBLE_PI) % DOUBLE_PI
        const distNegative = (currentPhi - focusPhi + DOUBLE_PI) % DOUBLE_PI
        // Control the speed
        if (distPositive < distNegative) {
          currentPhi += distPositive * 0.09
        } else {
          currentPhi -= distNegative * 0.09
        }
        currentTheta = currentTheta * 0.92 + focusTheta * 0.08
        state.width = width * pixelRatio
        state.height = width * pixelRatio
      },
    })

    globeRef.current = globe

    return () => {
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <div className="relative m-auto aspect-square w-full max-w-sm">
      <canvas
        ref={canvasRef}
        style={{
          contain: "layout paint size",
        }}
        className="h-full w-full"
        onPointerDown={(event: React.PointerEvent<HTMLCanvasElement>) => {
          const [focusPhi, focusTheta] = focusRef.current
          pointerInteractingRef.current = [
            event.clientX / 200 - focusPhi,
            event.clientY / 200 - focusTheta,
          ]
          canvasRef.current.style.cursor = "grabbing"
        }}
        onPointerUp={() => {
          pointerInteractingRef.current = null
          canvasRef.current.style.cursor = "grab"
        }}
        onPointerOut={() => {
          pointerInteractingRef.current = null
          canvasRef.current.style.cursor = "grab"
        }}
        onMouseMove={(event: React.PointerEvent<HTMLCanvasElement>) => {
          if (pointerInteractingRef.current !== null) {
            const [pointerPhi, pointerTheta] = pointerInteractingRef.current
            focusRef.current = [
              event.clientX / 200 - pointerPhi,
              event.clientY / 200 - pointerTheta,
            ]
          }
        }}
        onTouchMove={(event: React.TouchEvent<HTMLCanvasElement>) => {
          if (pointerInteractingRef.current !== null && event.touches[0]) {
            const [pointerPhi, pointerTheta] = pointerInteractingRef.current
            focusRef.current = [
              event.touches[0].clientX / 200 - pointerPhi,
              event.touches[0].clientY / 200 - pointerTheta,
            ]
          }
        }}
      />
      <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
        Rotate to:
        <button
          onClick={() => {
            globeRef.current.toggle()
          }}
        >
          {" "}
          Stop{" "}
        </button>
        <button
          onClick={() => {
            globeRef.current.toggle(true)
          }}
        >
          {" "}
          Start{" "}
        </button>
        <button
          onClick={() => {
            focusRef.current = locationToAngles(37.78, -122.412)
          }}
        >
          📍 San Francisco
        </button>
        <button
          onClick={() => {
            focusRef.current = locationToAngles(44.8412, -0.5806)
          }}
        >
          📍 Bordeaux
        </button>
        <button
          onClick={() => {
            focusRef.current = locationToAngles(35.676, 139.65)
          }}
        >
          📍 Tokyo
        </button>
        <button
          onClick={() => {
            focusRef.current = locationToAngles(-34.6, -58.38)
          }}
        >
          📍 Buenos Aires
        </button>
      </div>
    </div>
  )
}
