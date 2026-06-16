import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ count: totalViews }, { data: linkClicks }, { data: links }] = await Promise.all([
    supabase.from('page_views').select('*', { count: 'exact', head: true }).eq('profile_id', user.id),
    supabase.from('link_clicks').select('link_id').eq('profile_id', user.id),
    supabase.from('links').select('id, title, url').eq('profile_id', user.id),
  ])

  // Count clicks per link
  const clickMap: Record<string, number> = {}
  linkClicks?.forEach(c => { clickMap[c.link_id] = (clickMap[c.link_id] ?? 0) + 1 })

  const topLinks = (links ?? [])
    .map(l => ({ ...l, clicks: clickMap[l.id] ?? 0 }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-3xl font-bold">{totalViews ?? 0}</div>
          <div className="text-sm text-muted-foreground mt-1">Total page views</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-3xl font-bold">{linkClicks?.length ?? 0}</div>
          <div className="text-sm text-muted-foreground mt-1">Total link clicks</div>
        </div>
      </div>

      {/* Top links */}
      <h2 className="font-semibold mb-3">Top links</h2>
      {topLinks.length === 0 ? (
        <p className="text-muted-foreground text-sm">No click data yet. Share your page to start tracking!</p>
      ) : (
        <div className="flex flex-col gap-2">
          {topLinks.map(link => (
            <div key={link.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">{link.title}</div>
                <div className="text-xs text-muted-foreground truncate">{link.url}</div>
              </div>
              <div className="shrink-0 ml-4 text-right">
                <div className="font-bold">{link.clicks}</div>
                <div className="text-xs text-muted-foreground">clicks</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
