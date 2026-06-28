'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, ArrowRight, BookOpen } from 'lucide-react'
import Fuse from 'fuse.js'
import { AI_ACT_ARTICLES } from '@/data/ai-act-articles'

const fuse = new Fuse(AI_ACT_ARTICLES, {
  keys: [
    { name: 'title', weight: 3 },
    { name: 'summary', weight: 2 },
    { name: 'keywords', weight: 2 },
    { name: 'content', weight: 1 },
    { name: 'simplified', weight: 1 },
  ],
  threshold: 0.35,
  includeScore: true,
  includeMatches: true,
})

const SUGGESTIONS = ['Hochrisiko', 'Social Scoring', 'GPAI', 'Biometrie', 'Deepfake', 'Geldbußen', 'Transparenz']

function SearchInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQ = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initialQ)

  const results = useMemo(() => {
    if (!query.trim()) return []
    return fuse.search(query).slice(0, 20)
  }, [query])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <section className="px-4 py-16 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
          <Search className="w-4 h-4" />
          Volltext-Suche
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">EU AI Act durchsuchen</h1>
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Suche nach Begriffen, Artikel-Nummern oder Themen...'
            className="w-full pl-12 pr-16 py-4 text-lg border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        {!query && (
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <span className="text-sm text-gray-400">Probiere:</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="text-sm bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </section>

      {query && (
        <section className="px-4 pb-16 max-w-3xl mx-auto">
          {results.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="font-medium">Keine Ergebnisse fur &quot;{query}&quot;</p>
              <p className="text-sm mt-1">Versuche einen anderen Suchbegriff</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                <span className="font-semibold text-gray-900">{results.length}</span> Ergebnisse fur &quot;{query}&quot;
              </p>
              <ul className="space-y-3">
                {results.map(({ item }) => (
                  <li key={item.number}>
                    <Link
                      href={`/articles/${item.number}`}
                      className="bg-white border border-gray-100 rounded-xl p-5 flex items-start gap-4 hover:border-indigo-200 hover:shadow-sm transition-all group"
                    >
                      <span className="text-xs font-mono bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-bold flex-shrink-0">
                        Art. {item.number}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">{item.summary}</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.keywords.slice(0, 4).map((kw) => (
                            <span key={kw} className="text-xs bg-gray-50 text-gray-400 px-2 py-0.5 rounded">{kw}</span>
                          ))}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 flex-shrink-0 mt-1 transition-colors" />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchInner />
    </Suspense>
  )
}
