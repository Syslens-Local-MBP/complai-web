import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: { value: number; label: string }
  color?: 'blue' | 'yellow' | 'green' | 'red'
}

const colorMap = {
  blue: { icon: 'text-blue-600', bg: 'bg-blue-50' },
  yellow: { icon: 'text-yellow-600', bg: 'bg-yellow-50' },
  green: { icon: 'text-green-600', bg: 'bg-green-50' },
  red: { icon: 'text-red-600', bg: 'bg-red-50' },
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend, color = 'blue' }: StatsCardProps) {
  const colors = colorMap[color]

  return (
    <div className="rounded-xl border bg-white p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-[#1A1A2E] mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={cn('rounded-lg p-2.5', colors.bg)}>
          <Icon className={cn('h-5 w-5', colors.icon)} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t flex items-center gap-1 text-xs">
          <span className={trend.value >= 0 ? 'text-green-600' : 'text-red-600'}>
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </span>
          <span className="text-gray-400">{trend.label}</span>
        </div>
      )}
    </div>
  )
}
