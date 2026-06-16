import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PublicProfile from '@/components/public/PublicProfile'
import { headers } from 'next/headers'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles').select('display_name, headline, bio').eq('slug', slug).single()

  if (!profile) return { title: 'Not found' }

  return {
    title: `${profile.display_name ?? slug} — LinkHub`,
    description: profile.headline ?? profile.bio ?? undefined,
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('slug', slug).single()

  if (!profile) notFound()

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('is_active', true)
    .order('position')

  // Record page view (fire-and-forget)
  const headersList = await headers()
  const referrer = headersList.get('referer') ?? null
  const userAgent = headersList.get('user-agent') ?? null

  supabase.from('page_views').insert({
    profile_id: profile.id,
    referrer,
    user_agent: userAgent,
  }).then(() => {})

  return <PublicProfile profile={profile} links={links ?? []} />
}
