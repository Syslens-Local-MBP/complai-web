'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Shield } from 'lucide-react'

interface AuthFormProps {
  mode: 'login' | 'signup' | 'forgot-password'
  onSubmit: (data: { email: string; password?: string; company?: string }) => Promise<void>
  error?: string | null
  loading?: boolean
}

export function AuthForm({ mode, onSubmit, error, loading }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ email, password, company })
  }

  const titles = {
    login: 'Willkommen zurück',
    signup: 'Konto erstellen',
    'forgot-password': 'Passwort zurücksetzen',
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 font-bold text-2xl mb-2">
            <Shield className="h-7 w-7 text-[#003399]" />
            <span className="text-[#003399]">Compl</span><span className="text-[#FFCC00]">AI</span>
          </div>
          <h1 className="text-xl font-semibold text-[#1A1A2E] mt-4">{titles[mode]}</h1>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-8">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Unternehmen (optional)
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="Ihre Firma GmbH"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#003399] focus:outline-none focus:ring-2 focus:ring-[#003399]/20"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                E-Mail-Adresse
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="max@firma.de"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#003399] focus:outline-none focus:ring-2 focus:ring-[#003399]/20"
              />
            </div>

            {mode !== 'forgot-password' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Passwort
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'Min. 8 Zeichen' : '••••••••'}
                    minLength={mode === 'signup' ? 8 : undefined}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm focus:border-[#003399] focus:outline-none focus:ring-2 focus:ring-[#003399]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {mode === 'login' && (
                  <div className="mt-1 text-right">
                    <Link href="/forgot-password" className="text-xs text-[#003399] hover:underline">
                      Passwort vergessen?
                    </Link>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#003399] py-2.5 text-sm font-semibold text-white hover:bg-[#002277] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Bitte warten...' : mode === 'login' ? 'Anmelden' : mode === 'signup' ? 'Konto erstellen' : 'Link senden'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {mode === 'login' ? (
              <>Noch kein Konto? <Link href="/signup" className="text-[#003399] font-medium hover:underline">Kostenlos registrieren</Link></>
            ) : mode === 'signup' ? (
              <>Bereits registriert? <Link href="/login" className="text-[#003399] font-medium hover:underline">Anmelden</Link></>
            ) : (
              <Link href="/login" className="text-[#003399] font-medium hover:underline">Zurück zum Login</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
