'use client'

import type { Profile, Link } from '@/types/database'
import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import { recordClick } from '@/lib/actions/analytics'

interface Props {
  profile: Profile
  links: Link[]
}

const THEME_CLASSES: Record<string, { bg: string; card: string; text: string; btn: string }> = {
  'clean-dark': {
    bg: 'bg-zinc-950 text-zinc-50',
    card: 'bg-zinc-900 border-zinc-800',
    text: 'text-zinc-400',
    btn: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-50',
  },
  'clean-light': {
    bg: 'bg-white text-zinc-900',
    card: 'bg-zinc-50 border-zinc-200',
    text: 'text-zinc-500',
    btn: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900',
  },
  'neon': {
    bg: 'bg-violet-950 text-white',
    card: 'bg-violet-900/40 border-violet-700/50',
    text: 'text-violet-300',
    btn: 'bg-violet-600 hover:bg-violet-500 text-white',
  },
  'minimal': {
    bg: 'bg-stone-50 text-stone-900',
    card: 'bg-white border-stone-200',
    text: 'text-stone-500',
    btn: 'bg-stone-900 hover:bg-stone-800 text-white',
  },
}

export default function PublicProfile({ profile, links }: Props) {
  const [showQR, setShowQR] = useState(false)
  const theme = THEME_CLASSES[profile.theme] ?? THEME_CLASSES['clean-dark']
  const pageUrl = typeof window !== 'undefined'
    ? window.location.href
    : `https://linkhub.to/u/${profile.slug}`

  async function handleLinkClick(link: Link) {
    await recordClick(link.id, profile.id)
  }

  const ctas = links.filter(l => l.kind === 'cta')
  const regular = links.filter(l => l.kind !== 'cta')

  return (
    <div className={`min-h-screen ${theme.bg} flex flex-col items-center py-12 px-4`}>
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        {/* Avatar */}
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name ?? 'Avatar'}
            className="w-24 h-24 rounded-full object-cover border-2 border-white/20"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold">
            {(profile.display_name ?? profile.slug)?.[0]?.toUpperCase()}
          </div>
        )}

        {/* Name & bio */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">{profile.display_name ?? `@${profile.slug}`}</h1>
          {profile.headline && <p className="mt-1 font-medium">{profile.headline}</p>}
          {profile.bio && <p className={`mt-2 text-sm ${theme.text}`}>{profile.bio}</p>}
        </div>

        {/* CTA buttons */}
        {ctas.length > 0 && (
          <div className="w-full flex flex-col gap-2">
            {ctas.map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link)}
                className={`${theme.btn} rounded-xl px-6 py-4 text-center font-semibold transition-colors block`}
              >
                {link.title}
              </a>
            ))}
          </div>
        )}

        {/* Regular links */}
        {regular.length > 0 && (
          <div className="w-full flex flex-col gap-2">
            {regular.map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link)}
                className={`${theme.card} border rounded-xl px-5 py-3.5 flex items-center justify-between transition-opacity hover:opacity-80`}
              >
                <span className="font-medium text-sm">{link.title}</span>
                <span className={`text-xs ${theme.text}`}>↗</span>
              </a>
            ))}
          </div>
        )}

        {/* QR code toggle */}
        <button
          onClick={() => setShowQR(v => !v)}
          className={`${theme.text} text-sm flex items-center gap-2 hover:opacity-80 transition-opacity`}
        >
          📱 {showQR ? 'Hide' : 'Show'} QR code
        </button>

        {showQR && (
          <div className="bg-white p-4 rounded-2xl">
            <QRCodeSVG value={pageUrl} size={160} />
          </div>
        )}

        {/* Footer */}
        <p className={`text-xs ${theme.text} mt-4`}>
          Made with <a href="/" className="underline underline-offset-2">LinkHub</a>
        </p>
      </div>
    </div>
  )
}
