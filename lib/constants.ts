import type { Persona, RiskLevel } from './types'

export const PERSONAS: Record<Persona, {
  label: string
  description: string
  icon: string
  contentLevel: 'advanced' | 'intermediate' | 'technical' | 'basic'
  features: string[]
}> = {
  legal: {
    label: 'Rechtsfachkraft',
    description: 'Juristen, Compliance Officer, Datenschutzbeauftragte',
    icon: '⚖️',
    contentLevel: 'advanced',
    features: ['Volltext-Artikel', 'Zitat-Generator', 'Querverweise', 'PDF-Export'],
  },
  business: {
    label: 'Unternehmer',
    description: 'Geschäftsführer, Produktmanager, Compliance Teams',
    icon: '🏢',
    contentLevel: 'intermediate',
    features: ['Risiko-Assessment', 'Compliance-Checkliste', 'Zusammenfassungen', 'Team-Sharing'],
  },
  developer: {
    label: 'KI-Entwickler',
    description: 'Software-Teams, ML-Engineers, Tech Leads',
    icon: '💻',
    contentLevel: 'technical',
    features: ['Technische Details', 'Implementierungs-Guide', 'API-Referenzen', 'Code-Beispiele'],
  },
  learner: {
    label: 'Lernender',
    description: 'Studierende, Quereinsteiger, Neugierige',
    icon: '📚',
    contentLevel: 'basic',
    features: ['Vereinfachte Texte', 'Lernpfade', 'Quiz', 'Glossar'],
  },
}

export const RISK_LEVELS: RiskLevel[] = [
  {
    key: 'unacceptable',
    label: 'Inakzeptables Risiko',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    description: 'Verbotene KI-Praktiken nach Art. 5 EU AI Act',
  },
  {
    key: 'high',
    label: 'Hohes Risiko',
    color: '#D97706',
    bgColor: '#FFFBEB',
    description: 'Strenge Anforderungen nach Anhang III',
  },
  {
    key: 'limited',
    label: 'Begrenztes Risiko',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    description: 'Transparenzpflichten nach Art. 50',
  },
  {
    key: 'minimal',
    label: 'Minimales Risiko',
    color: '#16A34A',
    bgColor: '#F0FDF4',
    description: 'Freiwillige Verhaltenskodizes empfohlen',
  },
]

export const AI_ACT_DEADLINE = new Date('2026-08-02T00:00:00.000Z')

export const GAMIFICATION = {
  pointsPerArticle: 10,
  pointsPerAssessment: 50,
  pointsPerHighlight: 5,
  levelThresholds: [0, 100, 300, 600, 1000, 2000, 5000],
  levelNames: ['Einsteiger', 'Lernender', 'Fortgeschrittener', 'Experte', 'Profi', 'Master', 'Compliance-Champion'],
}
