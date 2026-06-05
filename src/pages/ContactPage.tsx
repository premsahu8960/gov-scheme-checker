import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, MapPin, Phone } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useNotifications } from '@/contexts/NotificationContext'

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
})

type ContactForm = z.infer<typeof contactSchema>

export function ContactPage() {
  const { addNotification } = useNotifications()
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = handleSubmit((data) => {
    console.log('Contact form:', data)
    addNotification('Message Sent', 'We will get back to you within 48 hours.', 'success')
    reset()
  })

  return (
    <>
      <PageHeader title="Contact Us" subtitle="Have questions? We'd love to hear from you." />
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4">
              {[
                { icon: Mail, label: 'Email', value: 'support@scheme.gov.in' },
                { icon: Phone, label: 'Helpline', value: '1800-XXX-XXXX' },
                { icon: MapPin, label: 'Address', value: 'New Delhi, India' },
              ].map((item) => (
                <Card key={item.label}>
                  <CardContent className="flex items-center gap-4 pt-6">
                    <item.icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="lg:col-span-2">
              <CardContent className="pt-6">
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" {...register('name')} />
                      {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" {...register('email')} />
                      {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" {...register('subject')} />
                    {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      {...register('message')}
                      rows={5}
                      className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" disabled={isSubmitting}>Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
