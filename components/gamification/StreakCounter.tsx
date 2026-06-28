'use client'

interface StreakCounterProps {
  streak: number
  compact?: boolean
}

export default function StreakCounter({ streak, compact = false }: StreakCounterProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-base leading-none">🔥</span>
        <span className="text-sm font-bold text-gray-800">{streak}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="flex items-center gap-2">
        <span className="text-3xl leading-none">🔥</span>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-gray-900">{streak}</span>
          <span className="text-lg font-medium text-gray-500">Tage</span>
        </div>
      </div>

      {streak === 0 && (
        <p className="text-sm text-gray-500 mt-1">Starte heute deine Streak!</p>
      )}
      {streak >= 7 && (
        <p className="text-sm font-bold text-amber-500 mt-1">Wöchentlich! 🌟</p>
      )}
      {streak >= 3 && streak < 7 && (
        <p className="text-sm font-semibold text-orange-500 mt-1">Super Streak! 💪</p>
      )}
      {streak > 0 && streak < 3 && (
        <p className="text-sm text-gray-400 mt-1">Weiter so!</p>
      )}
    </div>
  )
}
