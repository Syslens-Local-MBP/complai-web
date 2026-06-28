'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronRight,
  ChevronLeft,
  Check,
  AlertTriangle,
  Shield,
  X,
  Users,
  Building,
  Cpu,
  CheckCircle,
  XCircle,
  Info,
} from 'lucide-react'
import { classifyAISystem, getRiskLevelColor, getRiskLevelLabel } from '@/lib/assessment-logic'
import type { AssessmentAnswers, AssessmentRecord, AssessmentResult, RiskLevel } from '@/lib/assessment-logic'

// ─── Sector options ───────────────────────────────────────────────────────────
const SECTORS = [
  { value: 'hr', label: 'Personalwesen (HR)', description: 'Einstellungen, Beurteilungen, Kündigungen' },
  { value: 'gesundheit', label: 'Gesundheitswesen', description: 'Diagnostik, Therapie, Pflege' },
  { value: 'bildung', label: 'Bildung & Ausbildung', description: 'Prüfungen, Zulassungen' },
  { value: 'justiz', label: 'Justiz & Rechtspflege', description: 'Strafverfolgung, Gerichte' },
  { value: 'kredit', label: 'Kredit & Sozialleistungen', description: 'Kreditwürdigkeitsprüfung' },
  { value: 'biometrie', label: 'Biometrie', description: 'Gesichtserkennung, Fingerabdruck' },
  { value: 'kritis', label: 'Kritische Infrastruktur', description: 'Strom, Wasser, Transport' },
  { value: 'transport', label: 'Transport & Mobilität', description: 'Autonomes Fahren' },
  { value: 'sonstige', label: 'Sonstiges', description: '' },
]

// ─── Usage type options ───────────────────────────────────────────────────────
const USAGE_TYPES = [
  { value: 'entscheidungsunterstuetzung', label: 'Entscheidungsunterstützung', description: 'Empfehlungen für Menschen' },
  { value: 'autonome_entscheidung', label: 'Autonome Entscheidung', description: 'Ohne menschliche Überprüfung' },
  { value: 'inhaltserzeugung', label: 'Inhaltserzeugung', description: 'Texte, Bilder, Videos' },
  { value: 'monitoring', label: 'Monitoring & Überwachung', description: 'Verhalten, Leistung' },
  { value: 'identifikation', label: 'Identifikation', description: 'Personen erkennen' },
]

// ─── Affected person options ──────────────────────────────────────────────────
const AFFECTED_PERSONS = [
  { value: 'arbeitnehmer', label: 'Arbeitnehmer', description: 'Mitarbeiter im Unternehmen' },
  { value: 'verbraucher', label: 'Verbraucher', description: 'Kunden und Käufer' },
  { value: 'oeffentlichkeit', label: 'Allgemeine Öffentlichkeit', description: '' },
  { value: 'kinder', label: 'Kinder', description: 'Unter 18 Jahren', warning: true },
  { value: 'vulnerable_gruppen', label: 'Vulnerable Gruppen', description: 'Ältere, Kranke, Behinderte' },
]

// ─── Technical question options ───────────────────────────────────────────────
const TECHNICAL_QUESTIONS: { key: keyof Pick<AssessmentAnswers, 'usesBiometricData' | 'realtimeProcessing' | 'manipulationPossible' | 'socialScoring' | 'predictivePolicing'>; label: string; warning?: boolean }[] = [
  { key: 'usesBiometricData', label: 'Werden biometrische Daten verarbeitet?' },
  { key: 'realtimeProcessing', label: 'Erfolgt die Verarbeitung in Echtzeit?' },
  { key: 'manipulationPossible', label: 'Kann das System Verhalten/Entscheidungen beeinflussen?' },
  { key: 'socialScoring', label: 'Bewertet das System das Sozialverhalten von Personen?', warning: true },
  { key: 'predictivePolicing', label: 'Sagt das System künftiges Verhalten/Straftaten vorher?', warning: true },
]

