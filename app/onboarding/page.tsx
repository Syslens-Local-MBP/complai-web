import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PersonaWizard } from '@/components/onboarding/PersonaWizard'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return <PersonaWizard userId={user.id} />
}
