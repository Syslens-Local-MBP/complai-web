'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'

interface GlossarEntry {
  term: string
  definition: string
  legalRef?: string
  category: 'grundbegriffe' | 'risikoklassen' | 'akteure' | 'verfahren' | 'technologie'
}

const GLOSSAR: GlossarEntry[] = [
  { term: 'KI-System', definition: 'Ein maschinengestütztes System, das für den Betrieb mit unterschiedlichem Grad an Autonomie ausgelegt ist und aus Eingaben Ausgaben wie Vorhersagen, Inhalte, Empfehlungen oder Entscheidungen generiert, die physische oder virtuelle Umgebungen beeinflussen können.', legalRef: 'Art. 3 Nr. 1 EU AI Act', category: 'grundbegriffe' },
  { term: 'Anbieter', definition: 'Eine natürliche oder juristische Person, die ein KI-System entwickelt oder entwickeln lässt und es unter ihrem eigenen Namen oder ihrer eigenen Marke in Verkehr bringt oder in Betrieb nimmt.', legalRef: 'Art. 3 Nr. 3 EU AI Act', category: 'akteure' },
  { term: 'Betreiber', definition: 'Eine natürliche oder juristische Person, die ein KI-System in eigener Verantwortung verwendet, sofern es nicht im Rahmen einer persönlichen, nicht beruflichen Tätigkeit eingesetzt wird.', legalRef: 'Art. 3 Nr. 4 EU AI Act', category: 'akteure' },
  { term: 'Bevollmächtigter', definition: 'Eine in der EU niedergelassene natürliche oder juristische Person, die von einem nicht-EU-Anbieter schriftlich bevollmächtigt wurde, in dessen Namen bestimmte Pflichten zu erfüllen und als Ansprechpartner für Behörden zu fungieren.', legalRef: 'Art. 3 Nr. 5, Art. 22 EU AI Act', category: 'akteure' },
  { term: 'Importeur', definition: 'Eine in der EU niedergelassene natürliche oder juristische Person, die ein KI-System unter dem Namen oder der Marke einer außerhalb der EU niedergelassenen Person in Verkehr bringt.', legalRef: 'Art. 3 Nr. 6 EU AI Act', category: 'akteure' },
  { term: 'Hochrisiko-KI-System', definition: 'Ein KI-System, das entweder als Sicherheitsbauteil in einem Produkt nach Anhang I eingesetzt wird oder in einem der sensiblen Bereiche nach Anhang III (Biometrie, Bildung, Beschäftigung, Strafverfolgung, Migration, Rechtspflege) verwendet wird.', legalRef: 'Art. 6 EU AI Act', category: 'risikoklassen' },
  { term: 'KI-Modell für allgemeine Zwecke (GPAI)', definition: 'Ein KI-Modell, das mit einer großen Datenmenge unter Self-Supervision in großem Maßstab trainiert wurde und eine erhebliche allgemeine Leistungsfähigkeit aufweist, die in eine Vielzahl von Systemen integriert werden kann. Beispiele: GPT-4, Claude, Gemini.', legalRef: 'Art. 3 Nr. 63 EU AI Act', category: 'technologie' },
  { term: 'Systemisches Risiko', definition: 'Ein Risiko, das spezifisch für die Hochleistungsfähigkeiten von GPAI-Modellen ist und erhebliche Auswirkungen auf den Unionsmarkt hat aufgrund ihrer Reichweite oder tatsächlicher oder vorhersehbarer nachteiliger Auswirkungen auf Gesundheit, Sicherheit, Grundrechte oder die Gesellschaft als Ganzes.', legalRef: 'Art. 3 Nr. 65, Art. 51 EU AI Act', category: 'risikoklassen' },
  { term: 'Verbotene KI-Praktiken', definition: 'KI-Anwendungen, die in der EU vollständig verboten sind, weil sie Grundrechte oder die Menschenwürde in inakzeptabler Weise verletzen: Manipulation durch unterschwellige Techniken, Social Scoring, biometrische Echtzeit-Fernidentifikation in der Öffentlichkeit, Predictive Policing.', legalRef: 'Art. 5 EU AI Act', category: 'risikoklassen' },
  { term: 'Konformitätsbewertung', definition: 'Das Verfahren zur Bewertung, ob ein Hochrisiko-KI-System die Anforderungen des EU AI Acts erfüllt. Erfolgt entweder durch Selbsteinstufung des Anbieters oder — bei biometrischen Systemen — durch eine unabhängige Drittpartei (Notified Body).', legalRef: 'Art. 43 EU AI Act', category: 'verfahren' },
  { term: 'EU-Konformitätserklärung', definition: 'Die offizielle schriftliche Erklärung des Anbieters, dass sein Hochrisiko-KI-System allen Anforderungen des EU AI Acts entspricht. Muss 10 Jahre aufbewahrt werden und ist Grundlage für die CE-Kennzeichnung.', legalRef: 'Art. 47 EU AI Act', category: 'verfahren' },
  { term: 'CE-Kennzeichnung', definition: 'Das Zeichen, durch das der Anbieter erklärt, dass ein KI-System den geltenden Anforderungen des EU AI Acts und anderen EU-Harmonisierungsrechtsvorschriften entspricht. Voraussetzung für das Inverkehrbringen auf dem EU-Markt.', legalRef: 'Art. 48, 49 EU AI Act', category: 'verfahren' },
  { term: 'Harmonisierte Norm', definition: 'Eine europäische Norm, die von einer der europäischen Normungsorganisationen (CEN, CENELEC, ETSI) auf Anfrage der Kommission entwickelt wurde und die Konformität mit den Anforderungen des EU AI Acts vermuten lässt.', legalRef: 'Art. 3 Nr. 28 EU AI Act', category: 'verfahren' },
  { term: 'Benannte Stelle (Notified Body)', definition: 'Eine unabhängige Konformitätsbewertungsstelle, die von einer nationalen Akkreditierungsstelle (z.B. DAkkS in Deutschland) für die Prüfung von Hochrisiko-KI-Systemen zugelassen wurde. Pflicht bei biometrischen Identifikationssystemen.', legalRef: 'Art. 35-39 EU AI Act', category: 'akteure' },
  { term: 'Marktüberwachungsbehörde', definition: 'Die nationale Behörde, die für die Überwachung der Einhaltung des EU AI Acts zuständig ist. In Deutschland noch nicht abschließend bestimmt — Kandidaten: Bundesnetzagentur, BSI, BaFin (für Finanz-KI).', legalRef: 'Art. 70 EU AI Act', category: 'akteure' },
  { term: 'KI-Büro', definition: 'Die zentrale europäische Behörde bei der EU-Kommission (DG CNECT), die für die kohärente Anwendung des EU AI Acts zuständig ist und insbesondere GPAI-Modelle reguliert und überwacht.', legalRef: 'Art. 64 EU AI Act', category: 'akteure' },
  { term: 'Biometrische Identifikation', definition: 'Die automatische Erkennung natürlicher Personen durch den Abgleich ihrer biometrischen Daten (Gesicht, Fingerabdruck, Iris etc.) mit Daten in einer Datenbank. Echtzeit-Fernidentifikation in öffentlichen Räumen ist grundsätzlich verboten.', legalRef: 'Art. 3 Nr. 33, Art. 5 Abs. 1 lit. d EU AI Act', category: 'technologie' },
  { term: 'Biometrische Kategorisierung', definition: 'Die Zuweisung natürlicher Personen zu Kategorien auf Basis biometrischer Daten. Kategorisierung nach sensitiven Merkmalen (Rasse, Religion, Sexualität) ist verboten.', legalRef: 'Art. 3 Nr. 40, Art. 5 Abs. 1 lit. e EU AI Act', category: 'technologie' },
  { term: 'Emotionserkennung', definition: 'Ein KI-System zur Identifizierung oder Ableitung von Emotionen oder Absichten natürlicher Personen auf Basis biometrischer Daten. Am Arbeitsplatz und in Bildungseinrichtungen weitgehend verboten.', legalRef: 'Art. 3 Nr. 39, Art. 5 Abs. 1 lit. f EU AI Act', category: 'technologie' },
  { term: 'Deepfake', definition: 'KI-generierte Bilder, Audio- oder Videoinhalte, die eine hinreichende Ähnlichkeit mit realen Personen oder Ereignissen aufweisen und fälschlicherweise als echt erscheinen können. Müssen in maschinenlesbarem Format als KI-generiert gekennzeichnet werden.', legalRef: 'Art. 50 Abs. 2 EU AI Act', category: 'technologie' },
  { term: 'Social Scoring', definition: 'Die Bewertung oder Klassifizierung natürlicher Personen über Zeit auf Basis ihres Sozialverhaltens oder persönlicher Merkmale durch Behörden, wenn dies zu Benachteiligungen führt, die unverhältnismäßig oder in kontextfremden Bereichen angewendet werden. Vollständig verboten.', legalRef: 'Art. 5 Abs. 1 lit. c EU AI Act', category: 'risikoklassen' },
  { term: 'Predictive Policing', definition: 'Der Einsatz von KI-Systemen zur Risikoabschätzung, ob eine natürliche Person eine Straftat begehen wird, wenn diese Abschätzung ausschließlich auf Persönlichkeitsprofilen basiert. Im EU AI Act verboten.', legalRef: 'Art. 5 Abs. 1 lit. g EU AI Act', category: 'risikoklassen' },
  { term: 'Risikomanagementsystem', definition: 'Ein kontinuierlicher iterativer Prozess, der Hochrisiko-KI-Systeme über ihren gesamten Lebenszyklus begleitet: Risikoidentifikation, -bewertung, und -minimierung durch geeignete Maßnahmen.', legalRef: 'Art. 9 EU AI Act', category: 'verfahren' },
  { term: 'Technische Dokumentation', definition: 'Die vollständige Dokumentation eines Hochrisiko-KI-Systems, die alle für die Konformitätsbewertung relevanten Informationen enthält: Design, Daten, Trainingsverfahren, Leistungsmetriken, Risiken und Risikomaßnahmen.', legalRef: 'Art. 11 EU AI Act', category: 'verfahren' },
  { term: 'Qualitätsmanagementsystem (QMS)', definition: 'Ein schriftlich festgehaltenes System des Anbieters, das alle Prozesse zur Sicherstellung der Compliance des Hochrisiko-KI-Systems dokumentiert: Design, Entwicklung, Qualitätskontrolle, Test und Datenmanagement.', legalRef: 'Art. 17 EU AI Act', category: 'verfahren' },
  { term: 'Menschliche Aufsicht', definition: 'Die Pflicht, Hochrisiko-KI-Systeme so zu gestalten, dass natürliche Personen den Betrieb überwachen, Anomalien erkennen und bei Bedarf eingreifen oder das System abschalten können ("Human-in-the-Loop").', legalRef: 'Art. 14 EU AI Act', category: 'verfahren' },
  { term: 'KI-Kompetenz', definition: 'Das ausreichende Maß an Kenntnissen über KI, das Anbieter und Betreiber bei ihrem Personal sicherstellen müssen, damit KI-Systeme verantwortungsvoll eingesetzt werden können.', legalRef: 'Art. 4 EU AI Act', category: 'grundbegriffe' },
  { term: 'Regulatory Sandbox (KI-Reallabor)', definition: 'Ein kontrolliertes Umfeld, das nationale Behörden einrichten, um die Entwicklung und das Testen innovativer KI-Systeme unter behördlicher Aufsicht und mit reduzierten Regulierungsanforderungen zu ermöglichen.', legalRef: 'Art. 57 EU AI Act', category: 'verfahren' },
  { term: 'EU-Datenbank', definition: 'Eine öffentliche Datenbank (AIDA), in der Hochrisiko-KI-Systeme registriert werden müssen, bevor sie in Verkehr gebracht werden. Schafft Transparenz und ermöglicht Kontrolle durch Bürger und Behörden.', legalRef: 'Art. 71 EU AI Act', category: 'verfahren' },
  { term: 'Nachmarktüberwachung', definition: 'Die systematische Sammlung und Analyse von Erfahrungen mit KI-Systemen nach ihrer Markteinführung, um bisher unbekannte Risiken zu identifizieren und Korrekturmaßnahmen zu ergreifen.', legalRef: 'Art. 72 EU AI Act', category: 'verfahren' },
  { term: 'Grundlegende Rechte', definition: 'Die in der EU-Grundrechtecharta verankerten Rechte (Würde, Freiheit, Gleichheit, Solidarität, Bürgerrechte, justizielle Rechte), die KI-Systeme nicht verletzen dürfen. Zentrale Schutzgüter des EU AI Acts.', legalRef: 'Art. 1 EU AI Act, EU-Grundrechtecharta', category: 'grundbegriffe' },
  { term: 'FLOPs (Floating-Point Operations)', definition: 'Maßzahl für den Rechenaufwand beim Training von KI-Modellen. Ab 10^25 FLOPs gilt ein GPAI-Modell als systemisch riskant und unterliegt den strengsten Anforderungen des EU AI Acts.', legalRef: 'Art. 51 EU AI Act', category: 'technologie' },
  { term: 'Red-Teaming', definition: 'Adversarielle Tests, bei denen ein Team versucht, ein KI-System absichtlich zu "brechen" oder dazu zu bringen, unerwünschtes Verhalten zu zeigen. Für GPAI-Modelle mit systemischen Risiken verpflichtend vorgeschrieben.', legalRef: 'Art. 55 EU AI Act', category: 'technologie' },
]

