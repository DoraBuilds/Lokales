'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

function inputCls(hasError = false) {
  return `w-full px-4 py-3 rounded-xl border ${
    hasError ? 'border-red-400' : 'border-warm-border focus:border-forest/50 focus:ring-forest/10'
  } bg-white text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 transition-colors text-sm`
}

const SUBJECTS_EN = ['General question', 'Listing a space', 'Finding a space', 'Press inquiry', 'Other']
const SUBJECTS_ES = ['Pregunta general', 'Publicar un espacio', 'Buscar un espacio', 'Consulta de prensa', 'Otro']

export function ContactForm({ locale }: { locale: string }) {
  const isEs = locale === 'es'
  const subjects = isEs ? SUBJECTS_ES : SUBJECTS_EN

  const [form, setForm] = useState({ name: '', email: '', subject: subjects[0], message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  function set(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }))
    setErrors((p) => { const e = { ...p }; delete e[field]; return e })
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim())    e.name    = isEs ? 'Requerido' : 'Required'
    if (!form.email.trim())   e.email   = isEs ? 'Requerido' : 'Required'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = isEs ? 'Email no válido' : 'Invalid email'
    if (!form.message.trim()) e.message = isEs ? 'Requerido' : 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    // For now: simulate send. Wire to Resend/email later.
    await new Promise((r) => setTimeout(r, 800))
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-forest" />
        <p className="font-semibold text-ink text-lg">
          {isEs ? '¡Mensaje enviado!' : 'Message sent!'}
        </p>
        <p className="text-sm text-ink-muted">
          {isEs ? 'Te responderemos en menos de 24 horas.' : "We'll reply within 24 hours."}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <input className={inputCls(!!errors.name)} placeholder={isEs ? 'Tu nombre' : 'Your name'}
            value={form.name} onChange={(e) => set('name', e.target.value)} />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <input type="email" className={inputCls(!!errors.email)} placeholder={isEs ? 'Tu email' : 'Your email'}
            value={form.email} onChange={(e) => set('email', e.target.value)} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
      </div>

      <select className={inputCls()} value={form.subject} onChange={(e) => set('subject', e.target.value)}>
        {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <div>
        <textarea className={`${inputCls(!!errors.message)} resize-none`} rows={5}
          placeholder={isEs ? 'Tu mensaje…' : 'Your message…'}
          value={form.message} onChange={(e) => set('message', e.target.value)} />
        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
      </div>

      <button type="submit" disabled={submitting}
        className="w-full bg-forest hover:bg-forest-mid disabled:opacity-60 text-white font-semibold rounded-full py-3 text-sm transition-colors">
        {submitting ? (isEs ? 'Enviando…' : 'Sending…') : (isEs ? 'Enviar mensaje' : 'Send message')}
      </button>
    </form>
  )
}
