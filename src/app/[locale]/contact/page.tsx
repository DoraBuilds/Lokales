import { StaticPage } from '@/components/layout/StaticPage'
import { ContactForm } from '@/components/contact/ContactForm'
import { Mail, MessageSquare } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: locale === 'es' ? 'Contacto — Lokales' : 'Contact — Lokales',
    description: locale === 'es'
      ? 'Escríbenos para cualquier consulta sobre Lokales.'
      : 'Reach out for any questions about Lokales.',
  }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isEs = locale === 'es'

  return (
    <StaticPage
      title={isEs ? 'Contacto' : 'Contact us'}
      subtitle={isEs
        ? 'Estamos aquí para ayudarte. Escríbenos y te respondemos en 24 horas.'
        : 'We\'re here to help. Write to us and we\'ll reply within 24 hours.'}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

        {/* Contact info */}
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-forest-light flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mail className="h-4 w-4 text-forest" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink mb-0.5">Email</p>
              <a href="mailto:hola@lokales.es" className="text-sm text-forest hover:underline">
                hola@lokales.es
              </a>
              <p className="text-xs text-ink-muted mt-1">
                {isEs ? 'Respuesta en menos de 24h' : 'Reply within 24h'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-forest-light flex items-center justify-center flex-shrink-0 mt-0.5">
              <MessageSquare className="h-4 w-4 text-forest" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink mb-0.5">
                {isEs ? 'Prensa' : 'Press'}
              </p>
              <a href="mailto:press@lokales.es" className="text-sm text-forest hover:underline">
                press@lokales.es
              </a>
            </div>
          </div>

          <div className="bg-stone rounded-2xl p-4 text-sm text-ink-muted leading-relaxed">
            {isEs
              ? 'Para consultas sobre espacios específicos, usa el formulario de contacto dentro de cada anuncio. Así el propietario recibe tu mensaje directamente.'
              : 'For inquiries about specific spaces, use the contact form within each listing. That way the owner receives your message directly.'}
          </div>
        </div>

        {/* Form */}
        <div className="sm:col-span-2">
          <ContactForm locale={locale} />
        </div>

      </div>
    </StaticPage>
  )
}