const CATEGORIES: Record<GlossarEntry['category'], string> = {
  grundbegriffe: 'Grundbegriffe',
  risikoklassen: 'Risikoklassen',
  akteure: 'Akteure',
  verfahren: 'Verfahren',
  technologie: 'Technologie',
}

export default function GlossarPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<GlossarEntry['category'] | 'all'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return GLOSSAR.filter((e) => {
      const matchesSearch = !q || e.term.toLowerCase().includes(q) || e.definition.toLowerCase().includes(q)
      const matchesCat = selectedCategory === 'all' || e.category === selectedCategory
      return matchesSearch && matchesCat
    }).sort((a, b) => a.term.localeCompare(b.term, 'de'))
  }, [search, selectedCategory])

  // Group by first letter
  const grouped = useMemo(() => {
    const groups: Record<string, GlossarEntry[]> = {}
    for (const entry of filtered) {
      const letter = entry.term[0].toUpperCase()
      groups[letter] = groups[letter] ?? []
      groups[letter].push(entry)
    }
    return groups
  }, [filtered])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <section className="px-4 py-12 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
          Glossar
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">EU AI Act Glossar</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          {GLOSSAR.length} Begriffe aus dem EU AI Act, klar erklaert.
        </p>
      </section>

      <section className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100 px-4 py-3">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Begriff suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedCategory === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Alle
            </button>
            {(Object.keys(CATEGORIES) as GlossarEntry['category'][]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedCategory === cat ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {CATEGORIES[cat]}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 max-w-4xl mx-auto">
        {Object.entries(grouped).map(([letter, entries]) => (
          <div key={letter} className="mb-8">
            <div className="text-2xl font-bold text-gray-200 mb-3 border-b border-gray-100 pb-1">{letter}</div>
            <div className="space-y-2">
              {entries.map((entry) => {
                const isExpanded = expanded === entry.term
                return (
                  <div
                    key={entry.term}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => setExpanded(isExpanded ? null : entry.term)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">{entry.term}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          entry.category === 'risikoklassen' ? 'bg-red-50 text-red-600' :
                          entry.category === 'akteure' ? 'bg-blue-50 text-blue-600' :
                          entry.category === 'verfahren' ? 'bg-green-50 text-green-600' :
                          entry.category === 'technologie' ? 'bg-orange-50 text-orange-600' :
                          'bg-gray-50 text-gray-600'
                        }`}>
                          {CATEGORIES[entry.category]}
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-gray-50">
                        <p className="text-gray-700 leading-relaxed mt-3">{entry.definition}</p>
                        {entry.legalRef && (
                          <p className="text-xs text-gray-400 mt-2 font-mono">{entry.legalRef}</p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="font-medium">Kein Begriff gefunden</p>
          </div>
        )}
      </section>
    </main>
  )
}
