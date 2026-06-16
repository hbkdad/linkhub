'use client'

import { updateProfile } from '@/lib/actions/profile'
import type { Profile } from '@/types/database'
import { useState } from 'react'

const THEMES = [
  { value: 'clean-dark', label: '🌑 Clean Dark' },
  { value: 'clean-light', label: '☀️ Clean Light' },
  { value: 'neon', label: '💜 Neon' },
  { value: 'minimal', label: '⬜ Minimal' },
]

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const result = await updateProfile(new FormData(e.currentTarget))
    setSaving(false)
    if (result?.error) {
      setError(result.error)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg">
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3">{error}</div>
      )}

      <Field label="Username / Page URL" hint="linkhub.to/u/...">
        <input
          name="slug" defaultValue={profile.slug} required
          pattern="[a-z0-9-]+"
          className="input"
          placeholder="yourname"
        />
      </Field>

      <Field label="Display Name">
        <input name="display_name" defaultValue={profile.display_name ?? ''} className="input" placeholder="Your Name" />
      </Field>

      <Field label="Headline">
        <input name="headline" defaultValue={profile.headline ?? ''} className="input" placeholder="What you do in one line" />
      </Field>

      <Field label="Bio">
        <textarea
          name="bio" defaultValue={profile.bio ?? ''} rows={4}
          className="input resize-none"
          placeholder="A few sentences about you..."
        />
      </Field>

      <Field label="Avatar URL">
        <input name="avatar_url" defaultValue={profile.avatar_url ?? ''} className="input" placeholder="https://..." type="url" />
      </Field>

      <Field label="Theme">
        <select name="theme" defaultValue={profile.theme} className="input">
          {THEMES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </Field>

      <button
        type="submit" disabled={saving}
        className="self-start bg-primary text-primary-foreground rounded-lg px-6 py-3 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save profile'}
      </button>

      <style>{`.input { @apply w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring; }`}</style>
    </form>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">
        {label}
        {hint && <span className="text-muted-foreground font-normal ml-2 text-xs">{hint}</span>}
      </label>
      {children}
    </div>
  )
}
