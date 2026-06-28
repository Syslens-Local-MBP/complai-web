import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { PERSONAS } from '@/lib/constants'
import { getLevelName, getCountdownDays } from '@/lib/utils'
import type { Persona } from '@/lib/types'

interface WelcomeBannerProps {
  name?: string | null
  persona: Persona
  points: number
  level: number
  articlesRead: number
}

export function WelcomeBanner({ name, persona, points, level, articlesRead }: WelcomeBannerProps) {
  const personaData = PERSONAS[persona]
  const levelName = getLevelName(level)
  const days = getCountdownDays()

  return (
    <div className="rounded-xl bg-gradient-to-r from-[#003399] to-[#002277] text-white p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{personaData.icon}</span>
            <span className="text-sm text-blue-200">{personaData.label}</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">
            Willkommen{name ? `, ${name}` : ''}!
          </h2>
          <p className="text-blue-200 text-sm">
            Noch <strong className="text-[#FFCC00]">{days} Tage</strong> bis zur EU AI Act Deadline.
          </p>
        </div>

        <div className="flex gap-4 sm:flex-col sm:items-end">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
            <Star className="h-4 w-4 text-[#FFCC00]" />
            <div>
              <div className="text-xs text-blue-200">Level {level}</div>
              <div className="text-sm font-semibold">{levelName}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-blue-200">Punkte</div>
            <div className="text-xl font-bold">{points}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/20 flex flex-col sm:flex-row gap-3">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-sm font-medium transition-colors"
        >
          {articlesRead} Artikel gelesen <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/assessment"
          className="inline-flex items-center gap-2 rounded-lg bg-[#FFCC00] hover:bg-yellow-300 text-[#1A1A2E] px-4 py-2 text-sm font-semibold transition-colors"
        >
          Assessment starten <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}
