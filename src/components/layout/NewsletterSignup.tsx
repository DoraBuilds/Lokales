'use client'

import { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import { subscribeNewsletter } from '@/lib/newsletter-actions'
import { useLocale } from 'next-intl'

export function NewsletterSignup() {
  const locale = useLocale()
  const isEs = locale === 'es'
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'already' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    const result = await subscribeNewsletter(email, locale)
    if (result.success)           setState('success')
    else if (result.alreadySubscribed) setState('already')
    else { setState('error'); setErrorMsg(result.error ?? '') }
  }

  if (state === 'success' || state === 'already') {
    return (
      <div className="flex items-center gap-3 text-sm text-forest">
        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
        <span className="font-medium">
          {state === 'already'
            ? (isEs ? '¡Ya estás suscrito!' : "You're already subscribed!")
            : (isEs ? '¡Gracias! Te avisaremos.' : 'Thanks! We\'ll keep you posted.')}
        </span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={isEs ? 'tu@email.com' : 'your@email.com'}
          className="flex-1 px-4 py-2.5 rounded-xl border border-warm-border bg-white text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-forest/10 focus:border-forest/50 transition-colors min-w-0"
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="flex items-center gap-1.5 bg-forest hover:bg-forest-mid disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors flex-shrink-0"
        >
          <Send className="h-3.5 w-3.5" />
          {isEs ? 'Suscribirme' : 'Subscribe'}
        </button>
      </div>
      {state === 'error' && (
        <p className="text-xs text-red-500">{errorMsg}</p>
      )}
      <p className="text-xs text-ink-subtle">
        {isEs
          ? 'Novedades de espacios, mercado retail y tendencias en España. Sin spam.'
          : 'New spaces, retail market news, and trends in Spain. No spam.'}
      </p>
    </form>
  )
}
