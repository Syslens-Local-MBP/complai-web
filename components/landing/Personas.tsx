import Link from 'next/link'
import { PERSONAS } from '@/lib/constants'

export function Personas() {
  return (
    <section className="py-24 bg-[#003399]/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-4">
            Für jeden die richtige Perspektive
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            ComplAI passt sich Ihrem Profil an – ob Jurist, Unternehmer, Entwickler oder Einsteiger.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(Object.entries(PERSONAS) as [keyof typeof PERSONAS, (typeof PERSONAS)[keyof typeof PERSONAS]][]).map(([key, persona]) => (
            <div key={key} className="rounded-xl bg-white border p-6 hover:shadow-md transition-shadow flex flex-col">
              <div className="text-4xl mb-4">{persona.icon}</div>
              <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">{persona.label}</h3>
              <p className="text-sm text-gray-500 mb-4 flex-1">{persona.description}</p>
              <ul className="space-y-1 mb-6">
                {persona.features.map(f => (
                  <li key={f} className="text-xs text-gray-600 flex items-center gap-1.5">
                    <span className="text-[#003399]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/signup?persona=${key}`}
                className="mt-auto text-center rounded-lg border-2 border-[#003399] px-4 py-2 text-sm font-semibold text-[#003399] hover:bg-[#003399] hover:text-white transition-colors"
              >
                Als {persona.label} starten
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
