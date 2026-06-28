import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { Personas } from '@/components/landing/Personas'
import { Pricing } from '@/components/landing/Pricing'
import { ArrowRight, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* Problem Section */}
        <section className="py-20 bg-[#1A1A2E] text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <AlertTriangle className="h-12 w-12 text-[#FFCC00] mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Warum Unternehmen jetzt handeln müssen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
              <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                <div className="text-3xl font-bold text-[#FFCC00] mb-2">35 Mio. €</div>
                <p className="text-sm text-gray-300">Maximale Geldstrafe bei schwerwiegenden Verstößen gegen den EU AI Act</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                <div className="text-3xl font-bold text-[#FFCC00] mb-2">Aug 2026</div>
                <p className="text-sm text-gray-300">Vollständige Anwendbarkeit für Hochrisiko-KI-Systeme. Die Zeit läuft ab.</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                <div className="text-3xl font-bold text-[#FFCC00] mb-2">113</div>
                <p className="text-sm text-gray-300">Artikel, 9 Kapitel, Dutzende Anhänge – komplexer als DSGVO.</p>
              </div>
            </div>
            <Link
              href="/signup"
              className="mt-12 inline-flex items-center gap-2 rounded-lg bg-[#FFCC00] px-8 py-4 text-base font-semibold text-[#1A1A2E] hover:bg-yellow-300 transition-colors"
            >
              Jetzt compliant werden <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <Features />
        <Personas />
        <Pricing />

        {/* Final CTA */}
        <section className="py-20 bg-[#003399]">
          <div className="mx-auto max-w-2xl px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Bereit für EU AI Act Compliance?</h2>
            <p className="text-blue-200 mb-8">Starten Sie kostenlos. Kein Kreditkarte erforderlich.</p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-[#FFCC00] px-8 py-4 text-base font-semibold text-[#1A1A2E] hover:bg-yellow-300 transition-colors"
            >
              Kostenlos registrieren <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
