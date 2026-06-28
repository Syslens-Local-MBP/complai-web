'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Shield,
  Flame,
  Trophy,
  Star,
  Award,
  BarChart3,
  Clock,
  Hash,
} from 'lucide-react'
import {
  loadUserStats,
  getCurrentLevel,
  getNextLevel,
  getProgressToNextLevel,
  type UserStats,
} from '@/lib/gamification'
import ProgressBar from '@/components/gamification/ProgressBar'
import BadgeGrid from '@/components/gamification/BadgeGrid'
import StreakCounter from '@/components/gamification/StreakCounter'

const DEMO_STATS: UserStats = {
  totalPoints: 350,
  articlesRead: 12,
  assessmentsCompleted: 2,
  highlightsCreated: 8,
  notesCreated: 3,
  currentStreak: 4,
  longestStreak: 7,
  quizzesCompleted: 3,
  perfectQuizzes: 1,
  pathsCompleted: 1,
  sharedCount: 1,
  chaptersVisited: 5,
  earnedBadges: ['first_read', 'eager_reader', 'first_assessment', 'streak_3', 'quiz_master'],
  joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  lastVisit: new Date().toISOString(),
}

function formatDate(iso: string | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number | string
  sub?: string
  color?: string
}

function StatCard({ icon, label, value, sub, color = 'text-blue-600' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
      <div className={['mt-0.5 shrink-0', color].join(' ')}>{icon}</div>
      <div>
        <p className="text-2xl font-black text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function ProfilPage() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    const loaded = loadUserStats()
    if (loaded.totalPoints === 0 && loaded.articlesRead === 0) {
      setStats(DEMO_STATS)
      setIsDemo(true)
    } else {
      setStats(loaded)
      setIsDemo(false)
    }
  }, [])

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const currentLevel = getCurrentLevel(stats.totalPoints)
  const nextLevel = getNextLevel(stats.totalPoints)
  const progress = getProgressToNextLevel(stats.totalPoints)

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Demo banner */}
      {isDemo && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center">
          <p className="text-xs text-amber-700 font-medium">
            Demo-Daten — Starte deine Lernreise um echte Stats zu sehen!
          </p>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* ── Profile Header ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <span className="text-2xl font-black text-white select-none">KI</span>
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-black text-gray-900">Mein Profil</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Dabei seit {formatDate(stats.joinDate)}
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1">
                  <span>{currentLevel.icon}</span>
                  {currentLevel.title}
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-3xl font-black text-blue-600">{stats.totalPoints.toLocaleString('de-DE')}</p>
              <p className="text-xs text-gray-400 font-medium">Gesamtpunkte</p>
            </div>
          </div>
        </div>

        {/* ── Level & XP ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-semibold text-gray-900">Level & Fortschritt</h2>
          </div>
          <ProgressBar totalPoints={stats.totalPoints} showLabel={true} compact={false} />
        </div>

        {/* ── Stats Grid ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-gray-500" />
            <h2 className="text-base font-semibold text-gray-900">Statistiken</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              icon={<BookOpen className="w-5 h-5" />}
              label="Artikel gelesen"
              value={stats.articlesRead}
              color="text-blue-600"
            />
            <StatCard
              icon={<Shield className="w-5 h-5" />}
              label="Assessments"
              value={stats.assessmentsCompleted}
              color="text-purple-600"
            />
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
              <Flame className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-2xl font-black text-gray-900">{stats.currentStreak}</p>
                <p className="text-sm font-medium text-gray-600">Tage Streak</p>
                <p className="text-xs text-gray-400 mt-0.5">Rekord: {stats.longestStreak}</p>
              </div>
            </div>
            <StatCard
              icon={<Trophy className="w-5 h-5" />}
              label="Quizze"
              value={stats.quizzesCompleted}
              sub={stats.perfectQuizzes > 0 ? `${stats.perfectQuizzes}× perfekt` : undefined}
              color="text-amber-500"
            />
          </div>
        </div>

        {/* ── Streak Spotlight ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-base font-semibold text-gray-900">Aktuelle Streak</h2>
          </div>
          <StreakCounter streak={stats.currentStreak} compact={false} />
        </div>

        {/* ── Badge Showcase ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <BadgeGrid earnedBadges={stats.earnedBadges} showAll={true} />
        </div>

        {/* ── Activity Stats ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-gray-500" />
            <h2 className="text-base font-semibold text-gray-900">Aktivität</h2>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-yellow-50 flex items-center justify-center">
                <Hash className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <dt className="text-xs text-gray-500">Highlights</dt>
                <dd className="text-xl font-black text-gray-900">{stats.highlightsCreated}</dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <dt className="text-xs text-gray-500">Notizen</dt>
                <dd className="text-xl font-black text-gray-900">{stats.notesCreated}</dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <dt className="text-xs text-gray-500">Lernpfade</dt>
                <dd className="text-xl font-black text-gray-900">{stats.pathsCompleted}</dd>
              </div>
            </div>
          </dl>
        </div>

        {/* ── Getting Started (only if totalPoints === 0 in real data) ── */}
        {stats.totalPoints === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-semibold text-gray-900">Jetzt starten</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Starte deine Lernreise und verdiene deine ersten Punkte!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/artikel/1"
                className="flex items-center gap-3 p-4 rounded-xl border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <BookOpen className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">Ersten Artikel lesen</p>
                  <p className="text-xs text-blue-600">+20 Punkte</p>
                </div>
              </Link>
              <Link
                href="/assessment/new"
                className="flex items-center gap-3 p-4 rounded-xl border border-purple-100 bg-purple-50 hover:bg-purple-100 transition-colors"
              >
                <Shield className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-semibold text-purple-900">Risk-Assessment starten</p>
                  <p className="text-xs text-purple-600">+50 Punkte</p>
                </div>
              </Link>
              <Link
                href="/quiz"
                className="flex items-center gap-3 p-4 rounded-xl border border-amber-100 bg-amber-50 hover:bg-amber-100 transition-colors"
              >
                <Trophy className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">Quiz absolvieren</p>
                  <p className="text-xs text-amber-600">+30 Punkte</p>
                </div>
              </Link>
              <Link
                href="/lernen"
                className="flex items-center gap-3 p-4 rounded-xl border border-green-100 bg-green-50 hover:bg-green-100 transition-colors"
              >
                <Star className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-green-900">Lernpfad beginnen</p>
                  <p className="text-xs text-green-600">+100 Punkte</p>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
