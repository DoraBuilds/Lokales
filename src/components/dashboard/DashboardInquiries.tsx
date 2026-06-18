'use client'

import { MessageSquare, Mail, Phone, Calendar } from 'lucide-react'

const TYPE_LABEL: Record<string, string> = {
  long_term: 'Long-term',
  popup:     'Pop-up',
  marketing: 'Marketing',
}

interface Inquiry {
  id: string
  sender_name: string
  sender_email: string
  sender_phone?: string
  rental_type: string
  message: string
  created_at: string
  status: string
  listing?: { id: string; title: string }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function DashboardInquiries({ inquiries, locale }: { inquiries: Inquiry[]; locale: string }) {
  const isEs = locale === 'es'

  if (inquiries.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-warm-border p-12 text-center">
        <div className="w-16 h-16 bg-forest-light rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="h-7 w-7 text-forest" />
        </div>
        <h2 className="text-xl font-bold text-ink mb-2">
          {isEs ? 'Sin consultas aún' : 'No inquiries yet'}
        </h2>
        <p className="text-sm text-ink-muted max-w-sm mx-auto">
          {isEs
            ? 'Cuando las marcas contacten con tus espacios, aparecerán aquí.'
            : 'When brands reach out about your spaces, they will appear here.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-5">
        {isEs
          ? `${inquiries.length} consulta${inquiries.length !== 1 ? 's' : ''} recibida${inquiries.length !== 1 ? 's' : ''}`
          : `${inquiries.length} inquir${inquiries.length !== 1 ? 'ies' : 'y'} received`}
      </p>

      {inquiries.map((inq) => (
        <div key={inq.id} className="bg-white rounded-3xl border border-warm-border p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="font-semibold text-ink">{inq.sender_name}</p>
              {inq.listing && (
                <p className="text-xs text-ink-muted mt-0.5">
                  {isEs ? 'Sobre: ' : 'About: '}
                  <a href={`/${locale}/listings/${inq.listing.id}?from=dashboard`} className="text-forest hover:underline">
                    {inq.listing.title}
                  </a>
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-forest-light text-forest">
                {TYPE_LABEL[inq.rental_type] ?? inq.rental_type}
              </span>
              <span className="flex items-center gap-1 text-xs text-ink-subtle">
                <Calendar className="h-3 w-3" />
                {formatDate(inq.created_at)}
              </span>
            </div>
          </div>

          <p className="text-sm text-ink leading-relaxed bg-stone rounded-2xl px-4 py-3 mb-4">
            &ldquo;{inq.message}&rdquo;
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a href={`mailto:${inq.sender_email}`}
              className="flex items-center gap-2 text-sm font-medium text-forest hover:underline">
              <Mail className="h-4 w-4" />
              {inq.sender_email}
            </a>
            {inq.sender_phone && (
              <a href={`tel:${inq.sender_phone}`}
                className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink">
                <Phone className="h-4 w-4" />
                {inq.sender_phone}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
