import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/dashboard/ProfileForm'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  if (!profile) redirect('/login')

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <ProfileForm profile={profile} />
    </div>
  )
}
