'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const slug = (formData.get('slug') as string).toLowerCase().replace(/[^a-z0-9-]/g, '-')
  const { error } = await supabase.from('profiles').update({
    slug,
    display_name: formData.get('display_name') as string,
    headline: formData.get('headline') as string,
    bio: formData.get('bio') as string,
    avatar_url: formData.get('avatar_url') as string,
    theme: formData.get('theme') as string,
    updated_at: new Date().toISOString(),
  }).eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return { success: true }
}
