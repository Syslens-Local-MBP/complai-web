// EU AI Act Assessment Logic
// Classification engine and type definitions

export type RiskLevel = 'VERBOTEN' | 'HOCHRISIKO' | 'BEGRENZTES_RISIKO' | 'MINIMAL'

export interface AssessmentAnswers {
  // Step 0
  systemName: string
  systemDescription: string
  // Step 1
  sector: string
  // Step 2
  usageTypes: string[]
  // Step 3
  affectedPersons: string[]
  // Step 4
  usesBiometricData: boolean
  realtimeProcessing: boolean
  manipulationPossible: boolean
  socialScoring: boolean
  predictivePolicing: boolean
}

export interface ComplianceRequirement {
  id: string
  title: string
  description: string
  effort: 'hoch' | 'mittel' | 'niedrig'
  articleRef: string
  mandatory: boolean
}

export interface TimelineItem {
  date: string
  title: string
  description: string
}

export interface AssessmentResult {
  riskLevel: RiskLevel
  reasoning: string
  relevantArticles: number[]
  requirements: ComplianceRequirement[]
  timeline: TimelineItem[]
}

export interface AssessmentRecord {
  id: string
  systemName: string
  systemDescription: string
  riskLevel: RiskLevel
  createdAt: string
  answers: AssessmentAnswers
  result: AssessmentResult
}

// High-risk sectors per EU AI Act Annex III
const HIGH_RISK_SECTORS = new Set(['hr', 'gesundheit', 'bildung', 'justiz', 'kredit', 'kritis'])

// Requirements database
const REQUIREMENTS_DB: Record<RiskLevel, ComplianceRequirement[]> = {
  VERBOTEN: [
    {
      id: 'v1',
      title: 'Sofortige Einstellung der Nutzung',
      description:
        'Das System entspricht verbotenen KI-Praktiken gemäß Art. 5 EU AI Act und muss unverzüglich außer Betrieb genommen werden.',
      effort: 'hoch',
      articleRef: 'Art. 5',
      mandatory: true,
    },
    {
      id: 'v2',
      title: 'Rechtliche Beratung einholen',
      description:
        'Konsultieren Sie umgehend einen auf KI-Recht spezialisierten Anwalt, um rechtliche Risiken zu minimieren.',
      effort: 'hoch',
      articleRef: 'Art. 5',
      mandatory: true,
    },
    {
      id: 'v3',
      title: 'Meldung an Behörden prüfen',
      description:
        'Prüfen Sie, ob eine Meldepflicht gegenüber den zuständigen nationalen Behörden besteht.',
      effort: 'mittel',
      articleRef: 'Art. 5',
      mandatory: true,
    },
  ],
  HOCHRISIKO: [
    {
      id: 'h1',
      title: 'Risikomanagementsystem einrichten',
      description:
        'Implementieren Sie ein kontinuierliches Risikomanagementsystem über den gesamten Lebenszyklus des KI-Systems.',
      effort: 'hoch',
      articleRef: 'Art. 9',
      mandatory: true,
    },
    {
      id: 'h2',
      title: 'Technische Dokumentation erstellen',
      description: 'Erstellen Sie vollständige technische Dokumentation nach Anhang IV des EU AI Act.',
      effort: 'hoch',
      articleRef: 'Art. 11, Anhang IV',
      mandatory: true,
    },
    {
      id: 'h3',
      title: 'Datenverwaltung & Governance',
      description:
        'Etablieren Sie Praktiken für Datenverwaltung, Trainingsdaten-Dokumentation und Datenqualitätssicherung.',
      effort: 'hoch',
      articleRef: 'Art. 10',
      mandatory: true,
    },
    {
      id: 'h4',
      title: 'Transparenz & Nutzerinformation',
      description:
        'Stellen Sie betroffenen Nutzern ausreichende Informationen zur Verfügung, um informierte Entscheidungen treffen zu können.',
      effort: 'mittel',
      articleRef: 'Art. 13',
      mandatory: true,
    },
    {
      id: 'h5',
      title: 'Menschliche Aufsicht sicherstellen',
      description:
        'Implementieren Sie Maßnahmen, die eine wirksame menschliche Aufsicht über das KI-System ermöglichen.',
      effort: 'mittel',
      articleRef: 'Art. 14',
      mandatory: true,
    },
    {
      id: 'h6',
      title: 'Genauigkeit, Robustheit & Cybersicherheit',
      description:
        'Stellen Sie sicher, dass das System ein angemessenes Maß an Genauigkeit, Robustheit und Cybersicherheit gewährleistet.',
      effort: 'hoch',
      articleRef: 'Art. 15',
      mandatory: true,
    },
    {
      id: 'h7',
      title: 'Konformitätsbewertung durchführen',
      description: 'Führen Sie vor dem Inverkehrbringen eine Konformitätsbewertung durch.',
      effort: 'hoch',
      articleRef: 'Art. 43',
      mandatory: true,
    },
    {
      id: 'h8',
      title: 'EU-Datenbank Registrierung',
      description: 'Registrieren Sie das KI-System in der EU-Datenbank für Hochrisiko-KI-Systeme.',
      effort: 'mittel',
      articleRef: 'Art. 49',
      mandatory: true,
    },
    {
      id: 'h9',
      title: 'CE-Kennzeichnung anbringen',
      description: 'Bringen Sie die CE-Kennzeichnung vor dem Inverkehrbringen an.',
      effort: 'niedrig',
      articleRef: 'Art. 48',
      mandatory: true,
    },
    {
      id: 'h10',
      title: 'Protokollierung & Monitoring',
      description:
        'Implementieren Sie automatische Protokollierung und kontinuierliches Monitoring der Systemleistung.',
      effort: 'mittel',
      articleRef: 'Art. 12',
      mandatory: true,
    },
  ],
  BEGRENZTES_RISIKO: [
    {
      id: 'b1',
      title: 'Transparenzpflichten erfüllen',
      description:
        'Informieren Sie Nutzer, wenn sie mit einem KI-System interagieren (z.B. Chatbots, Deep-Fakes).',
      effort: 'niedrig',
      articleRef: 'Art. 50',
      mandatory: true,
    },
    {
      id: 'b2',
      title: 'KI-generierte Inhalte kennzeichnen',
      description: 'Kennzeichnen Sie KI-generierte Inhalte (Bilder, Audio, Video, Text) maschinenlesbar.',
      effort: 'niedrig',
      articleRef: 'Art. 50',
      mandatory: true,
    },
    {
      id: 'b3',
      title: 'Interne Dokumentation pflegen',
      description: 'Führen Sie interne Dokumentation über das KI-System und dessen Einsatz.',
      effort: 'niedrig',
      articleRef: 'Art. 50',
      mandatory: false,
    },
  ],
  MINIMAL: [
    {
      id: 'm1',
      title: 'Freiwillige Verhaltenskodizes prüfen',
      description:
        'Erwägen Sie die freiwillige Anwendung von Verhaltenskodizes für KI-Systeme mit minimalem Risiko.',
      effort: 'niedrig',
      articleRef: 'Art. 95',
      mandatory: false,
    },
    {
      id: 'm2',
      title: 'Internes KI-Register führen',
      description: 'Dokumentieren Sie intern alle eingesetzten KI-Systeme für Governance-Zwecke.',
      effort: 'niedrig',
      articleRef: 'Art. 95',
      mandatory: false,
    },
  ],
}

