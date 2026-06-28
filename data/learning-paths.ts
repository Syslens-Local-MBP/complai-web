export interface LearningPath {
  id: string
  title: string
  description: string
  targetPersona: string[]
  duration: string
  articles: number[]
  icon: string
  badge: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  color: string
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'basics',
    title: 'EU AI Act Grundlagen',
    description: 'Perfekter Einstieg für alle, die den AI Act verstehen wollen. Von der Zielsetzung bis zu den ersten Pflichten.',
    targetPersona: ['learner', 'business'],
    duration: '2 Stunden',
    articles: [1, 2, 3, 5, 6],
    icon: '🎓',
    badge: 'basics_completed',
    difficulty: 'beginner',
    color: 'blue'
  },
  {
    id: 'business_compliance',
    title: 'Business Compliance Pfad',
    description: 'Was Unternehmen jetzt tun müssen. Konkrete Handlungsempfehlungen für Compliance-Verantwortliche.',
    targetPersona: ['business'],
    duration: '3 Stunden',
    articles: [2, 5, 6, 9, 10, 13, 14, 22],
    icon: '🏢',
    badge: 'business_compliant',
    difficulty: 'intermediate',
    color: 'purple'
  },
  {
    id: 'gpai_deep_dive',
    title: 'GPAI & Große Sprachmodelle',
    description: 'Für Teams die LLMs, ChatGPT-ähnliche Systeme oder Foundation Models entwickeln oder einsetzen.',
    targetPersona: ['developer', 'legal'],
    duration: '4 Stunden',
    articles: [51, 52, 53, 54, 55, 56],
    icon: '🤖',
    badge: 'gpai_expert',
    difficulty: 'advanced',
    color: 'green'
  },
  {
    id: 'prohibited_ai',
    title: 'Verbotene KI-Praktiken',
    description: 'Was absolut verboten ist und warum. Wichtig für alle die KI-Systeme entwickeln oder einsetzen.',
    targetPersona: ['legal', 'developer', 'business'],
    duration: '1 Stunde',
    articles: [5],
    icon: '⛔',
    badge: 'safety_aware',
    difficulty: 'beginner',
    color: 'red'
  },
  {
    id: 'legal_deep_dive',
    title: 'Rechtliche Tiefenanalyse',
    description: 'Für Juristen und Compliance-Experten: Konformitätsbewertung, CE-Kennzeichnung, Haftungsfragen.',
    targetPersona: ['legal'],
    duration: '5 Stunden',
    articles: [43, 44, 47, 48, 49, 72, 99, 101],
    icon: '⚖️',
    badge: 'legal_expert',
    difficulty: 'advanced',
    color: 'orange'
  },
  {
    id: 'developer_path',
    title: 'Developer Compliance Guide',
    description: 'Technische Anforderungen: Logging, Dokumentation, Datenverwaltung und Robustheit für Entwickler.',
    targetPersona: ['developer'],
    duration: '3 Stunden',
    articles: [9, 10, 11, 12, 15, 17],
    icon: '💻',
    badge: 'dev_compliant',
    difficulty: 'intermediate',
    color: 'cyan'
  },
]
