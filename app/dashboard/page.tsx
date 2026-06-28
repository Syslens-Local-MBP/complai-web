import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { BookOpen, ShieldCheck, Trophy, Clock } from 'lucide-react'
import { getCountdownDays } from '@/lib/utils'
import type { Persona } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: profile }, { data: progress }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('user_progress').select('*').eq('user_id', user.id).single(),
  ])

  if (profile && !profile.onboarding_completed) redirect('/onboarding')

  const persona = (profile?.persona || 'learner') as Persona
  const points = progress?.total_points || 0
  const level = progress?.level || 1
  const articlesRead = progress?.articles_read || 0
  const assessmentsDone = progress?.assessments_completed || 0

  return (
    <>
      <Header isLoggedIn />
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar points={points} level={level} />
        <main className="flex-1 p-6 lg:p-8 max-w-6xl">
          <WelcomeBanner
            name={user.email?.split('@')[0]}
            persona={persona}
            points={points}
            level={level}
            articlesRead={articlesRead}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <StatsCard
              title="Artikel gelesen"
              value={articlesRead}
              subtitle="von 113 Artikeln"
              icon={BookOpen}
              color="blue"
            />
            <StatsCard
              title="Assessments"
              value={assessmentsDone}
              subtitle="abgeschlossen"
              icon={ShieldCheck}
              color="green"
            />
            <StatsCard
              title="Punkte"
              value={points}
              subtitle={`Level ${level}`}
              icon={Trophy}
              color="yellow"
            />
            <StatsCard
              title="Tage bis Deadline"
              value={getCountdownDays()}
              subtitle="2. August 2026"
              icon={Clock}
              color="red"
            />
          </div>

          <div className="mt-6 rounded-xl border bg-white p-6">
            <h3 className="font-semibold text-[#1A1A2E] mb-4">Nächste Schritte</h3>
            <div className="space-y-3">
              {[
                { href: '/articles', text: 'Artikel 1-5 lesen: Anwendungsbereich des EU AI Act', points: 50 },
                { href: '/assessment', text: 'Erstes Risiko-Assessment erstellen', points: 50 },
                { href: '/glossar', text: 'Grundbegriffe im Glossar nachschlagen', points: 10 },
              ].map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg border border-dashed border-gray-200 p-4 hover:border-[#003399]/40 hover:bg-[#003399]/5 transition-colors group"
                >
                  <span className="text-sm text-gray-700 group-hover:text-[#003399]">{item.text}</span>
                  <span className="text-xs font-medium text-[#FFCC00] bg-[#1A1A2E] px-2 py-1 rounded-full">
                    +{item.points} Punkte
                  </span>
                </a>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
