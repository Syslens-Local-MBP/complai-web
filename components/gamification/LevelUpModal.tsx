'use client'

import { useEffect, useCallback } from 'react'

interface LevelUpModalProps {
  isOpen: boolean
  newLevel: { level: number; title: string; icon: string }
  onClose: () => void
}

export default function LevelUpModal({ isOpen, newLevel, onClose }: LevelUpModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <>
      <style>{`
        @keyframes bounceIcon {
          0%, 100% { transform: translateY(0) scale(1); }
          30%       { transform: translateY(-18px) scale(1.1); }
          60%       { transform: translateY(-6px) scale(1.05); }
        }
        .bounce-icon {
          animation: bounceIcon 0.9s ease-in-out infinite;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        .modal-enter {
          animation: modalFadeIn 0.25s ease-out forwards;
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Level Up!"
      >
        {/* Blur overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Modal card */}
        <div
          className="modal-enter relative z-10 bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative top bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          {/* Icon */}
          <div className="bounce-icon text-7xl mb-4 leading-none select-none">{newLevel.icon}</div>

          {/* Level Up heading */}
          <h2 className="text-2xl font-black text-gray-900 mb-1">Level Up! 🎉</h2>

          {/* Description */}
          <p className="text-base text-gray-600 mb-4">
            Du bist jetzt{' '}
            <span className="font-bold text-gray-900">
              {newLevel.icon} {newLevel.title}
            </span>
            !
          </p>

          {/* Level badge */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 border-4 border-blue-500 mb-6">
            <span className="text-xl font-black text-blue-700">{newLevel.level}</span>
          </div>

          {/* CTA button */}
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Weiter lernen
          </button>
        </div>
      </div>
    </>
  )
}
