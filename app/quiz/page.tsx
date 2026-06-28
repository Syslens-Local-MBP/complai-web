'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { BookOpen, Trophy, RotateCcw, ArrowRight, Zap } from 'lucide-react'
import { QUIZ_QUESTIONS, QUIZ_CATEGORIES, type QuizQuestion } from '@/data/quizzes'
import QuizCard from '@/components/quiz/QuizCard'
import {
  loadUserStats,
  saveUserStats,
  checkAndAwardBadges,
  type UserStats,
} from '@/lib/gamification'

type QuizState = 'selection' | 'playing' | 'completed'

interface Score {
  correct: number
  total: number
  points: number
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  red:    { bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  green:  { bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-200' },
  cyan:   { bg: 'bg-cyan-50',   text: 'text-cyan-600',   border: 'border-cyan-200' },
}

/** Map from QUIZ_CATEGORIES id to a color key */
const CATEGORY_COLORS: Record<string, string> = {
  grundlagen: 'blue',
  verbote:    'red',
  hochrisiko: 'orange',
  transparenz:'purple',
  gpai:       'green',
  durchsetzung:'cyan',
}

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>('selection')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState<Score>({ correct: 0, total: 0, points: 0 })
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([])

  function startQuiz(categoryId: string | null) {
    const base =
      categoryId === null
        ? QUIZ_QUESTIONS
        : QUIZ_QUESTIONS.filter((q) => q.category === categoryId)
    setShuffledQuestions(shuffleArray(base))
    setSelectedCategory(categoryId)
    setCurrentQuestionIndex(0)
    setScore({ correct: 0, total: 0, points: 0 })
    setQuizState('playing')
  }

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      const pointsEarned = isCorrect ? shuffledQuestions[currentQuestionIndex].points : 0
      const newScore: Score = {
        correct: score.correct + (isCorrect ? 1 : 0),
        total: score.total + 1,
        points: score.points + pointsEarned,
      }
      setScore(newScore)

      if (currentQuestionIndex + 1 >= shuffledQuestions.length) {
        // Quiz complete – persist gamification
        const stats = loadUserStats()
        const isPerfect = newScore.correct === shuffledQuestions.length
        const updated: UserStats = {
          ...stats,
          totalPoints: stats.totalPoints + newScore.points,
          quizzesCompleted: stats.quizzesCompleted + 1,
          perfectQuizzes: isPerfect ? stats.perfectQuizzes + 1 : stats.perfectQuizzes,
        }
        const withBadges = checkAndAwardBadges(updated)
        saveUserStats(withBadges)
        setQuizState('completed')
      } else {
        setCurrentQuestionIndex((i) => i + 1)
      }
    },
    [currentQuestionIndex, score, shuffledQuestions],
  )

  function resetQuiz() {
    setQuizState('selection')
    setSelectedCategory(null)
    setCurrentQuestionIndex(0)
    setScore({ correct: 0, total: 0, points: 0 })
    setShuffledQuestions([])
  }

  const percentage =
    shuffledQuestions.length > 0
      ? Math.round((score.correct / shuffledQuestions.length) * 100)
      : 0

  // ── Selection View ──────────────────────────────────────────
  if (quizState === 'selection') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <BookOpen className="w-4 h-4" />
              Quiz
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">EU AI Act Quiz</h1>
            <p className="text-gray-500 text-lg">Teste dein Wissen</p>
            <p className="text-sm text-gray-400 mt-2">
              {QUIZ_QUESTIONS.length} Fragen · {QUIZ_QUESTIONS.reduce((s, q) => s + q.points, 0)} mögliche Punkte
            </p>
          </div>

          {/* "All questions" card */}
          <button
            onClick={() => startQuiz(null)}
            className="w-full mb-4 flex items-center gap-4 p-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-md transition-all duration-200 group"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              🎯
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-lg">Alle Fragen</p>
              <p className="text-indigo-200 text-sm">{QUIZ_QUESTIONS.length} Fragen · Komplettes Quiz</p>
            </div>
            <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Category cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUIZ_CATEGORIES.map((cat) => {
              const count = QUIZ_QUESTIONS.filter((q) => q.category === cat.id).length
              const colorKey = CATEGORY_COLORS[cat.id] ?? 'blue'
              const colors = COLOR_MAP[colorKey]
              return (
                <button
                  key={cat.id}
                  onClick={() => startQuiz(cat.id)}
                  className={`flex items-center gap-4 p-4 ${colors.bg} border ${colors.border} rounded-xl hover:shadow-md transition-all duration-200 group text-left`}
                >
                  <div className={`w-11 h-11 rounded-xl bg-white border ${colors.border} flex items-center justify-center text-xl flex-shrink-0`}>
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold ${colors.text}`}>{cat.label}</p>
                    <p className="text-xs text-gray-500 truncate">{cat.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{count} Fragen</p>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${colors.text} opacity-50 group-hover:translate-x-0.5 transition-transform`} />
                </button>
              )
            })}
          </div>
        </div>
      </main>
    )
  }

  // ── Playing View ─────────────────────────────────────────────
  if (quizState === 'playing') {
    const currentQuestion = shuffledQuestions[currentQuestionIndex]
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={resetQuiz}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
            >
              ← Abbrechen
            </button>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <Zap className="w-4 h-4" />
              {score.points} Punkte
            </div>
          </div>

          <QuizCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={shuffledQuestions.length}
            onAnswer={handleAnswer}
          />
        </div>
      </main>
    )
  }

  // ── Completed View ────────────────────────────────────────────
  const feedbackEmoji = percentage >= 80 ? '🎯' : percentage >= 60 ? '👍' : '💪'
  const feedbackText =
    percentage >= 80
      ? 'Ausgezeichnet!'
      : percentage >= 60
        ? 'Gut gemacht!'
        : 'Weiter üben!'

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
          <div className="text-5xl mb-4">{feedbackEmoji}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{feedbackText}</h2>

          {/* Score ring */}
          <div className="my-6 flex flex-col items-center gap-1">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E5E7EB" strokeWidth="2.5" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke={percentage >= 80 ? '#10B981' : percentage >= 60 ? '#3B82F6' : '#F59E0B'}
                  strokeWidth="2.5"
                  strokeDasharray={`${percentage} ${100 - percentage}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
              </div>
            </div>
            <p className="text-gray-600 font-medium">
              {score.correct}/{shuffledQuestions.length} richtig
            </p>
          </div>

          {/* Points */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <span className="font-bold text-amber-700 text-lg">{score.points} Punkte verdient!</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => startQuiz(selectedCategory)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Nochmal spielen
            </button>
            <button
              onClick={resetQuiz}
              className="w-full py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Alle Kategorien
            </button>
            <Link
              href="/profil"
              className="flex items-center justify-center gap-2 w-full py-3 text-indigo-600 hover:text-indigo-700 font-semibold rounded-xl border border-indigo-200 hover:bg-indigo-50 transition-colors"
            >
              Profil anzeigen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
