'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthForm } from '@/components/auth/AuthForm'
import { createClient } from '@/lib/supabase/client'

export default function SignupClient() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSignup = async ({ email, password, company }: { email: string; password?: string; company?: string }) => {
    if (!password) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const persona = searchParams.get('persona') || 'learner'

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { company, persona },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">✉️</div>
          <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">Fast geschafft!</h2>
          <p className="text-gray-500">Wir haben Ihnen eine Bestätigungs-E-Mail gesendet. Bitte prüfen Sie Ihr Postfach.</p>
        </div>
      </div>
    )
  }

  return <AuthForm mode="signup" onSubmit={handleSignup} error={error} loading={loading} />
}