// ─── Initial answers state ────────────────────────────────────────────────────
const INITIAL_ANSWERS: AssessmentAnswers = {
  systemName: '',
  systemDescription: '',
  sector: '',
  usageTypes: [],
  affectedPersons: [],
  usesBiometricData: false,
  realtimeProcessing: false,
  manipulationPossible: false,
  socialScoring: false,
  predictivePolicing: false,
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2.5 rounded-full transition-all duration-300 ${
            i === current
              ? 'w-8 bg-blue-600'
              : i < current
              ? 'w-2.5 bg-blue-300'
              : 'w-2.5 bg-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

// ─── Risk level result icon ───────────────────────────────────────────────────
function ResultIcon({ level }: { level: RiskLevel }) {
  const cls = 'h-10 w-10'
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
  const labels: Record<string, string> = { hoch: 'Hoher Aufwand', mittel: 'Mittlerer Aufwand', niedrig: 'Geringer Aufwand' }
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${styles[effort]}`}>
      {labels[effort]}
    </span>
  )
}

// ─── Toggle button ────────────────────────────────────────────────────────────
function YesNoToggle({
  value,
  onChange,
}: {
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex rounded-lg border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
          value ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        Ja
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
          !value ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        Nein
      </button>
    </div>
  )
}

// ─── Main wizard component ───────────────────────────────────────────────────
export default function NewAssessmentPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<AssessmentAnswers>(INITIAL_ANSWERS)
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const TOTAL_STEPS = 6

  function updateAnswer<K extends keyof AssessmentAnswers>(key: K, value: AssessmentAnswers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  function toggleMultiselect(field: 'usageTypes' | 'affectedPersons', value: string) {
    setAnswers((prev) => {
      const current = prev[field] as string[]
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      return { ...prev, [field]: next }
    })
  }

  function validateStep(): boolean {
    const newErrors: Record<string, string> = {}

    if (step === 0) {
      if (!answers.systemName.trim()) newErrors.systemName = 'Bitte geben Sie einen Systemnamen ein.'
      if (!answers.systemDescription.trim()) newErrors.systemDescription = 'Bitte beschreiben Sie das System.'
    }

    if (step === 1 && !answers.sector) {
      newErrors.sector = 'Bitte wählen Sie einen Einsatzbereich.'
    }

    if (step === 2 && answers.usageTypes.length === 0) {
      newErrors.usageTypes = 'Bitte wählen Sie mindestens eine Verwendungsart.'
    }

    if (step === 3 && answers.affectedPersons.length === 0) {
      newErrors.affectedPersons = 'Bitte wählen Sie mindestens eine betroffene Personengruppe.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleNext() {
    if (!validateStep()) return

    if (step === 4) {
      // Classify before moving to result step
      const classification = classifyAISystem(answers)
      setResult(classification)
    }

    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0))
  }

  function handleSave() {
    if (!result) return
    const id = `assessment_${Date.now()}`
    const record: AssessmentRecord = {
      id,
      systemName: answers.systemName,
      systemDescription: answers.systemDescription,
      riskLevel: result.riskLevel,
      createdAt: new Date().toISOString(),
      answers,
      result,
    }
    try {
      const existing = JSON.parse(localStorage.getItem('complai_assessments') || '[]')
      localStorage.setItem('complai_assessments', JSON.stringify([record, ...existing]))
    } catch {
      // localStorage not available
    }
    router.push(`/assessment/${id}`)
  }

  // ─── Step 0: System description ────────────────────────────────────────────
  function renderStep0() {
    return (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="systemName">
            Name des KI-Systems <span className="text-red-500">*</span>
          </label>
          <input
            id="systemName"
            type="text"
            value={answers.systemName}
            onChange={(e) => updateAnswer('systemName', e.target.value)}
            placeholder="z.B. Bewerber-Screening-Tool, Kreditscoring-Modell..."
            className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.systemName ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          />
          {errors.systemName && <p className="mt-1.5 text-xs text-red-600">{errors.systemName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="systemDescription">
            Beschreibung des Systems <span className="text-red-500">*</span>
          </label>
          <textarea
            id="systemDescription"
            value={answers.systemDescription}
            onChange={(e) => updateAnswer('systemDescription', e.target.value)}
            placeholder="Beschreiben Sie kurz, was das System tut, wie es eingesetzt wird und welche Daten es verarbeitet..."
            rows={5}
            className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
              errors.systemDescription ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          />
          {errors.systemDescription && <p className="mt-1.5 text-xs text-red-600">{errors.systemDescription}</p>}
        </div>
      </div>
    )
  }

  // ─── Step 1: Sector ────────────────────────────────────────────────────────
  function renderStep1() {
    return (
      <div className="space-y-2">
        {errors.sector && (
          <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {errors.sector}
          </p>
        )}
        {SECTORS.map((sector) => (
          <button
            key={sector.value}
            type="button"
            onClick={() => updateAnswer('sector', sector.value)}
            className={`w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-150 ${
              answers.sector === sector.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div
              className={`h-4 w-4 flex-shrink-0 rounded-full border-2 transition-colors ${
                answers.sector === sector.value ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              }`}
            >
              {answers.sector === sector.value && (
                <div className="flex items-center justify-center h-full">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm text-gray-900">{sector.label}</div>
              {sector.description && <div className="text-xs text-gray-500 mt-0.5">{sector.description}</div>}
            </div>
          </button>
        ))}
      </div>
    )
  }

  // ─── Step 2: Usage types ────────────────────────────────────────────────────
  function renderStep2() {
    return (
      <div className="space-y-2">
        {errors.usageTypes && (
          <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {errors.usageTypes}
          </p>
        )}
        {USAGE_TYPES.map((type) => {
          const selected = answers.usageTypes.includes(type.value)
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => toggleMultiselect('usageTypes', type.value)}
              className={`w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-150 ${
                selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div
                className={`h-4 w-4 flex-shrink-0 rounded border-2 transition-colors flex items-center justify-center ${
                  selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`}
              >
                {selected && <Check className="h-3 w-3 text-white" />}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-900">{type.label}</div>
                {type.description && <div className="text-xs text-gray-500 mt-0.5">{type.description}</div>}
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  // ─── Step 3: Affected persons ───────────────────────────────────────────────
  function renderStep3() {
    return (
      <div className="space-y-2">
        {errors.affectedPersons && (
          <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {errors.affectedPersons}
          </p>
        )}
        {AFFECTED_PERSONS.map((person) => {
          const selected = answers.affectedPersons.includes(person.value)
          return (
            <button
              key={person.value}
              type="button"
              onClick={() => toggleMultiselect('affectedPersons', person.value)}
              className={`w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-150 ${
                selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div
                className={`h-4 w-4 flex-shrink-0 rounded border-2 transition-colors flex items-center justify-center ${
                  selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`}
              >
                {selected && <Check className="h-3 w-3 text-white" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-sm text-gray-900">{person.label}</span>
                  {person.warning && (
                    <span className="inline-flex items-center gap-0.5 rounded bg-orange-100 px-1.5 py-0.5 text-xs font-medium text-orange-700">
                      <AlertTriangle className="h-3 w-3" />
                      Hochrisiko-Indikator
                    </span>
                  )}
                </div>
                {person.description && <div className="text-xs text-gray-500 mt-0.5">{person.description}</div>}
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  // ─── Step 4: Technical details ──────────────────────────────────────────────
  function renderStep4() {
    return (
      <div className="space-y-4">
        {TECHNICAL_QUESTIONS.map((q) => (
          <div key={q.key} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 flex-1">
                {q.warning && <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />}
                <p className={`text-sm font-medium ${q.warning ? 'text-orange-800' : 'text-gray-900'}`}>
                  {q.label}
                </p>
              </div>
              <div className="flex-shrink-0 w-32">
                <YesNoToggle
                  value={answers[q.key]}
                  onChange={(v) => updateAnswer(q.key, v)}
                />
              </div>
            </div>
            {q.warning && answers[q.key] && (
              <div className="mt-3 flex items-start gap-2 bg-orange-50 rounded-lg px-3 py-2">
                <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-orange-700">
                  Achtung: Dies ist ein starker Indikator für eine verbotene KI-Praxis gemäß Art. 5 EU AI Act.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  // ─── Step 5: Result ─────────────────────────────────────────────────────────
  function renderStep5() {
    if (!result) return null
    const colors = getRiskLevelColor(result.riskLevel)
    const label = getRiskLevelLabel(result.riskLevel)

    return (
      <div className="space-y-6">
        {/* Risk level hero */}
        <div className={`rounded-2xl border-2 ${colors.border} ${colors.bg} p-6 text-center`}>
          <div className="flex justify-center mb-3">
            <ResultIcon level={result.riskLevel} />
          </div>
          <div className={`text-2xl font-bold ${colors.text} mb-2`}>{label}</div>
          <p className="text-sm text-gray-700 leading-relaxed">{result.reasoning}</p>
        </div>

        {/* Relevant articles */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            Relevante Artikel
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.relevantArticles.map((n) => (
              <Link
                key={n}
                href={`/artikel/${n}`}
                className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
              >
                Art. {n}
              </Link>
            ))}
          </div>
        </div>

        {/* Top 3 requirements preview */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-blue-500" />
            Wichtigste Anforderungen (Vorschau)
          </h3>
          <div className="space-y-2">
            {result.requirements.slice(0, 3).map((req) => (
              <div key={req.id} className="bg-white rounded-xl border border-gray-200 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{req.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{req.articleRef}</p>
                  </div>
                  <EffortBadge effort={req.effort} />
                </div>
              </div>
            ))}
            {result.requirements.length > 3 && (
              <p className="text-xs text-gray-500 pl-1">
                +{result.requirements.length - 3} weitere Anforderungen in der vollständigen Analyse
              </p>
            )}
          </div>
        </div>

        {/* Claude AI analysis placeholder */}
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
          <p className="text-sm text-gray-500 mb-2">KI-Tiefenanalyse verfügbar nach dem Speichern</p>
          <p className="text-xs text-gray-400">
            Claude analysiert Ihr System kontextbezogen und gibt detaillierte Handlungsempfehlungen.
          </p>
        </div>
      </div>
    )
  }

  // ─── Step metadata ──────────────────────────────────────────────────────────
  const STEP_META = [
    {
      title: 'System-Beschreibung',
      description: 'Wie heißt das KI-System und was macht es?',
      icon: <Building className="h-5 w-5 text-blue-600" />,
    },
    {
      title: 'Einsatzbereich',
      description: 'In welchem Bereich wird das System eingesetzt?',
      icon: <Building className="h-5 w-5 text-blue-600" />,
    },
    {
      title: 'Verwendungsart',
      description: 'Wie wird das System konkret genutzt?',
      icon: <Cpu className="h-5 w-5 text-blue-600" />,
    },
    {
      title: 'Betroffene Personen',
      description: 'Welche Personengruppen sind betroffen?',
      icon: <Users className="h-5 w-5 text-blue-600" />,
    },
    {
      title: 'Technische Details',
      description: 'Technische und funktionale Eigenschaften des Systems',
      icon: <Cpu className="h-5 w-5 text-blue-600" />,
    },
    {
      title: 'Ergebnis',
      description: 'Ihre Risikoklassifizierung nach EU AI Act',
      icon: <Shield className="h-5 w-5 text-blue-600" />,
    },
  ]

  const currentMeta = STEP_META[step]
  const isLastStep = step === TOTAL_STEPS - 1
  const isClassifyStep = step === TOTAL_STEPS - 2

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-4 w-4" />
            Abbrechen
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-gray-900 text-sm">Neues Assessment</span>
          </div>
          <span className="text-xs text-gray-400 font-medium tabular-nums">
            {step + 1} / {TOTAL_STEPS}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Step dots */}
        <StepIndicator current={step} total={TOTAL_STEPS} />

        {/* Step header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">{currentMeta.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{currentMeta.description}</p>
        </div>

        {/* Step content */}
        <div className="mb-8">
          {step === 0 && renderStep0()}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Zurück
          </button>

          <div className="flex-1" />

          {isLastStep ? (
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Check className="h-4 w-4" />
              Speichern & Anzeigen
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              {isClassifyStep ? 'Klassifizieren' : 'Weiter'}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