const TIMELINE_DB: Record<RiskLevel, TimelineItem[]> = {
  VERBOTEN: [
    { date: 'Sofort', title: 'Nutzung einstellen', description: 'Betrieb des verbotenen KI-Systems unverzüglich einstellen' },
    { date: 'Innerhalb 7 Tage', title: 'Rechtliche Beratung', description: 'Anwalt mit KI-Recht Expertise konsultieren' },
    { date: 'Innerhalb 30 Tage', title: 'Behörden informieren', description: 'Meldepflicht prüfen und ggf. Behörden benachrichtigen' },
  ],
  HOCHRISIKO: [
    { date: 'Jetzt', title: 'Gap-Analyse starten', description: 'Aktuellen Compliance-Status analysieren' },
    { date: 'Q3 2025', title: 'Dokumentation & Risikomanagement', description: 'Technische Dokumentation und Risikomanagementsystem aufbauen' },
    { date: 'Q4 2025', title: 'Konformitätsbewertung', description: 'Interne oder externe Konformitätsbewertung durchführen' },
    { date: 'Q1 2026', title: 'EU-Datenbank Registrierung', description: 'System in EU-Datenbank registrieren und CE-Kennzeichnung anbringen' },
    { date: '2. August 2026', title: 'Vollständige Compliance', description: 'Deadline für vollständige Compliance von Hochrisiko-KI-Systemen' },
  ],
  BEGRENZTES_RISIKO: [
    { date: 'Q2 2025', title: 'Transparenzmaßnahmen implementieren', description: 'Nutzerinformationen und Kennzeichnungen einrichten' },
    { date: 'Q3 2025', title: 'Dokumentation abschließen', description: 'Interne Dokumentation vervollständigen' },
    { date: '2. August 2026', title: 'Compliance gesichert', description: 'Alle Transparenzpflichten erfüllt' },
  ],
  MINIMAL: [
    { date: 'Optional', title: 'Verhaltenskodex prüfen', description: 'Freiwillige Maßnahmen evaluieren' },
    { date: 'Laufend', title: 'KI-Governance', description: 'Internes KI-Register aktuell halten' },
  ],
}

