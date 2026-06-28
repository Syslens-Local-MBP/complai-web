'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, LayoutDashboard, ShieldCheck, GraduationCap, Search, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/articles', label: 'Artikel', icon: BookOpen },
  { href: '/assessment', label: 'Assessment', icon: ShieldCheck },
  { href: '/glossar', label: 'Glossar', icon: GraduationCap },
  { href: '/search', label: 'Suche', icon: Search },
]

export function Sidebar({ points = 0, level = 1 }: { points?: number; level?: number }) {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r bg-white px-4 py-6">
      <nav className="space-y-1 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname.startsWith(href)
                ? 'bg-[#003399] text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-[#003399]'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Points badge */}
      <div className="rounded-lg bg-[#003399]/5 border border-[#003399]/20 p-3 mt-4">
        <div className="flex items-center gap-2 mb-1">
          <Star className="h-4 w-4 text-[#FFCC00]" />
          <span className="text-xs font-semibold text-[#003399]">Level {level}</span>
        </div>
        <p className="text-xs text-gray-500">{points} Punkte gesammelt</p>
      </div>
    </aside>
  )
}
