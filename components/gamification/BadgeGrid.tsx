'use client'

import { Lock } from 'lucide-react'
import { BADGES } from '@/lib/gamification'

interface BadgeGridProps {
  earnedBadges: string[]
  showAll?: boolean
}

export default function BadgeGrid({ earnedBadges, showAll = true }: BadgeGridProps) {
  const displayBadges = showAll ? BADGES : BADGES.filter((b) => earnedBadges.includes(b.id))
  const earnedCount = earnedBadges.filter((id) => BADGES.some((b) => b.id === id)).length

  if (!showAll && displayBadges.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-4xl mb-3">🏅</p>
        <p className="font-medium text-gray-600">Noch keine Badges verdient</p>
        <p className="text-sm mt-1">Lies Artikel, absolviere Assessments und bleib dabei!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Meine Badges</h2>
        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
          {earnedCount}/{BADGES.length}
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {displayBadges.map((badge) => {
          const isEarned = earnedBadges.includes(badge.id)
          return (
            <div
              key={badge.id}
              className={[
                'relative rounded-xl border p-3 flex flex-col items-center gap-1.5 text-center transition-all duration-200',
                isEarned
                  ? 'bg-white border-blue-100 shadow-sm hover:shadow-md'
                  : 'bg-gray-50 border-gray-100 opacity-40',
              ].join(' ')}
            >
              {!isEarned && (
                <div className="absolute top-1.5 right-1.5">
                  <Lock className="w-3 h-3 text-gray-400" />
                </div>
              )}
              <span className={['text-3xl leading-none', !isEarned ? 'grayscale' : ''].join(' ')}>
                {badge.icon}
              </span>
              <p className="text-xs font-semibold text-gray-800 leading-tight">{badge.title}</p>
              <p className="text-xs text-gray-500 leading-tight">
                {isEarned ? badge.description : '???'}
              </p>
              {isEarned && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
