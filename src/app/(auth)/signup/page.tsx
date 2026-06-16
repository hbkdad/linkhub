'use client'

import { signUp } from '@/lib/actions/auth'
import Link from 'next/link'
import { useState } from 'react'

export default function SignupPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signUp(new FormData(e.currentTarget))
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-bold text-2xl">LinkHub</Link>
          <p className="text-muted-foreground mt-2">Create your free page</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 text-center">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="username">Username</label>
            <div className="flex items-center rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring overflow-hidden">
              <span className="px-3 text-muted-foreground text-sm border-r border-input py-3">linkhub.to/u/</span>
              <input
                id="username" name="username" type="text" required
                className="flex-1 bg-transparent px-3 py-3 text-sm focus:outline-none"
                placeholder="yourname"
                pattern="[a-zA-Z0-9-]+"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email" required autoComplete="email"
              className="rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password" required autoComplete="new-password" minLength={8}
              className="rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Min 8 characters"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="mt-2 bg-primary text-primary-foreground rounded-lg px-4 py-3 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create free account'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-foreground underline underline-offset-4">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
