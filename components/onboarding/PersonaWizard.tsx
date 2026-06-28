'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { PERSONAS } from '@/lib/constants'
import type { Persona } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const steps = [
  { id: 1, title: 'Ihr Profil', description: 'Welche Rolle haben Sie?' },
  { id: 2, title: 'Ihr Unternehmen', description: 'Etwas über Ihre Organisation' },
  { id: 3, title: 'Ihre Ziele', description: 'Was möchten Sie erreichen?' },
  { id: 4, title: 'Loslegen', description: 'Ihr personalisierter Plan' },
]

const goals = [
  'EU AI Act verstehen',
  'KI-Systeme klassifizieren',
  'Compliance nachweisen',
  'Team schulen',
  'Audit vorbereiten',
  'Zertifizierung anstreben',
]

export function PersonaWizard({ userId }: { userId: string }) {
  const [step, setStep] = useState(1)
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [company, setCompany] = useState('')
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    )
  }

  const handleFinish = async () => {
    if (!selectedPersona) return
    setLoading(true)
    const supabase = createClient()

    await supabase.from('profiles').upsert({
      id: userId,
      persona: selectedPersona,
      company: company || null,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold',
                  step > s.id ? 'bg-[#003399] text-white' :
                  step === s.id ? 'bg-[#003399] text-white ring-4 ring-[#003399]/20' :
                  'bg-gray-200 text-gray-500'
                )}>
                  {step > s.id ? <Check className="h-4 w-4" /> : s.id}
                </div>
                {i < steps.length - 1 && (
                  <div className={cn('h-1 flex-1 mx-2 rounded', step > s.id ? 'bg-[#003399]' : 'bg-gray-200')} style={{ width: '60px' }} />
                )}
              </div>
            ))}
          </div>
          <h2 className="text-xl font-bold text-[#1A1A2E]">{steps[step - 1].title}</h2>
          <p className="text-sm text-gray-500">{steps[step - 1].description}</p>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-8">
          {/* Step 1: Persona */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.entries(PERSONAS) as [Persona, (typeof PERSONAS)[Persona]][]).map(([key, persona]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPersona(key)}
                  className={cn(
                    'rounded-xl border-2 p-5 text-left transition-all hover:shadow-sm',
                    selectedPersona === key
                      ? 'border-[#003399] bg-[#003399]/5'
                      : 'border-gray-200 hover:border-[#003399]/40'
                  )}
                >
                  <div className="text-3xl mb-2">{persona.icon}</div>
                  <div className="font-semibold text-[#1A1A2E]">{persona.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{persona.description}</div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Company */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unternehmen / Organisation</label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="Ihre Firma GmbH"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#003399] focus:outline-none focus:ring-2 focus:ring-[#003399]/20"
                />
              </div>
              <p className="text-xs text-gray-400">Optional – hilft uns, relevante Inhalte bereitzustellen.</p>
            </div>
          )}

          {/* Step 3: Goals */}
          {step === 3 && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Wählen Sie alle zutreffenden Ziele:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goals.map(goal => (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-sm font-medium text-left transition-all',
                      selectedGoals.includes(goal)
                        ? 'border-[#003399] bg-[#003399]/5 text-[#003399]'
                        : 'border-gray-200 text-gray-700 hover:border-[#003399]/40'
                    )}
                  >
                    <div className={cn(
                      'h-4 w-4 rounded flex items-center justify-center border-2 flex-shrink-0',
                      selectedGoals.includes(goal) ? 'border-[#003399] bg-[#003399]' : 'border-gray-300'
                    )}>
                      {selectedGoals.includes(goal) && <Check className="h-2.5 w-2.5 text-white" />}
                    </div>
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Summary */}
          {step === 4 && selectedPersona && (
            <div className="text-center">
              <div className="text-6xl mb-4">{PERSONAS[selectedPersona].icon}</div>
              <h3 className="text-2xl font-bold text-[#1A1A2E] mb-2">
                Willkommen, {PERSONAS[selectedPersona].label}!
              </h3>
              <p className="text-gray-500 mb-6">
                Ihr persönlicher EU AI Act Compliance-Weg ist bereit. Loslegen!
              </p>
              <div className="rounded-xl bg-[#003399]/5 border border-[#003399]/20 p-4 text-left">
                <p className="text-sm font-semibold text-[#003399] mb-2">Ihr personalisierter Zugang:</p>
                <ul className="space-y-1">
                  {PERSONAS[selectedPersona].features.map(f => (
                    <li key={f} className="text-sm text-gray-600 flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-[#003399]" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Zurück
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={step === 1 && !selectedPersona}
                className="inline-flex items-center gap-2 rounded-lg bg-[#003399] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#002277] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Weiter <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-[#003399] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#002277] disabled:opacity-60 transition-colors"
              >
                {loading ? 'Wird gespeichert...' : 'Dashboard öffnen'} <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
