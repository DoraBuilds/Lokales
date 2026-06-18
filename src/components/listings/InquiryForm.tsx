'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { createInquiry } from '@/lib/inquiry-actions'

const TYPE_LABEL: Record<string, string> = {
  long_term: 'Long-term lease',
  popup:     'Pop-up / Event',
  marketing: 'Marketing placement',
}

function inputCls(hasError = false) {
  return `w-full px-4 py-3 rounded-xl border ${
    hasError
      ? 'border-red-400 focus:ring-red-200'
      : 'border-warm-border focus:border-forest/50 focus:ring-forest/10'
  } bg-white text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 transition-colors text-sm`
}

export function InquiryForm({
  listingId,
  rentalTypes,
  locale,
}: {
  listingId: string
  rentalTypes: string[]
  locale: string
}) {
  const isEs = locale === 'es'
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    rentalType: rentalTypes[0] ?? 'long_term',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e })
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!form.name.trim())    e.name    = isEs ? 'Requerido' : 'Required'
    if (!form.email.trim())   e.email   = isEs ? 'Requerido' : 'Required'
    if (!form.message.trim()) e.message = isEs ? 'Requerido' : 'Required'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = isEs ? 'Email no válido' : 'Invalid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setSubmitError(null)
    const result = await createInquiry({
      listingId,
      senderName:  form.name,
      senderEmail: form.email,
      senderPhone: form.phone,
      rentalType:  form.rentalType,
      message:     form.message,
    })
    if (result.error) {
      setSubmitError(result.error)
      setSubmitting(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-forest" />
        <p className="font-semibold text-ink">
          {isEs ? '¡Consulta enviada!' : 'Inquiry sent!'}
        </p>
        <p className="text-sm text-ink-muted">
          {isEs
            ? 'El propietario te responderá en menos de 24 horas.'
            : 'The owner will reply within 24 hours.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          className={inputCls(!!errors.name)}
          placeholder={isEs ? 'Tu nombre' : 'Your name'}
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <input
          type="email"
          className={inputCls(!!errors.email)}
          placeholder={isEs ? 'Tu email' : 'Your email'}
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>

      <input
        type="tel"
        className={inputCls()}
        placeholder={isEs ? 'Teléfono (opcional)' : 'Phone (optional)'}
        value={form.phone}
        onChange={(e) => set('phone', e.target.value)}
      />

      {rentalTypes.length > 1 && (
        <select
          className={inputCls()}
          value={form.rentalType}
          onChange={(e) => set('rentalType', e.target.value)}
        >
          {rentalTypes.map((t) => (
            <option key={t} value={t}>{TYPE_LABEL[t] ?? t}</option>
          ))}
        </select>
      )}

      <div>
        <textarea
          className={`${inputCls(!!errors.message)} resize-none`}
          rows={3}
          placeholder={isEs
            ? 'Cuéntanos qué estás buscando…'
            : 'Tell us what you are looking for…'}
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
        />
        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
      </div>

      {submitError && (
        <p className="text-xs text-red-500 rounded-xl bg-red-50 border border-red-200 px-3 py-2">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-forest hover:bg-forest-mid disabled:opacity-60 text-white font-semibold rounded-full py-3 text-sm transition-colors"
      >
        {submitting
          ? (isEs ? 'Enviando…' : 'Sending…')
          : (isEs ? 'Solicitar información' : 'Request information')}
      </button>

      <p className="text-center text-xs text-ink-subtle">
        {isEs ? 'Sin compromiso · Respuesta en 24h' : 'No commitment · Reply within 24h'}
      </p>
    </form>
  )
}
