import createGlobe from 'cobe'
import { useEffect, useRef } from "react";

export function Globe() {
  const canvasRef = useRef();
  const globeRef = useRef();
  const pointerInteracting = useRef(null);
  const pointerInteractingFull = useRef(null);
  const pointerInteractionMovement = useRef(0);
  const pointerInteractionMovementFull = useRef({ x: 0, y: 0 });
  const focusRef = useRef([0, 0])

  const locationToAngles = (lat, long) => {
    return [Math.PI - ((long * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180]
  }

  useEffect(() => {
    let width = 0;
    let currentPhi = 0;
    let currentTheta = 0;
    const doublePi = Math.PI * 2;
    const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth)

    window.addEventListener('resize', onResize)
    onResize()

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 0,
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [251 / 255, 200 / 255, 21 / 255],
      glowColor: [1.2, 1.2, 1.2],
      markers: [
        { location: [37.78, -122.412], size: 0.3},
        { location: [52.52, 13.405], size: 0.1},
        { location: [35.676, 139.65], size: 0.1},
        { location: [-34.60, -58.38], size: 0.1},
      ],
      onRender: (state) => {
        state.phi = currentPhi
        state.theta = currentTheta
        const [focusPhi, focusTheta] = focusRef.current
        const distPositive = (focusPhi - currentPhi + doublePi) % doublePi
        const distNegative = (currentPhi - focusPhi + doublePi) % doublePi
        // Control the speed
        if (distPositive < distNegative) {
          currentPhi += distPositive * 0.09
        } else {
          currentPhi -= distNegative * 0.09
        }
        currentTheta = currentTheta * 0.92 + focusTheta * 0.08
        state.width = width * 2
        state.height = width * 2
      }
    });

    globeRef.current = globe

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative m-auto aspect-square w-full max-w-sm">
      <canvas
        ref={canvasRef}
        style={{
          contain: 'layout paint size',
        }}
        className="w-full h-full"
        onPointerDown={(e) => {
          pointerInteractingFull.current = {
            x: e.clientX - pointerInteractionMovementFull.current.x,
            y: e.clientY - pointerInteractionMovementFull.current.y
          }
          canvasRef.current.style.cursor = 'grabbing';
        }}
        onPointerUp={() => {
          pointerInteractingFull.current = null
          canvasRef.current.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          pointerInteractingFull.current = null
          canvasRef.current.style.cursor = 'grab';
        }}
        onMouseMove={(e) => {
          if (pointerInteractingFull.current !== null) {
            const [focusPhi, focusTheta] = focusRef.current
            const deltaX = e.clientX - pointerInteractingFull.current.x
            const deltaY = e.clientY - pointerInteractingFull.current.y
            pointerInteractionMovementFull.current = {
              x: deltaX,
              y: deltaY
            }
            focusRef.current = [deltaX / 200, deltaY / 200]
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteractingFull.current !== null && e.touches[0]) {
            const [focusPhi, focusTheta] = focusRef.current
            const deltaX = e.clientX - pointerInteractingFull.current.x
            const deltaY = e.clientY - pointerInteractingFull.current.y
            pointerInteractionMovementFull.current = {
              x: deltaX,
              y: deltaY
            }
            focusRef.current = [deltaX / 100, deltaY / 100]
          }
        }}
      />
      <div className="flex flex-col md:flex-row justify-center items-center gap-2">
        Rotate to:
        <button onClick={() => {
          globeRef.current.toggle(false)
        }}> Stop </button>
        <button onClick={() => {
          globeRef.current.toggle(true)
        }}> Start </button>
        <button onClick={() => {
          focusRef.current = locationToAngles(37.78, -122.412)
        }}>📍 San Francisco</button>
        <button onClick={() => {
          console.log("Berlin", locationToAngles(52.52, 13.405))
          focusRef.current = locationToAngles(52.52, 13.405)
        }}>📍 Berlin</button>
        <button onClick={() => {
          focusRef.current = locationToAngles(35.676, 139.65)
        }}>📍 Tokyo</button>
        <button onClick={() => {
          focusRef.current = locationToAngles(-34.60, -58.38)
        }}>📍 Buenos Aires</button>
      </div>
    </div>
  );
}