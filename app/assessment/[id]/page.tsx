'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  AlertTriangle,
  Shield,
  CheckCircle,
  XCircle,
  Info,
  Copy,
  Check,
  Loader2,
  Sparkles,
  Clock,
  ExternalLink,
} from 'lucide-react'
import type { AssessmentRecord, AssessmentResult, RiskLevel, ComplianceRequirement } from '@/lib/assessment-logic'
import { getRiskLevelColor, getRiskLevelLabel } from '@/lib/assessment-logic'

const STORAGE_KEY = 'complai_assessments'

// ─── Risk level icon ──────────────────────────────────────────────────────────
function RiskIcon({ level, size = 'md' }: { level: RiskLevel; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'h-12 w-12' : size === 'md' ? 'h-7 w-7' : 'h-5 w-5'
  switch (level) {
    case 'VERBOTEN':
      return <XCircle className={`${cls} text-red-600`} />
    case 'HOCHRISIKO':
      return <AlertTriangle className={`${cls} text-orange-500`} />
    case 'BEGRENZTES_RISIKO':
      return <Info className={`${cls} text-yellow-500`} />
    case 'MINIMAL':
      return <CheckCircle className={`${cls} text-green-600`} />
  }
}

// ─── Effort badge ─────────────────────────────────────────────────────────────
function EffortBadge({ effort }: { effort: 'hoch' | 'mittel' | 'niedrig' }) {
  const styles: Record<string, string> = {
    hoch: 'bg-red-100 text-red-700',
    mittel: 'bg-yellow-100 text-yellow-700',
    niedrig: 'bg-green-100 text-green-700',
  }
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${styles[effort]}`}>
      {effort.charAt(0).toUpperCase() + effort.slice(1)}
    </span>
  )
}

// ─── Format date ──────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── Checklist item ───────────────────────────────────────────────────────────
function ChecklistItem({
  req,
  checked,
  onToggle,
}: {
  req: ComplianceRequirement
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-200 ${
        checked ? 'border-green-200 bg-green-50 opacity-70' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onToggle}
          aria-label={checked ? 'Als unerledigt markieren' : 'Als erledigt markieren'}
          className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-all duration-150 ${
            checked ? 'border-green-500 bg-green-500' : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          {checked && <Check className="h-3 w-3 text-white" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <p className={`text-sm font-semibold ${checked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {req.title}
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <EffortBadge effort={req.effort} />
              {req.mandatory && (
                <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                  Pflicht
                </span>
              )}
            </div>
          </div>
          <p className={`text-xs mt-1 ${checked ? 'text-gray-400' : 'text-gray-600'}`}>{req.description}</p>
          <p className="text-xs text-blue-600 mt-1.5 font-medium">{req.articleRef}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AssessmentResultPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [assessment, setAssessment] = useState<AssessmentRecord | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)
  const [analysisText, setAnalysisText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState('')
  const analysisRef = useRef<HTMLDivElement>(null)

  // Load assessment from localStorage
  useEffect(() => {
    if (!id) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const records: AssessmentRecord[] = raw ? JSON.parse(raw) : []
      const found = records.find((r) => r.id === id)
      if (found) {
        setAssessment(found)
        // Load checklist state
        const checkKey = `complai_checklist_${id}`
        const savedChecks = localStorage.getItem(checkKey)
        if (savedChecks) {
          setCheckedItems(new Set(JSON.parse(savedChecks)))
        }
      } else {
        setNotFound(true)
      }
    } catch {
      setNotFound(true)
    }
  }, [id])

  // Persist checklist state
  function toggleCheck(reqId: string) {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(reqId)) {
        next.delete(reqId)
      } else {
        next.add(reqId)
      }
      try {
        localStorage.setItem(`complai_checklist_${id}`, JSON.stringify(Array.from(next)))
      } catch {
        // ignore
      }
      return next
    })
  }

  // Copy link
  function copyLink() {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).catch(() => {})
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Streaming Claude analysis
  async function loadAnalysis() {
    if (!assessment || isAnalyzing) return
    setIsAnalyzing(true)
    setAnalysisText('')
    setAnalysisError('')

    try {
      const response = await fetch('/api/assessment/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: assessment.answers, result: assessment.result }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('Kein Antwort-Stream verfügbar.')

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setAnalysisText((prev) => prev + decoder.decode(value))
        if (analysisRef.current) {
          analysisRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
      }
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : 'Unbekannter Fehler')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // ─── Loading / not-found states ────────────────────────────────────────────
  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Assessment nicht gefunden</h1>
          <p className="text-gray-500 mb-6">Das angeforderte Assessment existiert nicht.</p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const result: AssessmentResult = assessment.result
  const colors = getRiskLevelColor(result.riskLevel)
  const label = getRiskLevelLabel(result.riskLevel)
  const doneCount = checkedItems.size
  const totalCount = result.requirements.length
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Übersicht
          </Link>
          <h1 className="font-semibold text-gray-900 truncate text-center flex-1">{assessment.systemName}</h1>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors flex-shrink-0"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-green-600">Kopiert!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Link kopieren
              </>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Risk level hero banner */}
        <div className={`rounded-2xl border-2 ${colors.border} ${colors.bg} p-6 sm:p-8`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className={`p-3 rounded-2xl border ${colors.border} bg-white flex-shrink-0`}>
              <RiskIcon level={result.riskLevel} size="lg" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`}>
                  Risikoklassifizierung
                </span>
              </div>
              <h2 className={`text-3xl font-bold ${colors.text} mb-3`}>{label}</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{result.reasoning}</p>
              <p className="text-xs text-gray-400 mt-3">{formatDate(assessment.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Relevant articles */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            Relevante Artikel (EU AI Act)
          </h2>
          <div className="flex flex-wrap gap-2">
            {result.relevantArticles.map((n) => (
              <Link
                key={n}
                href={`/artikel/${n}`}
                className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
              >
                Art. {n}
                <ExternalLink className="h-3 w-3 opacity-60" />
              </Link>
            ))}
          </div>
        </section>

        {/* Compliance checklist */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              Compliance-Anforderungen
            </h2>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500 tabular-nums">
                {doneCount}/{totalCount} erledigt
              </div>
              <div className="w-24 h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {result.requirements.map((req) => (
              <ChecklistItem
                key={req.id}
                req={req}
                checked={checkedItems.has(req.id)}
                onToggle={() => toggleCheck(req.id)}
              />
            ))}
          </div>
        </section>

        {/* Claude AI analysis */}
        <section className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <h2 className="text-base font-semibold text-gray-900">KI-Tiefenanalyse</h2>
            </div>
            {!analysisText && (
              <button
                type="button"
                onClick={loadAnalysis}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-60 transition-colors"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analysiere...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    KI-Tiefenanalyse laden
                  </>
                )}
              </button>
            )}
          </div>

          <div className="px-6 py-5">
            {!analysisText && !isAnalyzing && !analysisError && (
              <div className="text-center py-8">
                <Sparkles className="h-8 w-8 text-purple-200 mx-auto mb-3" />
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  Claude analysiert Ihr KI-System kontextbezogen und gibt detaillierte, praxisnahe
                  Handlungsempfehlungen zur EU AI Act Compliance.
                </p>
              </div>
            )}

            {isAnalyzing && !analysisText && (
              <div className="flex items-center gap-3 py-8 justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
                <span className="text-sm text-gray-500">Analyse wird generiert...</span>
              </div>
            )}

            {analysisError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-sm text-red-700">
                  Fehler beim Laden der Analyse: {analysisError}
                </p>
              </div>
            )}

            {analysisText && (
              <div ref={analysisRef}>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {analysisText}
                  {isAnalyzing && (
                    <span className="inline-block w-1 h-4 ml-0.5 bg-purple-500 animate-pulse rounded-sm" />
                  )}
                </div>
                {!isAnalyzing && (
                  <button
                    type="button"
                    onClick={loadAnalysis}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Sparkles className="h-3 w-3" />
                    Erneut generieren
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Compliance timeline */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            Compliance-Zeitplan
          </h2>
          <div className="relative pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200 rounded-full" />
            <div className="space-y-6">
              {result.timeline.map((item, i) => (
                <div key={i} className="relative">
                  <div
                    className={`absolute -left-6 mt-0.5 h-4 w-4 rounded-full border-2 border-white shadow-sm ${
                      i === 0 ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                  <div className="pl-3">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{item.date}</span>
                    <h3 className="text-sm font-semibold text-gray-900 mt-0.5">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200">
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Kopiert!' : 'Link kopieren'}
          </button>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Alle Assessments
          </Link>
          <Link
            href="/assessment/new"
            className="ml-auto inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Shield className="h-4 w-4" />
            Neues Assessment
          </Link>
        </div>
      </main>
    </div>
  )
}
