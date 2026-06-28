import Link from 'next/link'
import { ArrowRight, Clock, BookOpen, ChevronRight, Award, Target, Play } from 'lucide-react'
import { LEARNING_PATHS, type LearningPath } from '@/data/learning-paths'

interface PageProps {
  params: Promise<{ pathId: string }>
}

const COLOR_MAP: Record<string, { header: string; text: string; border: string; badge: string; btn: string }> = {
  blue:   { header: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700',   btn: 'bg-blue-600 hover:bg-blue-700' },
  purple: { header: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', btn: 'bg-purple-600 hover:bg-purple-700' },
  green:  { header: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-200',  badge: 'bg-green-100 text-green-700',  btn: 'bg-green-600 hover:bg-green-700' },
  red:    { header: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200',    badge: 'bg-red-100 text-red-700',    btn: 'bg-red-600 hover:bg-red-700' },
  orange: { header: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', btn: 'bg-orange-600 hover:bg-orange-700' },
  cyan:   { header: 'bg-cyan-50',   text: 'text-cyan-600',   border: 'border-cyan-200',   badge: 'bg-cyan-100 text-cyan-700',   btn: 'bg-cyan-600 hover:bg-cyan-700' },
}

const DIFFICULTY_LABELS: Record<LearningPath['difficulty'], string> = {
  beginner:     'Einsteiger',
  intermediate: 'Fortgeschritten',
  advanced:     'Experte',
}

function getArticleDescription(articleNumber: number): string {
  if (articleNumber <= 5) return 'Grundlagen und Definitionen'
  if (articleNumber <= 10) return 'Risikoklassifikation und Anforderungen'
  if (articleNumber <= 20) return 'Hochrisiko-Systeme – Pflichten'
  if (articleNumber <= 30) return 'Konformität und Dokumentation'
  if (articleNumber <= 50) return 'Zertifizierung und Marktaufsicht'
  if (articleNumber <= 60) return 'GPAI und Allzweck-KI'
  if (articleNumber <= 80) return 'Governance und Aufsicht'
  return 'Sanktionen und Durchsetzung'
}

export default async function LernpfadDetailPage({ params }: PageProps) {
  const { pathId } = await params
  const path = LEARNING_PATHS.find((p) => p.id === pathId)

  if (!path) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 px-4">
        <div className="text-5xl">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900">Pfad nicht gefunden</h1>
        <p className="text-gray-500">Der gesuchte Lernpfad existiert nicht.</p>
        <Link
          href="/lernen"
          className="flex items-center gap-2 mt-2 text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          ← Alle Lernpfade
        </Link>
      </main>
    )
  }

  const colors = COLOR_MAP[path.color] ?? COLOR_MAP['blue']
  const firstArticle = path.articles[0]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Hero / Header */}
      <section className={`${colors.header} border-b ${colors.border} px-4 py-10`}>
        <div className="max-w-3xl mx-auto">
          <Link
            href="/lernen"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            ← Alle Lernpfade
          </Link>
          <div className="flex items-start gap-5">
            <div className={`w-16 h-16 bg-white rounded-2xl border ${colors.border} flex items-center justify-center text-3xl shadow-sm flex-shrink-0`}>
              {path.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{path.title}</h1>
              <p className="text-gray-600 leading-relaxed">{path.description}</p>
            </div>
          </div>

          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <span className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full ${colors.badge}`}>
              <Target className="w-3.5 h-3.5" />
              {DIFFICULTY_LABELS[path.difficulty]}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
              <Clock className="w-3.5 h-3.5" />
              {path.duration}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
              <BookOpen className="w-3.5 h-3.5" />
              {path.articles.length} Artikel
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
              <Award className="w-3.5 h-3.5" />
              Badge: {path.badge}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Article playlist – 2/3 width */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Playlist header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Inhalt des Lernpfads</h2>
                <span className="text-sm text-gray-400">0 / {path.articles.length} abgeschlossen</span>
              </div>

              {/* Article list */}
              <ol className="divide-y divide-gray-50">
                {path.articles.map((articleNum, idx) => (
                  <li key={articleNum}>
                    <Link
                      href={`/artikel/${articleNum}`}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                    >
                      {/* Number badge */}
                      <div className={`w-8 h-8 rounded-full ${colors.header} border ${colors.border} flex items-center justify-center text-xs font-bold ${colors.text} flex-shrink-0`}>
                        {idx + 1}
                      </div>

                      {/* Article info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm">
                          Artikel {articleNum} EU AI Act
                        </p>
                        <p className="text-xs text-gray-400 truncate">{getArticleDescription(articleNum)}</p>
                      </div>

                      {/* Play / Arrow */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-xs text-gray-400 hidden sm:inline group-hover:hidden">
                          Artikel {articleNum}
                        </span>
                        <Play className={`w-4 h-4 ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Sidebar – 1/3 width */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* CTA */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Bereit?</h3>
              <p className="text-sm text-gray-500 mb-4">Starte jetzt mit dem ersten Artikel und verdiene dein Badge.</p>
              <Link
                href={`/artikel/${firstArticle}`}
                className={`flex items-center justify-center gap-2 w-full py-2.5 ${colors.btn} text-white font-semibold text-sm rounded-xl transition-colors`}
              >
                <Play className="w-4 h-4" />
                Pfad beginnen
              </Link>
            </div>

            {/* Progress (static – client-side hydration would update this) */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Dein Fortschritt</h3>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                <div className={`${colors.btn} h-2 rounded-full`} style={{ width: '0%' }} />
              </div>
              <p className="text-xs text-gray-500">0 von {path.articles.length} Artikeln abgeschlossen</p>
            </div>

            {/* What you'll learn */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Du lernst</h3>
              <ul className="flex flex-col gap-2">
                {path.articles.slice(0, 4).map((num) => (
                  <li key={num} className="flex items-start gap-2 text-sm text-gray-600">
                    <ArrowRight className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${colors.text}`} />
                    Art. {num}: {getArticleDescription(num)}
                  </li>
                ))}
                {path.articles.length > 4 && (
                  <li className="text-xs text-gray-400">+ {path.articles.length - 4} weitere Artikel</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
