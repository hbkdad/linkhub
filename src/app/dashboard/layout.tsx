import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '@/lib/actions/auth'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('slug, display_name').eq('id', user.id).single()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-xl tracking-tight">LinkHub</Link>
        <div className="flex items-center gap-4">
          {profile?.slug && (
            <Link
              href={`/u/${profile.slug}`}
              target="_blank"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View page ↗
            </Link>
          )}
          <form action={signOut}>
            <button type="submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 border-r border-border p-4 hidden md:flex flex-col gap-1">
          {[
            { href: '/dashboard', label: '👤 Profile' },
            { href: '/dashboard/links', label: '🔗 Links' },
            { href: '/dashboard/analytics', label: '📊 Analytics' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2.5 text-sm hover:bg-secondary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </aside>

        {/* Mobile bottom nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background flex">
          {[
            { href: '/dashboard', label: 'Profile', icon: '👤' },
            { href: '/dashboard/links', label: 'Links', icon: '🔗' },
            { href: '/dashboard/analytics', label: 'Analytics', icon: '📊' },
          ].map(item => (
            <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center py-3 gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <span>{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>

        <main className="flex-1 p-6 pb-24 md:pb-6 max-w-2xl">
          {children}
        </main>
      </div>
    </div>
  )
}
