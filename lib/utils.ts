import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AI_ACT_DEADLINE, GAMIFICATION } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCountdownDays(): number {
  const now = new Date()
  const diff = AI_ACT_DEADLINE.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function getLevelFromPoints(points: number): number {
  const thresholds = GAMIFICATION.levelThresholds
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (points >= thresholds[i]) return i + 1
  }
  return 1
}

export function getLevelName(level: number): string {
  return GAMIFICATION.levelNames[Math.min(level - 1, GAMIFICATION.levelNames.length - 1)]
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(new Date(dateString))
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '…'
}
