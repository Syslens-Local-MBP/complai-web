'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Shield, Clock } from 'lucide-react'
import { getCountdownDays } from '@/lib/utils'

export function Hero() {
  const [days, setDays] = useState(0)

  useEffect(() => {
    setDays(getCountdownDays())
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#003399]/5 to-transparent pt-20 pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Countdown Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-[#FEF2F2] px-4 py-2 text-sm font-medium text-red-700 mb-8">
          <Clock className="h-4 w-4" />
          <span>EU AI Act Deadline: Noch <strong>{days} Tage</strong> bis 2. August 2026</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A1A2E] mb-6">
          EU AI Act Compliance –{' '}
          <span className="text-[#003399]">Der Countdown</span>{' '}
          läuft
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Verstehen Sie den EU AI Act, analysieren Sie Ihre KI-Systeme und bleiben Sie compliant –
          bevor Bußgelder von bis zu <strong>35 Mio. €</strong> drohen.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#003399] px-8 py-4 text-base font-semibold text-white hover:bg-[#002277] transition-colors shadow-lg shadow-[#003399]/25"
          >
            Kostenlos starten
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/articles"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#003399] px-8 py-4 text-base font-semibold text-[#003399] hover:bg-[#003399]/5 transition-colors"
          >
            <Shield className="h-4 w-4" />
            Artikel lesen
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="text-green-500">✓</span> DSGVO-konform
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-green-500">✓</span> Hosted in Frankfurt
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-green-500">✓</span> Kostenloser Einstieg
          </span>
        </div>
      </div>
    </section>
  )
}
