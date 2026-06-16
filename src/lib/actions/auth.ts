'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error || !data.user) {
    return { error: error?.message ?? 'Sign up failed' }
  }

  const slug = username.toLowerCase().replace(/[^a-z0-9-]/g, '-')
  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    slug,
    display_name: username,
  })

  if (profileError) {
    return { error: profileError.message }
  }

  redirect('/dashboard')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
