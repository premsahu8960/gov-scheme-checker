import { PageHeader } from '@/components/layout/PageHeader'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqs = [
  { q: 'What is scheme.gov?', a: 'scheme.gov is a free platform that helps Indian citizens discover government schemes, scholarships, and welfare programs they are eligible for based on their personal profile.' },
  { q: 'How does the eligibility checker work?', a: 'You fill a multi-step form with your personal, social, economic, and educational details. Our engine matches your profile against scheme criteria and returns eligible and partially eligible schemes ranked by relevance.' },
  { q: 'Do I need to create an account?', a: 'No account is required to check eligibility. Your form draft is auto-saved locally. Optional accounts enable cloud sync of bookmarks and history via Supabase.' },
  { q: 'Are the scheme details up to date?', a: 'We source data from official government portals. However, deadlines and criteria may change. Always verify on the official website before applying.' },
  { q: 'Can I use the platform in Hindi?', a: 'Yes! Click the globe icon in the header to switch between English and Hindi. All major UI elements and scheme names are translated.' },
  { q: 'How do I download my eligibility report?', a: 'After checking eligibility, click "Download Report" on the results page to get a PDF with your profile summary and matched schemes.' },
  { q: 'Is voice input supported?', a: 'Yes, on supported browsers you can use the microphone button on the name field to enter your name via voice in English or Hindi.' },
  { q: 'How do bookmarks work?', a: 'Click the bookmark icon on any scheme card to save it. Bookmarks are stored in your browser local storage and can be filtered on the Schemes page.' },
]

export function FAQPage() {
  return (
    <>
      <PageHeader title="Frequently Asked Questions" subtitle="Everything you need to know about scheme.gov" />
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  )
}
