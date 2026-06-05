import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { schemes as defaultSchemes } from '@/data/schemes'
import type { Scheme } from '@/types'
import { useNotifications } from '@/contexts/NotificationContext'

const ADMIN_KEY = 'scheme-gov-admin-schemes'

export function AdminPage() {
  const { addNotification } = useNotifications()
  const [schemes, setSchemes] = useState<Scheme[]>(() => {
    try {
      const stored = localStorage.getItem(ADMIN_KEY)
      return stored ? JSON.parse(stored) as Scheme[] : defaultSchemes
    } catch {
      return defaultSchemes
    }
  })
  const [editing, setEditing] = useState<Scheme | null>(null)

  const saveSchemes = (updated: Scheme[]) => {
    setSchemes(updated)
    localStorage.setItem(ADMIN_KEY, JSON.stringify(updated))
    addNotification('Schemes Updated', 'Scheme data saved locally.', 'success')
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this scheme?')) {
      saveSchemes(schemes.filter((s) => s.id !== id))
    }
  }

  const handleSave = () => {
    if (!editing) return
    const exists = schemes.find((s) => s.id === editing.id)
    if (exists) {
      saveSchemes(schemes.map((s) => (s.id === editing.id ? editing : s)))
    } else {
      saveSchemes([...schemes, editing])
    }
    setEditing(null)
  }

  return (
    <>
      <PageHeader title="Admin Dashboard" subtitle="Manage government schemes (local demo mode)" />
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-6 flex justify-between">
            <p className="text-sm text-muted-foreground">{schemes.length} schemes loaded</p>
            <Button onClick={() => setEditing({
              id: crypto.randomUUID(),
              slug: 'new-scheme',
              name: 'New Scheme',
              nameHi: 'नई योजना',
              description: '',
              descriptionHi: '',
              category: 'Social Welfare',
              ministry: 'Ministry',
              benefits: [],
              benefitsHi: [],
              documents: [],
              documentsHi: [],
              officialUrl: '#',
              applyUrl: '#',
              rules: {},
              featured: false,
              popularity: 50,
            })}>
              Add Scheme
            </Button>
          </div>

          <div className="grid gap-4">
            {schemes.map((scheme) => (
              <Card key={scheme.id}>
                <CardContent className="flex items-center justify-between pt-6">
                  <div>
                    <p className="font-semibold">{scheme.name}</p>
                    <p className="text-sm text-muted-foreground">{scheme.category} · {scheme.ministry}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditing(scheme)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(scheme.id)}>Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {editing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <CardHeader><CardTitle>{editing.name}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Ministry</Label>
                    <Input value={editing.ministry} onChange={(e) => setEditing({ ...editing, ministry: e.target.value })} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>Save</Button>
                    <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