export function classifyAISystem(answers: AssessmentAnswers): AssessmentResult {
  // Check for VERBOTEN conditions (Art. 5)
  if (answers.socialScoring) {
    return buildResult('VERBOTEN', [
      'Das System bewertet das Sozialverhalten von Personen. Dies fällt unter die verbotenen KI-Praktiken gemäß Art. 5 Abs. 1 lit. c EU AI Act (Social Scoring).',
    ])
  }

  if (answers.predictivePolicing) {
    return buildResult('VERBOTEN', [
      'Systeme zur Vorhersage von Straftaten oder zukünftigem Verhalten auf Basis von Profiling sind nach Art. 5 Abs. 1 EU AI Act verboten.',
    ])
  }

  if (
    answers.sector === 'biometrie' &&
    answers.usesBiometricData &&
    answers.realtimeProcessing &&
    answers.usageTypes.includes('identifikation')
  ) {
    return buildResult('VERBOTEN', [
      'Echtzeit-Biometrie-Fernidentifikationssysteme im öffentlichen Raum sind nach Art. 5 Abs. 1 lit. d EU AI Act grundsätzlich verboten.',
    ])
  }

  // Check for HOCHRISIKO conditions (Annex III)
  const riskReasons: string[] = []

  if (HIGH_RISK_SECTORS.has(answers.sector)) {
    const sectorNames: Record<string, string> = {
      hr: 'Personalwesen (Einstellungen, Beurteilungen, Kündigungen)',
      gesundheit: 'Gesundheitswesen (Diagnostik, Therapie, Pflege)',
      bildung: 'Bildung & Ausbildung (Prüfungen, Zulassungen)',
      justiz: 'Justiz & Rechtspflege (Strafverfolgung, Gerichte)',
      kredit: 'Kredit & Sozialleistungen (Kreditwürdigkeitsprüfung)',
      kritis: 'Kritische Infrastruktur (Strom, Wasser, Transport)',
    }
    riskReasons.push(`Einsatz im Hochrisiko-Sektor: ${sectorNames[answers.sector] || answers.sector} (Anhang III EU AI Act).`)
  }

  if (answers.affectedPersons.includes('kinder')) {
    riskReasons.push('Betroffen sind Kinder unter 18 Jahren — dies erhöht das Risikopotenzial erheblich.')
  }

  if (answers.usageTypes.includes('autonome_entscheidung')) {
    riskReasons.push('Das System trifft autonome Entscheidungen ohne menschliche Überprüfung — ein wesentlicher Hochrisiko-Indikator.')
  }

  if (answers.usesBiometricData && answers.usageTypes.includes('identifikation')) {
    riskReasons.push('Das System verarbeitet biometrische Daten zur Identifikation von Personen.')
  }

  if (answers.sector === 'transport' && answers.usageTypes.includes('autonome_entscheidung')) {
    riskReasons.push('Autonome Entscheidungssysteme im Transportbereich (z.B. autonomes Fahren) gelten als Hochrisiko-KI.')
  }

  if (riskReasons.length > 0) {
    return buildResult('HOCHRISIKO', riskReasons)
  }

  // Check for BEGRENZTES_RISIKO
  const limitedReasons: string[] = []

  if (answers.usageTypes.includes('inhaltserzeugung')) {
    limitedReasons.push('Das System erzeugt Inhalte (Texte, Bilder, Videos) — Transparenzpflichten nach Art. 50 gelten.')
  }

  if (answers.usageTypes.includes('entscheidungsunterstuetzung')) {
    limitedReasons.push('Das System unterstützt Entscheidungen von Menschen — eingeschränkte Transparenzpflichten gelten.')
  }

  if (answers.manipulationPossible) {
    limitedReasons.push('Das System kann Verhalten oder Entscheidungen beeinflussen — Transparenzanforderungen nach Art. 50 sind zu beachten.')
  }

  if (limitedReasons.length > 0) {
    return buildResult('BEGRENZTES_RISIKO', limitedReasons)
  }

  // Default: MINIMAL
  return buildResult('MINIMAL', [
    'Das System weist keine der für höhere Risikostufen relevanten Merkmale auf. Es handelt sich um ein KI-System mit minimalem Risiko.',
  ])
}

function buildResult(riskLevel: RiskLevel, reasonParts: string[]): AssessmentResult {
  const articleMap: Record<RiskLevel, number[]> = {
    VERBOTEN: [5, 3, 6],
    HOCHRISIKO: [6, 9, 10, 11, 12, 13, 14, 15, 43, 48, 49],
    BEGRENZTES_RISIKO: [50, 52, 53],
    MINIMAL: [95, 96],
  }

  return {
    riskLevel,
    reasoning: reasonParts.join(' '),
    relevantArticles: articleMap[riskLevel],
    requirements: REQUIREMENTS_DB[riskLevel],
    timeline: TIMELINE_DB[riskLevel],
  }
}

export function getRiskLevelLabel(level: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    VERBOTEN: 'Verboten',
    HOCHRISIKO: 'Hochrisiko',
    BEGRENZTES_RISIKO: 'Begrenztes Risiko',
    MINIMAL: 'Minimales Risiko',
  }
  return labels[level]
}

export function getRiskLevelColor(level: RiskLevel): {
  text: string
  bg: string
  border: string
  badge: string
} {
  const colors: Record<RiskLevel, { text: string; bg: string; border: string; badge: string }> = {
    VERBOTEN: { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-600 text-white' },
    HOCHRISIKO: { text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-500 text-white' },
    BEGRENZTES_RISIKO: { text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-500 text-white' },
    MINIMAL: { text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-600 text-white' },
  }
  return colors[level]
}
