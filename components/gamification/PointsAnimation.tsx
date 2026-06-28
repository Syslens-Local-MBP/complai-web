'use client'

import { useEffect, useRef } from 'react'

interface PointsAnimationProps {
  points: number
  visible: boolean
  onComplete: () => void
}

export default function PointsAnimation({ points, visible, onComplete }: PointsAnimationProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (visible) {
      // Clean up any existing timer before starting a new one
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        onComplete()
      }, 2000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [visible, onComplete])

  if (!visible) return null

  return (
    <>
      <style>{`
        @keyframes pointsFloat {
          0%   { opacity: 1; transform: translateY(0px); }
          20%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(-40px); }
        }
        .points-float {
          animation: pointsFloat 2s ease-out forwards;
        }
      `}</style>
      <div
        className="points-float fixed z-50 pointer-events-none select-none"
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        aria-live="polite"
      >
        <span className="inline-flex items-center gap-1 bg-green-500 text-white text-lg font-bold px-4 py-2 rounded-full shadow-lg">
          +{points} Punkte
        </span>
      </div>
    </>
  )
}
