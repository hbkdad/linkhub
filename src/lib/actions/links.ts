'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createLink(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles').select('id').eq('id', user.id).single()
  if (!profile) return { error: 'Profile not found' }

  const { data: existing } = await supabase
    .from('links').select('position').eq('profile_id', user.id).order('position', { ascending: false }).limit(1)

  const maxPos = existing?.[0]?.position ?? -1

  const { error } = await supabase.from('links').insert({
    profile_id: user.id,
    title: formData.get('title') as string,
    url: formData.get('url') as string,
    kind: (formData.get('kind') as string) || 'link',
    position: maxPos + 1,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/links')
  return { success: true }
}

export async function updateLink(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('links').update({
    title: formData.get('title') as string,
    url: formData.get('url') as string,
    kind: formData.get('kind') as string,
    is_active: formData.get('is_active') === 'true',
  }).eq('id', id).eq('profile_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/links')
  return { success: true }
}

export async function deleteLink(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('links').delete().eq('id', id).eq('profile_id', user.id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/links')
  return { success: true }
}

export async function reorderLinks(orderedIds: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const updates = orderedIds.map((id, position) =>
    supabase.from('links').update({ position }).eq('id', id).eq('profile_id', user.id)
  )
  await Promise.all(updates)
  revalidatePath('/dashboard/links')
  return { success: true }
}
