import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LinkManager from '@/components/dashboard/LinkManager'

export default async function LinksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', user.id)
    .order('position')

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Links</h1>
      <LinkManager links={links ?? []} />
    </div>
  )
}
