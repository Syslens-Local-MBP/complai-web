'use client'

import { useState } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleReset = async ({ email }: { email: string }) => {
    setLoading(true)
    setError(null)
    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    })

    if (error) { setError(error.message); setLoading(false); return }
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl font-bold mb-2">E-Mail gesendet!</h2>
          <p className="text-gray-500">Prüfen Sie Ihr Postfach für den Passwort-Reset-Link.</p>
        </div>
      </div>
    )
  }

  return <AuthForm mode="forgot-password" onSubmit={handleReset} error={error} loading={loading} />
}
