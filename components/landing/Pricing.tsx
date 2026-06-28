import Link from 'next/link'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Für Einsteiger und Neugierige',
    features: [
      '10 Artikel-Zusammenfassungen/Monat',
      '1 Risiko-Assessment',
      'Basis-Gamification',
      'Glossar-Zugang',
      'Community-Support',
    ],
    cta: 'Kostenlos starten',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '29',
    description: 'Für Profis und Teams',
    features: [
      'Unbegrenzte Artikel & Assessments',
      'KI-gestützte Analyse (Claude)',
      'PDF-Export & Zitat-Generator',
      'Team-Sharing (bis 5)',
      'Prioritäts-Support',
      'Offline-Modus',
      'Alle Personas',
    ],
    cta: 'Pro testen',
    href: '/signup?plan=pro',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Auf Anfrage',
    description: 'Für große Organisationen',
    features: [
      'Alles aus Pro',
      'Unbegrenzte Team-Mitglieder',
      'SSO / SAML',
      'Dedizierter Account Manager',
      'SLA & Audit-Logs',
      'Custom Branding',
    ],
    cta: 'Kontakt aufnehmen',
    href: 'mailto:hello@complai.ai-workx.de',
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-4">
            Einfache, faire Preise
          </h2>
          <p className="text-lg text-gray-500">Starten Sie kostenlos – upgraden wenn Sie bereit sind.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 flex flex-col ${
                plan.highlighted
                  ? 'border-[#003399] bg-[#003399] text-white shadow-xl shadow-[#003399]/20'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <h3 className={`text-lg font-semibold mb-1 ${plan.highlighted ? 'text-white' : 'text-[#1A1A2E]'}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-4 ${plan.highlighted ? 'text-blue-200' : 'text-gray-500'}`}>
                {plan.description}
              </p>
              <div className="mb-6">
                {plan.price === 'Auf Anfrage' ? (
                  <span className={`text-2xl font-bold ${plan.highlighted ? 'text-white' : 'text-[#1A1A2E]'}`}>
                    Auf Anfrage
                  </span>
                ) : (
                  <>
                    <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-[#1A1A2E]'}`}>
                      €{plan.price}
                    </span>
                    <span className={`text-sm ${plan.highlighted ? 'text-blue-200' : 'text-gray-500'}`}>/Monat</span>
                  </>
                )}
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-[#FFCC00]' : 'text-[#003399]'}`} />
                    <span className={plan.highlighted ? 'text-blue-100' : 'text-gray-600'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`text-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? 'bg-[#FFCC00] text-[#1A1A2E] hover:bg-yellow-300'
                    : 'border-2 border-[#003399] text-[#003399] hover:bg-[#003399] hover:text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
