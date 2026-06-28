'use client'

import { useState } from 'react'
import { Check, X, BookOpen } from 'lucide-react'
import { type QuizQuestion, QUIZ_CATEGORIES } from '@/data/quizzes'

interface QuizCardProps {
  question: QuizQuestion
  questionNumber: number
  totalQuestions: number
  onAnswer: (isCorrect: boolean) => void
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export default function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const categoryMeta = QUIZ_CATEGORIES.find((c) => c.id === question.category)

  function handleSelect(index: number) {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)
    const isCorrect = index === question.correctAnswer
    setTimeout(() => {
      onAnswer(isCorrect)
      setSelectedAnswer(null)
      setShowResult(false)
    }, 1800)
  }

  function getButtonClass(index: number): string {
    const base =
      'w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-300 '
    if (!showResult) {
      return base + 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
    }
    if (index === question.correctAnswer) {
      return base + 'border-green-500 bg-green-100 text-green-700'
    }
    if (index === selectedAnswer) {
      return base + 'border-red-500 bg-red-100 text-red-700'
    }
    return base + 'border-gray-200 bg-white text-gray-400 opacity-60'
  }

  const isCorrect = selectedAnswer === question.correctAnswer

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Progress header */}
      <div className="px-6 pt-5 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">
            Frage {questionNumber} von {totalQuestions}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            {categoryMeta && <span>{categoryMeta.icon}</span>}
            <span>{categoryMeta?.label ?? question.category}</span>
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900 leading-snug">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="px-6 pb-4 flex flex-col gap-2.5">
        {question.options.map((option, i) => (
          <button
            key={i}
            className={getButtonClass(i)}
            onClick={() => handleSelect(i)}
            disabled={showResult}
          >
            <span className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold">
              {OPTION_LABELS[i]}
            </span>
            <span className="text-sm font-medium leading-snug">{option}</span>
            {showResult && i === question.correctAnswer && (
              <Check className="ml-auto flex-shrink-0 w-5 h-5 text-green-600" />
            )}
            {showResult && i === selectedAnswer && i !== question.correctAnswer && (
              <X className="ml-auto flex-shrink-0 w-5 h-5 text-red-600" />
            )}
          </button>
        ))}
      </div>

      {/* Result / Explanation */}
      {showResult && (
        <div
          className={`mx-6 mb-5 rounded-xl p-4 transition-all duration-300 ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {isCorrect ? (
                <span className="text-2xl">\U0001f3af</span>
              ) : (
                <BookOpen className="w-5 h-5 text-red-500 mt-0.5" />
              )}
            </div>
            <div>
              <p className={`text-sm font-semibold mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? 'Richtig!' : 'Leider falsch'}
                {isCorrect && (
                  <span className="ml-2 inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    +{question.points} Punkte
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
              {question.articleRef && (
                <p className="text-xs text-gray-500 mt-1.5">
                  \u2192 Artikel {question.articleRef} EU AI Act
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
