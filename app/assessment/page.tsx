'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Shield, AlertTriangle, Info, CheckCircle, XCircle, ChevronRight, FileText } from 'lucide-react'
import type { AssessmentRecord, RiskLevel } from '@/lib/assessment-logic'
import { getRiskLevelLabel, getRiskLevelColor } from '@/lib/assessment-logic'

const STORAGE_KEY = 'complai_assessments'

function RiskBadge({ level }: { level: RiskLevel }) {
  const colors = getRiskLevelColor(level)
  const label = getRiskLevelLabel(level)
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.badge}`}>
      {label}
    </span>
  )
}

function RiskIcon({ level }: { level: RiskLevel }) {
  switch (level) {
    case 'VERBOTEN':
      return <XCircle className="h-5 w-5 text-red-600" />
    case 'HOCHRISIKO':
      return <AlertTriangle className="h-5 w-5 text-orange-500" />
    case 'BEGRENZTES_RISIKO':
      return <Info className="h-5 w-5 text-yellow-500" />
    case 'MINIMAL':
      return <CheckCircle className="h-5 w-5 text-green-600" />
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function AssessmentOverviewPage() {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const parsed: AssessmentRecord[] = raw ? JSON.parse(raw) : []
      setAssessments(parsed)
    } catch {
      setAssessments([])
    }
    setLoaded(true)
  }, [])

  const stats = {
    total: assessments.length,
    VERBOTEN: assessments.filter((a) => a.riskLevel === 'VERBOTEN').length,
    HOCHRISIKO: assessments.filter((a) => a.riskLevel === 'HOCHRISIKO').length,
    BEGRENZTES_RISIKO: assessments.filter((a) => a.riskLevel === 'BEGRENZTES_RISIKO').length,
    MINIMAL: assessments.filter((a) => a.riskLevel === 'MINIMAL').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Meine Assessments</h1>
                <p className="text-sm text-gray-500 mt-0.5">EU AI Act Risikoklassifizierungen</p>
              </div>
            </div>
            <Link
              href="/assessment/new"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="h-4 w-4" />
              Neues Assessment
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        {loaded && assessments.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500 mt-1">Gesamt</div>
            </div>
            <div className="bg-red-50 rounded-xl border border-red-200 p-4 text-center">
              <div className="text-2xl font-bold text-red-700">{stats.VERBOTEN}</div>
              <div className="text-xs text-red-600 mt-1">Verboten</div>
            </div>
            <div className="bg-orange-50 rounded-xl border border-orange-200 p-4 text-center">
              <div className="text-2xl font-bold text-orange-700">{stats.HOCHRISIKO}</div>
              <div className="text-xs text-orange-600 mt-1">Hochrisiko</div>
            </div>
            <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-700">{stats.BEGRENZTES_RISIKO}</div>
              <div className="text-xs text-yellow-600 mt-1">Begr. Risiko</div>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{stats.MINIMAL}</div>
              <div className="text-xs text-green-600 mt-1">Minimal</div>
            </div>
          </div>
        )}

        {/* List or empty state */}
        {!loaded ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : assessments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="p-4 bg-blue-50 rounded-2xl mb-4">
              <FileText className="h-10 w-10 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Noch keine Assessments</h2>
            <p className="text-gray-500 max-w-sm mb-6">
              Starten Sie Ihr erstes KI-Risiko-Assessment, um die EU AI Act Compliance Ihres Systems zu prüfen.
            </p>
            <Link
              href="/assessment/new"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Erstes Assessment starten
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {assessments.map((assessment) => {
              const colors = getRiskLevelColor(assessment.riskLevel)
              return (
                <Link
                  key={assessment.id}
                  href={`/assessment/${assessment.id}`}
                  className={`group flex items-center gap-4 bg-white rounded-xl border-2 ${colors.border} p-4 hover:shadow-md transition-all duration-200`}
                >
                  <div className={`flex-shrink-0 p-2.5 rounded-lg ${colors.bg}`}>
                    <RiskIcon level={assessment.riskLevel} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 truncate">{assessment.systemName}</h3>
                      <RiskBadge level={assessment.riskLevel} />
                    </div>
                    {assessment.systemDescription && (
                      <p className="text-sm text-gray-500 mt-0.5 truncate">{assessment.systemDescription}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{formatDate(assessment.createdAt)}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
