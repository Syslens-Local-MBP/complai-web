'use client'

import { LEVELS, getCurrentLevel, getNextLevel, getProgressToNextLevel } from '@/lib/gamification'

interface ProgressBarProps {
  totalPoints: number
  showLabel?: boolean
  compact?: boolean
}

export default function ProgressBar({ totalPoints, showLabel = true, compact = false }: ProgressBarProps) {
  const currentLevel = getCurrentLevel(totalPoints)
  const nextLevel = getNextLevel(totalPoints)
  const progress = getProgressToNextLevel(totalPoints)
  const isMaxLevel = !nextLevel

  if (compact) {
    return (
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-base leading-none">{currentLevel.icon}</span>
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-medium text-gray-700 truncate">{currentLevel.title}</span>
            <span className="text-xs text-gray-500 shrink-0">{totalPoints} XP</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-3">
      {showLabel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{currentLevel.icon}</span>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Level {currentLevel.level}</p>
              <p className="text-base font-semibold text-gray-900">{currentLevel.title}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Gesamtpunkte</p>
            <p className="text-lg font-bold text-blue-600">{totalPoints.toLocaleString('de-DE')}</p>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          {isMaxLevel ? (
            <span className="text-amber-600 font-medium">Maximales Level erreicht!</span>
          ) : (
            <>
              <span>
                {totalPoints - currentLevel.minPoints} / {(nextLevel!.minPoints - currentLevel.minPoints)} XP
              </span>
              <span>{progress}%</span>
            </>
          )}
        </div>
      </div>

      {!isMaxLevel && nextLevel && (
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span>Nächstes Level:</span>
          <span>{nextLevel.icon}</span>
          <span className="font-medium text-gray-600">{nextLevel.title}</span>
          <span>bei {nextLevel.minPoints.toLocaleString('de-DE')} XP</span>
        </div>
      )}

      {isMaxLevel && (
        <div className="flex items-center gap-1.5 text-xs text-amber-600">
          <span>{LEVELS[LEVELS.length - 1].icon}</span>
          <span className="font-medium">Du hast das höchste Level erreicht!</span>
        </div>
      )}
    </div>
  )
}
