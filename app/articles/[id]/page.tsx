import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, ChevronRight, Clock, BookOpen, Calendar, Tag } from 'lucide-react'
import { AI_ACT_ARTICLES, type Article } from '@/data/ai-act-articles'
import ArticleReader from '@/components/articles/ArticleReader'

interface Props {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return AI_ACT_ARTICLES.map((a) => ({ id: String(a.number) }))
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params
  const article = AI_ACT_ARTICLES.find((a) => a.number === Number(id))
  if (!article) notFound()

  const sortedArticles = [...AI_ACT_ARTICLES].sort((a, b) => a.number - b.number)
  const currentIndex = sortedArticles.findIndex((a) => a.number === article.number)
  const prev = sortedArticles[currentIndex - 1] ?? null
  const next = sortedArticles[currentIndex + 1] ?? null

  const related = AI_ACT_ARTICLES.filter((a) => article.relatedArticles.includes(a.number))

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/articles" className="hover:text-indigo-600 flex items-center gap-1">
            <BookOpen className="w-4 h-4" /> Alle Artikel
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium">Art. {article.number}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm font-mono bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg font-bold">
                  Art. {article.number}
                </span>
                {article.riskLevel && (
                  <RiskBadge riskLevel={article.riskLevel} />
                )}
                <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-lg">
                  Kapitel {article.chapter}: {article.chapterTitle}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{article.title}</h1>
              <p className="text-gray-600 leading-relaxed">{article.summary}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {article.estimatedReadTime} Min. Lesezeit
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> {article.learningPoints} Lernpunkte
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> In Kraft ab {new Date(article.inForceDate).toLocaleDateString('de-DE')}
                </span>
              </div>
            </div>

            {/* Tabs + Content */}
            <ArticleReader article={article} />

            {/* Keywords */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" /> Schlagworte
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((kw) => (
                  <Link
                    key={kw}
                    href={`/search?q=${encodeURIComponent(kw)}`}
                    className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    {kw}
                  </Link>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between gap-4 mt-6">
              {prev ? (
                <Link
                  href={`/articles/${prev.number}`}
                  className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm hover:border-indigo-200 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <div>
                    <div className="text-gray-400 text-xs">Vorheriger</div>
                    <div className="font-medium text-gray-800">Art. {prev.number}: {prev.title}</div>
                  </div>
                </Link>
              ) : <div />}
              {next ? (
                <Link
                  href={`/articles/${next.number}`}
                  className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm hover:border-indigo-200 transition-colors text-right ml-auto"
                >
                  <div>
                    <div className="text-gray-400 text-xs">Naechster</div>
                    <div className="font-medium text-gray-800">Art. {next.number}: {next.title}</div>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : <div />}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Verwandte Artikel</h3>
              {related.length > 0 ? (
                <ul className="space-y-2">
                  {related.map((r) => (
                    <li key={r.number}>
                      <Link
                        href={`/articles/${r.number}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                      >
                        <span className="font-mono text-xs bg-gray-50 px-1.5 py-0.5 rounded">Art. {r.number}</span>
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">Keine verwandten Artikel</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function RiskBadge({ riskLevel }: { riskLevel: NonNullable<Article['riskLevel']> }) {
  const map: Record<NonNullable<Article['riskLevel']>, { label: string; className: string }> = {
    prohibited: { label: 'Verboten', className: 'bg-red-100 text-red-700' },
    'high-risk': { label: 'Hochrisiko', className: 'bg-orange-100 text-orange-700' },
    limited: { label: 'Begrenztes Risiko', className: 'bg-blue-100 text-blue-700' },
    minimal: { label: 'Minimales Risiko', className: 'bg-green-100 text-green-700' },
  }
  const { label, className } = map[riskLevel]
  return <span className={`text-sm font-semibold px-3 py-1 rounded-lg ${className}`}>{label}</span>
}
