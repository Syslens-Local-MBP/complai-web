'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Clock, BookOpen, ChevronRight, Filter } from 'lucide-react'
import { AI_ACT_ARTICLES, CHAPTERS, type Article } from '@/data/ai-act-articles'

const RISK_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  prohibited: { label: 'Verboten', color: 'text-red-700', bg: 'bg-red-100' },
  'high-risk': { label: 'Hochrisiko', color: 'text-orange-700', bg: 'bg-orange-100' },
  limited: { label: 'Begrenztes Risiko', color: 'text-blue-700', bg: 'bg-blue-100' },
  minimal: { label: 'Minimales Risiko', color: 'text-green-700', bg: 'bg-green-100' },
}

const COMPLEXITY_LABELS: Record<Article['complexity'], string> = {
  basic: 'Grundlagen',
  intermediate: 'Fortgeschritten',
  advanced: 'Experte',
}

export default function ArticlesPage() {
  const [search, setSearch] = useState('')
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return AI_ACT_ARTICLES.filter((a) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.keywords.some((k) => k.toLowerCase().includes(q)) ||
        String(a.number).includes(q)
      const matchesChapter = selectedChapter === null || a.chapter === selectedChapter
      const matchesRisk = selectedRisk === null || a.riskLevel === selectedRisk
      return matchesSearch && matchesChapter && matchesRisk
    })
  }, [search, selectedChapter, selectedRisk])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Hero */}
      <section className="px-4 py-12 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
          <BookOpen className="w-4 h-4" />
          EU AI Act Artikel
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Alle Artikel im Überblick</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          113 Artikel, übersichtlich aufbereitet. Volltext, vereinfachte Erklärung und technische Details für jeden Artikel.
        </p>
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100 px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Artikel suchen (z.B. Biometrie, Hochrisiko, Art. 5)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedChapter ?? ''}
              onChange={(e) => setSelectedChapter(e.target.value ? Number(e.target.value) : null)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">Alle Kapitel</option>
              {CHAPTERS.map((c) => (
                <option key={c.number} value={c.number}>Kap. {c.number}: {c.title}</option>
              ))}
            </select>
            <select
              value={selectedRisk ?? ''}
              onChange={(e) => setSelectedRisk(e.target.value || null)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">Alle Risikoklassen</option>
              <option value="prohibited">Verboten</option>
              <option value="high-risk">Hochrisiko</option>
              <option value="limited">Begrenztes Risiko</option>
              <option value="minimal">Minimales Risiko</option>
            </select>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="px-4 py-8 max-w-5xl mx-auto">
        <p className="text-sm text-gray-500 mb-6">
          <span className="font-semibold text-gray-900">{filtered.length}</span> Artikel gefunden
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((article) => {
            const risk = article.riskLevel ? RISK_LABELS[article.riskLevel] : null
            return (
              <Link
                key={article.number}
                href={`/articles/${article.number}`}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold">
                      Art. {article.number}
                    </span>
                    {risk && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${risk.bg} ${risk.color}`}>
                        {risk.label}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors flex-shrink-0 mt-0.5" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-sm leading-tight mb-1">{article.title}</h2>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{article.summary}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.estimatedReadTime} Min.
                  </span>
                  <span>{article.learningPoints} Punkte</span>
                  <span className="ml-auto text-gray-300">{COMPLEXITY_LABELS[article.complexity]}</span>
                </div>
                {article.keywords.slice(0, 3).map((kw) => (
                  <span key={kw} className="inline-block text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded mr-1">
                    {kw}
                  </span>
                ))}
              </Link>
            )
          })}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Filter className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Keine Artikel gefunden</p>
            <p className="text-sm mt-1">Probiere andere Suchbegriffe oder Filter</p>
          </div>
        )}
      </section>
    </main>
  )
}
