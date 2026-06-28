import Link from 'next/link'
import { Clock, BookOpen, ChevronRight, Award } from 'lucide-react'
import { LEARNING_PATHS, type LearningPath } from '@/data/learning-paths'

const COLOR_MAP: Record<string, { header: string; text: string; border: string; badge: string }> = {
  blue:   { header: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700' },
  purple: { header: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
  green:  { header: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-200',  badge: 'bg-green-100 text-green-700' },
  red:    { header: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200',    badge: 'bg-red-100 text-red-700' },
  orange: { header: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700' },
  cyan:   { header: 'bg-cyan-50',   text: 'text-cyan-600',   border: 'border-cyan-200',   badge: 'bg-cyan-100 text-cyan-700' },
}

const DIFFICULTY_LABELS: Record<LearningPath['difficulty'], string> = {
  beginner:     'Einsteiger',
  intermediate: 'Fortgeschritten',
  advanced:     'Experte',
}

const PERSONA_LABELS: Record<string, string> = {
  learner:   'Lernender',
  business:  'Unternehmer',
  developer: 'Entwickler',
  legal:     'Rechtsfachkraft',
}

export default function LernpfadePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Hero */}
      <section className="px-4 py-14 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
          <BookOpen className="w-4 h-4" />
          Lernpfade
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Strukturiert lernen</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          Kuratierte Lernpfade für deinen Einstieg in den EU AI Act – abgestimmt auf deine Rolle und
          dein Vorwissen.
        </p>
      </section>

      {/* Grid */}
      <section className="px-4 pb-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LEARNING_PATHS.map((path) => {
            const colors = COLOR_MAP[path.color] ?? COLOR_MAP['blue']
            return (
              <article
                key={path.id}
                className={`bg-white rounded-2xl border ${colors.border} shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow`}
              >
                {/* Card header */}
                <div className={`${colors.header} px-6 py-5 flex items-center gap-4`}>
                  <div className={`w-14 h-14 bg-white rounded-xl border ${colors.border} flex items-center justify-center text-3xl shadow-sm`}>
                    {path.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-gray-900 text-lg leading-tight">{path.title}</h2>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.badge}`}>
                        {DIFFICULTY_LABELS[path.difficulty]}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {path.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="px-6 py-4 flex-1 flex flex-col">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{path.description}</p>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                      <BookOpen className="w-3 h-3" />
                      {path.articles.length} Artikel
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                      <Award className="w-3 h-3" />
                      Badge inklusive
                    </span>
                  </div>

                  {/* Persona tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {path.targetPersona.map((p) => (
                      <span
                        key={p}
                        className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"
                      >
                        {PERSONA_LABELS[p] ?? p}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <Link
                      href={`/lernen/${path.id}`}
                      className={`flex items-center justify-center gap-2 w-full py-2.5 ${colors.text} border ${colors.border} ${colors.header} hover:opacity-80 font-semibold text-sm rounded-xl transition-opacity`}
                    >
                      Pfad starten
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
