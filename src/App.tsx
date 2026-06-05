import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Skeleton } from '@/components/ui/skeleton'
import { BookmarkProvider } from '@/contexts/BookmarkContext'
import { EligibilityProvider } from '@/contexts/EligibilityContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const CheckEligibilityPage = lazy(() => import('@/pages/CheckEligibilityPage').then((m) => ({ default: m.CheckEligibilityPage })))
const ResultsPage = lazy(() => import('@/pages/ResultsPage').then((m) => ({ default: m.ResultsPage })))
const SchemesPage = lazy(() => import('@/pages/SchemesPage').then((m) => ({ default: m.SchemesPage })))
const SchemeDetailPage = lazy(() => import('@/pages/SchemeDetailPage').then((m) => ({ default: m.SchemeDetailPage })))
const AboutPage = lazy(() => import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const ContactPage = lazy(() => import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage })))
const FAQPage = lazy(() => import('@/pages/FAQPage').then((m) => ({ default: m.FAQPage })))
const AdminPage = lazy(() => import('@/pages/AdminPage').then((m) => ({ default: m.AdminPage })))

function PageLoader() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <BookmarkProvider>
          <EligibilityProvider>
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="check-eligibility" element={<CheckEligibilityPage />} />
                    <Route path="results" element={<ResultsPage />} />
                    <Route path="schemes" element={<SchemesPage />} />
                    <Route path="schemes/:slug" element={<SchemeDetailPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="faq" element={<FAQPage />} />
                    <Route path="admin" element={<AdminPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </EligibilityProvider>
        </BookmarkProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}

export default App
