// Gamification library for ComplAI
// Manages levels, badges, XP, and user stats via localStorage

export interface Level {
  level: number
  title: string
  icon: string
  minPoints: number
  maxPoints: number | null
}

export interface Badge {
  id: string
  title: string
  description: string
  icon: string
  category: 'reading' | 'assessment' | 'streak' | 'quiz' | 'social' | 'exploration'
}

export interface UserStats {
  totalPoints: number
  articlesRead: number
  assessmentsCompleted: number
  highlightsCreated: number
  notesCreated: number
  currentStreak: number
  longestStreak: number
  quizzesCompleted: number
  perfectQuizzes: number
  pathsCompleted: number
  sharedCount: number
  chaptersVisited: number
  earnedBadges: string[]
  lastVisit?: string
  joinDate?: string
}

export const LEVELS: Level[] = [
  { level: 1, title: 'Einsteiger',  icon: '🌱', minPoints: 0,    maxPoints: 99 },
  { level: 2, title: 'Lernender',   icon: '📖', minPoints: 100,  maxPoints: 299 },
  { level: 3, title: 'Entdecker',   icon: '🔍', minPoints: 300,  maxPoints: 699 },
  { level: 4, title: 'Kenner',      icon: '🎓', minPoints: 700,  maxPoints: 1399 },
  { level: 5, title: 'Experte',     icon: '⭐', minPoints: 1400, maxPoints: 2499 },
  { level: 6, title: 'Meister',     icon: '🏆', minPoints: 2500, maxPoints: 4499 },
  { level: 7, title: 'KI-Guru',     icon: '🚀', minPoints: 4500, maxPoints: null },
]

export const BADGES: Badge[] = [
  {
    id: 'first_read',
    title: 'Erster Artikel',
    description: 'Du hast deinen ersten Artikel gelesen.',
    icon: '📄',
    category: 'reading',
  },
  {
    id: 'eager_reader',
    title: 'Eifriger Leser',
    description: 'Du hast 10 Artikel gelesen.',
    icon: '📚',
    category: 'reading',
  },
  {
    id: 'bookworm',
    title: 'Bücherwurm',
    description: 'Du hast 50 Artikel gelesen.',
    icon: '🐛',
    category: 'reading',
  },
  {
    id: 'first_assessment',
    title: 'Erste Prüfung',
    description: 'Du hast dein erstes Assessment abgeschlossen.',
    icon: '🛡️',
    category: 'assessment',
  },
  {
    id: 'assessment_pro',
    title: 'Assessment-Profi',
    description: 'Du hast 5 Assessments abgeschlossen.',
    icon: '⚖️',
    category: 'assessment',
  },
  {
    id: 'streak_3',
    title: '3-Tage-Streak',
    description: 'Du warst 3 Tage in Folge aktiv.',
    icon: '🔥',
    category: 'streak',
  },
  {
    id: 'streak_7',
    title: 'Wöchentlich!',
    description: 'Du warst 7 Tage in Folge aktiv.',
    icon: '💥',
    category: 'streak',
  },
  {
    id: 'streak_30',
    title: 'Monatsheld',
    description: 'Du warst 30 Tage in Folge aktiv.',
    icon: '🌟',
    category: 'streak',
  },
  {
    id: 'quiz_master',
    title: 'Quiz-Meister',
    description: 'Du hast 3 Quizze abgeschlossen.',
    icon: '🧠',
    category: 'quiz',
  },
  {
    id: 'perfect_quiz',
    title: 'Perfektes Quiz',
    description: 'Du hast ein Quiz ohne Fehler abgeschlossen.',
    icon: '💯',
    category: 'quiz',
  },
  {
    id: 'first_share',
    title: 'Teiler',
    description: 'Du hast deinen ersten Inhalt geteilt.',
    icon: '📢',
    category: 'social',
  },
  {
    id: 'explorer',
    title: 'Entdecker',
    description: 'Du hast 5 verschiedene Kapitel besucht.',
    icon: '🗺️',
    category: 'exploration',
  },
]

export const POINTS = {
  ARTICLE_READ: 20,
  ASSESSMENT_COMPLETED: 50,
  QUIZ_COMPLETED: 30,
  PERFECT_QUIZ_BONUS: 20,
  HIGHLIGHT_CREATED: 5,
  NOTE_CREATED: 10,
  PATH_COMPLETED: 100,
  SHARE: 15,
  DAILY_LOGIN: 5,
  BADGE_EARNED: 25,
} as const

