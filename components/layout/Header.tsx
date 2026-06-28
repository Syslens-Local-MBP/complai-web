'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Shield } from 'lucide-react'
import { cn, getCountdownDays } from '@/lib/utils'

const navLinks = [
  { href: '/articles', label: 'Artikel' },
  { href: '/assessment', label: 'Assessment' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/glossar', label: 'Glossar' },
]

export function Header({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const days = getCountdownDays()

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Shield className="h-6 w-6 text-[#003399]" />
            <span className="text-[#003399]">Compl</span>
            <span className="text-[#FFCC00] -ml-1">AI</span>
          </Link>

          {/* Countdown Badge */}
          <div className="hidden sm:flex items-center gap-1 rounded-full bg-[#FEF2F2] border border-red-200 px-3 py-1 text-xs font-medium text-red-700">
            <span className="animate-pulse h-1.5 w-1.5 rounded-full bg-red-500 inline-block" />
            Deadline in {days} Tagen
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname.startsWith(link.href)
                    ? 'bg-[#003399]/10 text-[#003399]'
                    : 'text-gray-600 hover:text-[#003399] hover:bg-gray-100'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth CTAs */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="rounded-md bg-[#003399] px-4 py-2 text-sm font-medium text-white hover:bg-[#002277] transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-[#003399] px-3 py-2">
                  Anmelden
                </Link>
                <Link
                  href="/signup"
                  className="rounded-md bg-[#003399] px-4 py-2 text-sm font-medium text-white hover:bg-[#002277] transition-colors"
                >
                  Kostenlos starten
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t flex flex-col gap-2">
            <Link href="/login" className="block px-3 py-2 text-sm font-medium text-gray-700">Anmelden</Link>
            <Link href="/signup" className="block rounded-md bg-[#003399] px-3 py-2 text-sm font-medium text-white text-center">
              Kostenlos starten
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
