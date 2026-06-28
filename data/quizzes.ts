export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number // index
  explanation: string
  points: number
  category: 'grundlagen' | 'verbote' | 'hochrisiko' | 'transparenz' | 'gpai' | 'durchsetzung'
  articleRef?: number
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Seit wann gelten die Verbote nach Artikel 5 des EU AI Acts?',
    options: [
      'Ab 1. Januar 2024',
      'Ab 2. Februar 2025',
      'Ab 2. August 2025',
      'Ab 2. August 2026'
    ],
    correctAnswer: 1,
    explanation: 'Die verbotenen KI-Praktiken nach Artikel 5 sind seit dem 2. Februar 2025 in Kraft – sechs Monate nach Inkrafttreten des EU AI Acts am 1. August 2024.',
    points: 30,
    category: 'verbote',
    articleRef: 5
  },
  {
    id: 'q2',
    question: 'Welche KI-Praktiken sind nach Artikel 5 EU AI Act absolut verboten?',
    options: [
      'Alle KI-Systeme in der Medizin',
      'Social Scoring durch öffentliche Behörden und biometrische Echtzeit-Fernidentifikation',
      'Alle autonomen Entscheidungssysteme',
      'KI-Systeme mit mehr als 1 Milliarde Parameter'
    ],
    correctAnswer: 1,
    explanation: 'Artikel 5 verbietet u.a. Social Scoring durch Behörden, Manipulation durch subliminale Techniken, biometrische Echtzeit-Fernidentifikation in öffentlichen Räumen und Predictive Policing.',
    points: 30,
    category: 'verbote',
    articleRef: 5
  },
  {
    id: 'q3',
    question: 'Was ist ein "Hochrisiko-KI-System" nach dem EU AI Act?',
    options: [
      'Jedes System mit mehr als 1.000 Nutzern',
      'Systeme in sensiblen Bereichen wie HR, Gesundheit, Bildung oder Justiz die autonome Entscheidungen treffen',
      'Nur militärische KI-Systeme',
      'Alle kommerziellen KI-Produkte mit über 1 Mio. EUR Umsatz'
    ],
    correctAnswer: 1,
    explanation: 'Hochrisiko-Systeme sind in Anhang III definiert: biometrische Identifikation, KRITIS, Bildung, Beschäftigung, Sozialleistungen, Strafverfolgung, Migration und Rechtspflege.',
    points: 30,
    category: 'hochrisiko',
    articleRef: 6
  },
  {
    id: 'q4',
    question: 'Welches Dokument müssen Anbieter von Hochrisiko-KI-Systemen gemäß Artikel 11 erstellen?',
    options: [
      'Einen Geschäftsplan',
      'Eine technische Dokumentation gemäß Anhang IV',
      'Einen Umweltverträglichkeitsbericht',
      'Eine Pressemitteilung'
    ],
    correctAnswer: 1,
    explanation: 'Artikel 11 verlangt eine vollständige technische Dokumentation nach Anhang IV vor Markteinführung. Diese umfasst Systembeschreibung, Risikoabschätzung, Testdaten und mehr.',
    points: 30,
    category: 'hochrisiko',
    articleRef: 11
  },
  {
    id: 'q5',
    question: 'Was verlangt Artikel 13 EU AI Act für Hochrisiko-KI-Systeme?',
    options: [
      'Jährliche Umsatzberichte',
      'Transparenz und Bereitstellung einer verständlichen Gebrauchsanweisung',
      'Kostenlose Nutzung für Behörden',
      'Open-Source-Veröffentlichung des Quellcodes'
    ],
    correctAnswer: 1,
    explanation: 'Artikel 13 fordert, dass Hochrisiko-Systeme so gestaltet sind, dass Betreiber die Ausgaben interpretieren und menschliche Aufsicht ausüben können. Eine klare Gebrauchsanweisung ist Pflicht.',
    points: 30,
    category: 'hochrisiko',
    articleRef: 13
  },
  {
    id: 'q6',
    question: 'Was sind "General Purpose AI Models" (GPAI)?',
    options: [
      'KI-Modelle für den öffentlichen Dienst',
      'Große Grundlagenmodelle die für vielfältige Aufgaben eingesetzt werden können, z.B. GPT oder Claude',
      'KI-Systeme für allgemeine Überwachung',
      'Kostenlose Open-Source-KI-Modelle'
    ],
    correctAnswer: 1,
    explanation: 'GPAI-Modelle (Artikel 51-56) sind Modelle mit weitreichenden Fähigkeiten für diverse Aufgaben – typischerweise große Sprachmodelle. Sie haben spezifische Transparenz- und Dokumentationspflichten.',
    points: 30,
    category: 'gpai',
    articleRef: 51
  },
  {
    id: 'q7',
    question: 'Ab welcher Schwelle gilt ein GPAI-Modell als "systemisches Risiko"?',
    options: [
      'Ab 1 Milliarde Parameter',
      'Ab einem Trainingsaufwand von 10^25 FLOP',
      'Ab 1 Million Nutzern',
      'Ab einem Umsatz von 50 Millionen EUR'
    ],
    correctAnswer: 1,
    explanation: 'GPAI-Modelle mit systemischem Risiko (Artikel 51) sind solche, die mit mehr als 10^25 FLOPs trainiert wurden. Für diese gelten verschärfte Anforderungen wie Adversarial Testing.',
    points: 30,
    category: 'gpai',
    articleRef: 51
  },
  {
    id: 'q8',
    question: 'Welche Sanktionen drohen bei Verstoß gegen Artikel 5 (verbotene Praktiken)?',
    options: [
      'Bis zu 10.000 EUR Bußgeld',
      'Bis zu 35 Mio. EUR oder 7% des weltweiten Jahresumsatzes',
      'Bis zu 100 Mio. EUR Bußgeld',
      'Nur eine Verwarnung beim ersten Verstoß'
    ],
    correctAnswer: 1,
    explanation: 'Verstöße gegen die verbotenen Praktiken (Art. 5) können mit bis zu 35 Mio. EUR oder 7% des weltweiten Jahresumsatzes (je nach dem, was höher ist) bestraft werden.',
    points: 30,
    category: 'durchsetzung',
    articleRef: 99
  },
  {
    id: 'q9',
    question: 'Was müssen Anbieter von Chatbots nach Artikel 50 tun?',
    options: [
      'Den Quellcode veröffentlichen',
      'Nutzer darüber informieren, dass sie mit einem KI-System interagieren',
      'Einen menschlichen Moderator bereitstellen',
      'Alle Gespräche an Behörden melden'
    ],
    correctAnswer: 1,
    explanation: 'Artikel 50 EU AI Act verpflichtet Betreiber von Chatbots und ähnlichen Systemen, Nutzer klar und deutlich zu informieren, dass sie mit einer KI und nicht mit einem Menschen interagieren.',
    points: 30,
    category: 'transparenz',
    articleRef: 50
  },
  {
    id: 'q10',
    question: 'Wer ist laut EU AI Act für die Compliance eines Hochrisiko-KI-Systems hauptverantwortlich?',
    options: [
      'Die Europäische Kommission',
      'Der Anbieter (Provider) des Systems',
      'Der Endnutzer',
      'Die nationale Aufsichtsbehörde'
    ],
    correctAnswer: 1,
    explanation: 'Der Anbieter (Provider) trägt gemäß Artikel 16 die Hauptverantwortung. Er muss das System zertifizieren, Dokumentation erstellen und die CE-Kennzeichnung anbringen.',
    points: 30,
    category: 'grundlagen',
    articleRef: 16
  },
  {
    id: 'q11',
    question: 'Was ist das Ziel des EU AI Acts laut seiner Präambel?',
    options: [
      'KI-Entwicklung in der EU zu verbieten',
      'Vertrauen in KI-Systeme fördern und gleichzeitig Grundrechte schützen',
      'KI-Entwicklung ausschließlich staatlichen Akteuren zu ermöglichen',
      'US-amerikanische KI-Unternehmen vom EU-Markt ausschließen'
    ],
    correctAnswer: 1,
    explanation: 'Der EU AI Act verfolgt einen risikobasierten Ansatz: Er will Innovation ermöglichen, schützt aber gleichzeitig Grundrechte, Sicherheit und Demokratie.',
    points: 30,
    category: 'grundlagen',
    articleRef: 1
  },
  {
    id: 'q12',
    question: 'Was versteht der EU AI Act unter "menschlicher Aufsicht" (Art. 14)?',
    options: [
      'Ein Mensch muss jede KI-Entscheidung persönlich genehmigen',
      'Maßnahmen die es ermöglichen, KI-Systeme zu überwachen und bei Bedarf einzugreifen oder abzuschalten',
      'Behördliche Überwachung aller KI-Systeme',
      'Regelmäßige Audits durch externe Prüfer'
    ],
    correctAnswer: 1,
    explanation: 'Artikel 14 verlangt, dass Hochrisiko-KI-Systeme so konzipiert sind, dass verantwortliche Personen das System wirksam überwachen, Anomalien erkennen und das System notfalls abschalten können.',
    points: 30,
    category: 'hochrisiko',
    articleRef: 14
  },
  {
    id: 'q13',
    question: 'Bis wann müssen Anbieter von Hochrisiko-KI-Systemen (Anhang III) vollständig compliant sein?',
    options: [
      'Sofort ab August 2024',
      'Ab 2. August 2026',
      'Ab 2. August 2027',
      'Ab 2030'
    ],
    correctAnswer: 1,
    explanation: 'Die Anforderungen für Hochrisiko-KI-Systeme nach Anhang III gelten ab dem 2. August 2026 (2 Jahre nach Inkrafttreten). Für bestimmte Bereiche wie Anhang I gibt es abweichende Fristen.',
    points: 30,
    category: 'grundlagen'
  },
  {
    id: 'q14',
    question: 'Was ist die "EU-Datenbank für Hochrisiko-KI-Systeme"?',
    options: [
      'Eine Datenbank aller Europäer die KI nutzen',
      'Ein öffentliches Register, in dem Hochrisiko-KI-Systeme vor Markteinführung registriert werden müssen',
      'Eine geheime Behördendatenbank',
      'Ein freiwilliges Verzeichnis für KI-Startups'
    ],
    correctAnswer: 1,
    explanation: 'Artikel 71 und 72 sehen eine EU-Datenbank vor, in der Anbieter ihre Hochrisiko-Systeme öffentlich registrieren müssen. Dies dient der Transparenz und Behördenaufsicht.',
    points: 30,
    category: 'hochrisiko',
    articleRef: 71
  },
  {
    id: 'q15',
    question: 'Welche Pflichten haben Importeure von Hochrisiko-KI-Systemen?',
    options: [
      'Keine, da nur der Hersteller verantwortlich ist',
      'Sicherstellen dass der Anbieter eine Konformitätsbewertung durchgeführt hat und das System den EU-Anforderungen entspricht',
      'Das System neu entwickeln',
      'Nur eine Importgenehmigung beantragen'
    ],
    correctAnswer: 1,
    explanation: 'Importeure (Artikel 23) müssen prüfen, ob Anbieter alle Pflichten erfüllt haben (Konformitätsbewertung, CE-Kennzeichnung, EU-Konformitätserklärung) bevor sie Systeme auf den EU-Markt bringen.',
    points: 30,
    category: 'hochrisiko',
    articleRef: 23
  },
  {
    id: 'q16',
    question: 'Was sind "synthetische Inhalte" im Sinne des EU AI Acts?',
    options: [
      'Chemisch hergestellte Materialien',
      'KI-generierte Bilder, Videos, Audiodateien oder Texte die täuschend echt wirken',
      'Computersimulationen für Forschungszwecke',
      'Digitale Zwillinge von Produkten'
    ],
    correctAnswer: 1,
    explanation: 'Synthetische Inhalte (Artikel 50 Abs. 4) sind KI-generierte Medieninhalte. Sie müssen mit maschinenlesbaren Markierungen gekennzeichnet sein, um Deepfakes erkennbar zu machen.',
    points: 30,
    category: 'transparenz',
    articleRef: 50
  },
  {
    id: 'q17',
    question: 'Welche Ausnahme gibt es beim Verbot biometrischer Echtzeit-Identifikation?',
    options: [
      'Es gibt keine Ausnahmen',
      'Gezielte Suche nach vermissten Kindern, Abwehr spezifischer Terrorbedrohungen und Fahndung nach Verdächtigen schwerer Straftaten',
      'Alle staatlichen Sicherheitsbehörden sind ausgenommen',
      'Sportveranstaltungen mit mehr als 10.000 Zuschauern'
    ],
    correctAnswer: 1,
    explanation: 'Artikel 5 Abs. 2 und 3 erlauben biometrische Echtzeit-Identifikation durch Strafverfolgungsbehörden in drei engen Ausnahmefällen: Suche nach Vermissten, Terrorabwehr und Fahndung nach Schwerstverbrechern – mit richterlicher Genehmigung.',
    points: 30,
    category: 'verbote',
    articleRef: 5
  },
  {
    id: 'q18',
    question: 'Was ist ein "Betreiber" (Deployer) im Sinne des EU AI Acts?',
    options: [
      'Ein Unternehmen das KI-Systeme entwickelt',
      'Eine natürliche oder juristische Person, die ein KI-System unter eigener Verantwortung einsetzt',
      'Ein Staatsangehöriger der EU',
      'Ein technischer Systemadministrator'
    ],
    correctAnswer: 1,
    explanation: 'Betreiber (Artikel 3 Nr. 4) setzen KI-Systeme in eigener Verantwortung ein. Sie haben eigene Pflichten (Art. 26), z.B. Umsetzung von Nutzungsanweisungen und Meldung von Zwischenfällen.',
    points: 30,
    category: 'grundlagen',
    articleRef: 3
  },
  {
    id: 'q19',
    question: 'Was fordert das Risikomanagementsystem nach Artikel 9?',
    options: [
      'Einmalige Risikobewertung vor Markteinführung',
      'Kontinuierliches iteratives Risikomanagement über den gesamten Lebenszyklus des Systems',
      'Jährliche externe Audits durch Behörden',
      'Versicherungsabschluss gegen KI-Risiken'
    ],
    correctAnswer: 1,
    explanation: 'Artikel 9 verlangt ein systematisches Risikomanagement als kontinuierlichen Prozess – nicht nur einmalig. Es umfasst Risikoidentifikation, -analyse, -bewertung und Risikominimierungsmaßnahmen.',
    points: 30,
    category: 'hochrisiko',
    articleRef: 9
  },
  {
    id: 'q20',
    question: 'Was ist der "AI Office" der Europäischen Kommission?',
    options: [
      'Ein privates KI-Forschungsinstitut',
      'Die zentrale EU-Behörde zur Überwachung der Einhaltung des AI Acts, besonders für GPAI-Modelle',
      'Ein Beratungsunternehmen der Kommission',
      'Ein Programm zur KI-Förderung in Schulen'
    ],
    correctAnswer: 1,
    explanation: 'Das AI Office (Artikel 64) ist die zentrale Aufsichtsstelle der EU-Kommission. Es überwacht GPAI-Modelle, koordiniert nationale Behörden und kann selbst Untersuchungen einleiten.',
    points: 30,
    category: 'durchsetzung',
    articleRef: 64
  },
  {
    id: 'q21',
    question: 'Was regelt Artikel 22 EU AI Act?',
    options: [
      'Die Haftung für KI-Schäden',
      'KI-gestützte Einzelentscheidungen – Personen haben das Recht auf menschliche Überprüfung',
      'Den Export von KI-Systemen in Drittländer',
      'Die Vergabe von KI-Fördermitteln'
    ],
    correctAnswer: 1,
    explanation: 'Artikel 22 gibt betroffenen Personen das Recht, bei ausschließlich KI-basierten Entscheidungen, die sie erheblich betreffen, eine Erklärung zu erhalten und eine menschliche Überprüfung zu verlangen.',
    points: 30,
    category: 'hochrisiko',
    articleRef: 22
  },
  {
    id: 'q22',
    question: 'Müssen Open-Source-KI-Modelle den EU AI Act vollständig einhalten?',
    options: [
      'Nein, Open Source ist vollständig ausgenommen',
      'Ja, vollständig wie kommerzielle Modelle',
      'Teilweise – Transparenzpflichten gelten, aber weniger strenge technische Anforderungen für GPAI-Entwickler',
      'Nur wenn das Modell mehr als 100 Millionen Parameter hat'
    ],
    correctAnswer: 2,
    explanation: 'Für Open-Source-GPAI-Modelle (Artikel 53 Abs. 2) gelten erleichterte Anforderungen: Hauptsächlich Transparenzpflichten (technische Dokumentation, Urheberrechtsregeln), aber keine vollständigen GPAI-Pflichten – außer bei systemischem Risiko.',
    points: 30,
    category: 'gpai',
    articleRef: 53
  },
  {
    id: 'q23',
    question: 'Was ist "Predictive Policing" im Kontext des EU AI Acts?',
    options: [
      'KI-gestützte Verkehrssteuerung',
      'KI-Systeme die auf Basis von Datenanalyse vorhersagen, welche Personen künftig Straftaten begehen könnten',
      'Digitale Strafverfolgungsakte',
      'Automatisierte Geldwäscheprüfung'
    ],
    correctAnswer: 1,
    explanation: 'Predictive Policing – KI-basierte Vorhersage individueller Kriminalität anhand von Profilen – ist nach Artikel 5 Abs. 1 lit. d verboten, da es zu Diskriminierung und unverhältnismäßigen Grundrechtseingriffen führt.',
    points: 30,
    category: 'verbote',
    articleRef: 5
  },
  {
    id: 'q24',
    question: 'Welche Frist gilt für KI-Systeme in Anhang I (sicherheitskritische Produkte wie Medizinprodukte)?',
    options: [
      'Ab August 2025',
      'Ab August 2026',
      'Ab August 2027 (36 Monate nach Inkrafttreten)',
      'Ab August 2030'
    ],
    correctAnswer: 2,
    explanation: 'KI-Systeme als Sicherheitskomponenten regulierter Produkte nach Anhang I (Medizinprodukte, Luftfahrt, Fahrzeuge etc.) haben eine 36-monatige Übergangsfrist bis August 2027.',
    points: 30,
    category: 'grundlagen'
  },
  {
    id: 'q25',
    question: 'Was bedeutet CE-Kennzeichnung für Hochrisiko-KI-Systeme?',
    options: [
      'Nur ein Marketingzertifikat',
      'Konformitätserklärung dass das System die Anforderungen des EU AI Acts erfüllt',
      'Zertifizierung durch die Europäische Zentralbank',
      'Auszeichnung für besonders gute KI-Qualität'
    ],
    correctAnswer: 1,
    explanation: 'Die CE-Kennzeichnung (Artikel 48) ist eine verbindliche Erklärung des Anbieters, dass das Hochrisiko-System alle Anforderungen des EU AI Acts erfüllt. Sie ist Voraussetzung für die Markteinführung in der EU.',
    points: 30,
    category: 'hochrisiko',
    articleRef: 48
  },
]

export const QUIZ_CATEGORIES = [
  { id: 'grundlagen', label: 'Grundlagen', icon: '📚', description: 'Basiswissen zum EU AI Act' },
  { id: 'verbote', label: 'Verbote Art. 5', icon: '⛔', description: 'Verbotene KI-Praktiken' },
  { id: 'hochrisiko', label: 'Hochrisiko', icon: '⚠️', description: 'Hochrisiko-KI-Systeme' },
  { id: 'transparenz', label: 'Transparenz', icon: '🔍', description: 'Transparenzpflichten' },
  { id: 'gpai', label: 'GPAI & LLMs', icon: '🤖', description: 'Große KI-Modelle' },
  { id: 'durchsetzung', label: 'Sanktionen', icon: '⚖️', description: 'Durchsetzung & Bußgelder' },
]
