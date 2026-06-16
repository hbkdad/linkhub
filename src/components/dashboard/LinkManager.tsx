'use client'

import { createLink, deleteLink, updateLink, reorderLinks } from '@/lib/actions/links'
import type { Link } from '@/types/database'
import { useState } from 'react'

const KINDS = [
  { value: 'link', label: '🔗 Link' },
  { value: 'cta', label: '🚀 CTA Button' },
  { value: 'product', label: '🛍 Product' },
  { value: 'social', label: '📱 Social' },
  { value: 'email', label: '📧 Email' },
]

export default function LinkManager({ links: initialLinks }: { links: Link[] }) {
  const [links, setLinks] = useState(initialLinks)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)
    await createLink(fd)
    ;(e.target as HTMLFormElement).reset()
    setAdding(false)
    setSaving(false)
    window.location.reload()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this link?')) return
    setLinks(l => l.filter(x => x.id !== id))
    await deleteLink(id)
  }

  async function handleToggle(link: Link) {
    setLinks(l => l.map(x => x.id === link.id ? { ...x, is_active: !x.is_active } : x))
    const fd = new FormData()
    fd.set('title', link.title)
    fd.set('url', link.url)
    fd.set('kind', link.kind)
    fd.set('is_active', (!link.is_active).toString())
    await updateLink(link.id, fd)
  }

  function handleDragStart(id: string) { setDragId(id) }
  function handleDragOver(e: React.DragEvent, id: string) { e.preventDefault(); setOverId(id) }

  async function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) { setDragId(null); setOverId(null); return }
    const from = links.findIndex(l => l.id === dragId)
    const to = links.findIndex(l => l.id === targetId)
    const reordered = [...links]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    setLinks(reordered)
    setDragId(null)
    setOverId(null)
    await reorderLinks(reordered.map(l => l.id))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Link list */}
      <div className="flex flex-col gap-2">
        {links.map(link => (
          <div
            key={link.id}
            draggable
            onDragStart={() => handleDragStart(link.id)}
            onDragOver={e => handleDragOver(e, link.id)}
            onDrop={() => handleDrop(link.id)}
            className={`bg-card border rounded-xl p-4 flex items-center gap-3 cursor-grab transition-all ${
              overId === link.id ? 'border-primary ring-2 ring-primary/30' : 'border-border'
            } ${!link.is_active ? 'opacity-50' : ''}`}
          >
            <span className="text-muted-foreground select-none">⠿</span>
            <div className="flex-1 min-w-0">
              {editingId === link.id ? (
                <EditLinkForm link={link} onDone={() => setEditingId(null)} />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{link.title}</span>
                    <span className="text-xs text-muted-foreground">{KINDS.find(k => k.value === link.kind)?.label ?? link.kind}</span>
                  </div>
                  <span className="text-xs text-muted-foreground truncate block">{link.url}</span>
                </>
              )}
            </div>
            {editingId !== link.id && (
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleToggle(link)} className="text-xs text-muted-foreground hover:text-foreground">
                  {link.is_active ? '👁' : '🙈'}
                </button>
                <button onClick={() => setEditingId(link.id)} className="text-xs text-muted-foreground hover:text-foreground">
                  ✏️
                </button>
                <button onClick={() => handleDelete(link.id)} className="text-xs text-destructive hover:opacity-80">
                  🗑
                </button>
              </div>
            )}
          </div>
        ))}

        {links.length === 0 && !adding && (
          <div className="text-center text-muted-foreground py-12 border border-dashed border-border rounded-xl">
            No links yet. Add your first one below.
          </div>
        )}
      </div>

      {/* Add form */}
      {adding ? (
        <form onSubmit={handleAdd} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
          <h3 className="font-medium text-sm">New link</h3>
          <input name="title" required placeholder="Title" className="input" />
          <input name="url" required type="url" placeholder="https://..." className="input" />
          <select name="kind" className="input">
            {KINDS.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
          </select>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50">
              {saving ? 'Adding…' : 'Add link'}
            </button>
            <button type="button" onClick={() => setAdding(false)} className="text-sm text-muted-foreground hover:text-foreground px-4 py-2">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="border border-dashed border-border rounded-xl px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
        >
          + Add link
        </button>
      )}

      <style>{`.input { @apply w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring; }`}</style>
    </div>
  )
}

function EditLinkForm({ link, onDone }: { link: Link; onDone: () => void }) {
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    await updateLink(link.id, new FormData(e.currentTarget))
    setSaving(false)
    onDone()
    window.location.reload()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input name="title" defaultValue={link.title} required className="input text-xs" />
      <input name="url" defaultValue={link.url} required type="url" className="input text-xs" />
      <input type="hidden" name="kind" value={link.kind} />
      <input type="hidden" name="is_active" value={link.is_active.toString()} />
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="bg-primary text-primary-foreground rounded px-3 py-1.5 text-xs font-medium">
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button type="button" onClick={onDone} className="text-xs text-muted-foreground">Cancel</button>
      </div>
      <style>{`.input { @apply w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring; }`}</style>
    </form>
  )
}
