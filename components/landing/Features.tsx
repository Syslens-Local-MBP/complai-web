import { BookOpen, Brain, Trophy, Users, Download, Wifi } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Artikel-Reader',
    description: 'Alle 113 Artikel des EU AI Act strukturiert aufbereitet – mit Highlighting, Notizen und Lesefortschritt.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Brain,
    title: 'KI-Risikoanalyse',
    description: 'Analysieren Sie Ihre KI-Systeme mit Claude AI und erhalten Sie sofortige Compliance-Einschätzungen.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Trophy,
    title: 'Gamification',
    description: 'Punkte, Levels und Badges motivieren zum Lernen. Compliance-Champion werden macht Spaß.',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
  {
    icon: Users,
    title: 'Multi-Persona',
    description: 'Personalisierte Inhalte für Juristen, Unternehmer, Entwickler und Lernende.',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: Wifi,
    title: 'Offline-Modus',
    description: 'Gelesene Artikel werden lokal gespeichert – Compliance-Wissen auch ohne Internet.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    icon: Download,
    title: 'Export & Sharing',
    description: 'PDF-Export für Audits, Team-Sharing und Compliance-Berichte auf Knopfdruck.',
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
]

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-4">
            Alles, was Sie für Compliance brauchen
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Eine Plattform – sechs leistungsstarke Werkzeuge für Ihren EU AI Act Compliance-Weg.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color, bg }) => (
            <div key={title} className="rounded-xl border bg-white p-6 hover:shadow-md transition-shadow">
              <div className={`inline-flex rounded-lg ${bg} p-3 mb-4`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