const STORAGE_KEY = 'complai_user_stats'

export const DEFAULT_STATS: UserStats = {
  totalPoints: 0,
  articlesRead: 0,
  assessmentsCompleted: 0,
  highlightsCreated: 0,
  notesCreated: 0,
  currentStreak: 0,
  longestStreak: 0,
  quizzesCompleted: 0,
  perfectQuizzes: 0,
  pathsCompleted: 0,
  sharedCount: 0,
  chaptersVisited: 0,
  earnedBadges: [],
  joinDate: new Date().toISOString(),
  lastVisit: new Date().toISOString(),
}

export function loadUserStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_STATS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATS
    return { ...DEFAULT_STATS, ...JSON.parse(raw) } as UserStats
  } catch {
    return DEFAULT_STATS
  }
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch {
    // silently fail if localStorage is unavailable
  }
}

export function getCurrentLevel(totalPoints: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalPoints >= LEVELS[i].minPoints) return LEVELS[i]
  }
  return LEVELS[0]
}

export function getNextLevel(totalPoints: number): Level | null {
  const current = getCurrentLevel(totalPoints)
  const nextIdx = LEVELS.findIndex((l) => l.level === current.level + 1)
  return nextIdx >= 0 ? LEVELS[nextIdx] : null
}

export function getProgressToNextLevel(totalPoints: number): number {
  const current = getCurrentLevel(totalPoints)
  const next = getNextLevel(totalPoints)
  if (!next) return 100
  const range = next.minPoints - current.minPoints
  const earned = totalPoints - current.minPoints
  return Math.min(100, Math.max(0, Math.round((earned / range) * 100)))
}

export function addPoints(stats: UserStats, points: number): UserStats {
  return { ...stats, totalPoints: stats.totalPoints + points }
}

export function awardBadge(stats: UserStats, badgeId: string): UserStats {
  if (stats.earnedBadges.includes(badgeId)) return stats
  return {
    ...stats,
    earnedBadges: [...stats.earnedBadges, badgeId],
    totalPoints: stats.totalPoints + POINTS.BADGE_EARNED,
  }
}

export function checkAndAwardBadges(stats: UserStats): UserStats {
  let updated = { ...stats }

  if (updated.articlesRead >= 1 && !updated.earnedBadges.includes('first_read'))
    updated = awardBadge(updated, 'first_read')
  if (updated.articlesRead >= 10 && !updated.earnedBadges.includes('eager_reader'))
    updated = awardBadge(updated, 'eager_reader')
  if (updated.articlesRead >= 50 && !updated.earnedBadges.includes('bookworm'))
    updated = awardBadge(updated, 'bookworm')
  if (updated.assessmentsCompleted >= 1 && !updated.earnedBadges.includes('first_assessment'))
    updated = awardBadge(updated, 'first_assessment')
  if (updated.assessmentsCompleted >= 5 && !updated.earnedBadges.includes('assessment_pro'))
    updated = awardBadge(updated, 'assessment_pro')
  if (updated.currentStreak >= 3 && !updated.earnedBadges.includes('streak_3'))
    updated = awardBadge(updated, 'streak_3')
  if (updated.currentStreak >= 7 && !updated.earnedBadges.includes('streak_7'))
    updated = awardBadge(updated, 'streak_7')
  if (updated.currentStreak >= 30 && !updated.earnedBadges.includes('streak_30'))
    updated = awardBadge(updated, 'streak_30')
  if (updated.quizzesCompleted >= 3 && !updated.earnedBadges.includes('quiz_master'))
    updated = awardBadge(updated, 'quiz_master')
  if (updated.perfectQuizzes >= 1 && !updated.earnedBadges.includes('perfect_quiz'))
    updated = awardBadge(updated, 'perfect_quiz')
  if (updated.sharedCount >= 1 && !updated.earnedBadges.includes('first_share'))
    updated = awardBadge(updated, 'first_share')
  if (updated.chaptersVisited >= 5 && !updated.earnedBadges.includes('explorer'))
    updated = awardBadge(updated, 'explorer')

  return updated
}
