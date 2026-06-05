import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/PageHeader'
import { SchemeCard } from '@/components/schemes/SchemeCard'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { schemes } from '@/data/schemes'
import type { SchemeCategory } from '@/types'
import { useBookmarks } from '@/contexts/BookmarkContext'

const categories: (SchemeCategory | 'all')[] = [
  'all', 'Education', 'Health', 'Agriculture', 'Employment', 'Housing',
  'Women', 'Senior Citizen', 'Startup', 'Skill Development', 'Social Welfare',
]

export function SchemesPage() {
  const { t, i18n } = useTranslation()
  const { bookmarks } = useBookmarks()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [showSaved, setShowSaved] = useState(false)

  const filtered = useMemo(() => {
    return schemes.filter((s) => {
      const name = i18n.language === 'hi' ? s.nameHi : s.name
      const desc = i18n.language === 'hi' ? s.descriptionHi : s.description
      const matchesSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || desc.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'all' || s.category === category
      const matchesSaved = !showSaved || bookmarks.includes(s.id)
      return matchesSearch && matchesCategory && matchesSaved
    })
  }, [search, category, showSaved, bookmarks, i18n.language])

  return (
    <>
      <PageHeader title={t('schemes.title')} />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <Input
              placeholder={t('schemes.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-sm"
              aria-label={t('schemes.search')}
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c === 'all' ? t('schemes.all') : c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={showSaved} onChange={(e) => setShowSaved(e.target.checked)} />
              Saved only ({bookmarks.length})
            </label>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((scheme, i) => <SchemeCard key={scheme.id} scheme={scheme} index={i} />)}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No schemes found matching your filters.</p>
          )}
        </div>
      </section>
    </>
  )
}
