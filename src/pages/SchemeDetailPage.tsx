import { motion } from 'framer-motion'
import { ArrowLeft, Bookmark, Calendar, ExternalLink, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useBookmarks } from '@/contexts/BookmarkContext'
import { getSchemeBySlug } from '@/data/schemes'
import { cn } from '@/lib/utils'

export function SchemeDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, i18n } = useTranslation()
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const scheme = slug ? getSchemeBySlug(slug) : undefined
  const isHi = i18n.language === 'hi'

  if (!scheme) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Scheme not found</h1>
        <Link to="/schemes" className="mt-4 inline-block text-primary hover:underline">Back to schemes</Link>
      </div>
    )
  }

  const name = isHi ? scheme.nameHi : scheme.name
  const description = isHi ? scheme.descriptionHi : scheme.description
  const benefits = isHi ? scheme.benefitsHi : scheme.benefits
  const documents = isHi ? scheme.documentsHi : scheme.documents
  const bookmarked = isBookmarked(scheme.id)

  return (
    <section className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link to="/schemes" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to schemes
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge className="mb-3">{scheme.category}</Badge>
              <h1 className="text-3xl font-bold">{name}</h1>
              <p className="mt-2 text-muted-foreground">{scheme.ministry}</p>
            </div>
            <Button variant="outline" onClick={() => toggleBookmark(scheme.id)}>
              <Bookmark className={cn('h-4 w-4', bookmarked && 'fill-primary text-primary')} />
              {t('schemes.bookmark')}
            </Button>
          </div>

          <p className="mt-6 text-lg leading-relaxed">{description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={scheme.applyUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg">{t('schemes.apply')}</Button>
            </a>
            <a href={scheme.officialUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">
                <ExternalLink className="h-4 w-4" /> {t('schemes.official')}
              </Button>
            </a>
          </div>

          {scheme.deadline && (
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {t('schemes.deadline')}: {new Date(scheme.deadline).toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </div>
          )}

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" /> {t('schemes.benefits')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                      {b}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-accent" /> {t('schemes.documents')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {documents.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {d}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
