'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function recordClick(linkId: string, profileId: string) {
  const supabase = await createClient()
  const headersList = await headers()
  const referrer = headersList.get('referer') ?? null
  const userAgent = headersList.get('user-agent') ?? null

  await supabase.from('link_clicks').insert({
    link_id: linkId,
    profile_id: profileId,
    referrer,
    user_agent: userAgent,
  })
}
