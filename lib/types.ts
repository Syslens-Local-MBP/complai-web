export type Persona = 'legal' | 'business' | 'developer' | 'learner'

export interface Profile {
  id: string
  email: string | null
  company: string | null
  persona: Persona
  onboarding_completed: boolean
  preferred_language: 'de' | 'en'
  created_at: string
  updated_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  total_points: number
  level: number
  streak_days: number
  last_activity_date: string | null
  badges: Badge[]
  articles_read: number
  assessments_completed: number
  created_at: string
}

export interface Badge {
  id: string
  name: string
  icon: string
  earned_at: string
}

export interface ArticleRead {
  id: string
  user_id: string
  article_number: number
  read_at: string
  points_earned: number
}

export interface Highlight {
  id: string
  user_id: string
  article_number: number
  start_offset: number
  end_offset: number
  selected_text: string | null
  color: 'yellow' | 'blue' | 'green' | 'pink'
  note: string | null
  created_at: string
}

export interface Assessment {
  id: string
  user_id: string
  ai_system_name: string
  description: string | null
  answers: Record<string, unknown> | null
  risk_level: 'unacceptable' | 'high' | 'limited' | 'minimal' | null
  result_title: string | null
  ai_analysis: Record<string, unknown> | null
  requirements_met: number
  total_requirements: number
  shared_with: string[]
  created_at: string
}

export interface RiskLevel {
  key: 'unacceptable' | 'high' | 'limited' | 'minimal'
  label: string
  color: string
  bgColor: string
  description: string
}
