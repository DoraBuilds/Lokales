'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Cookie } from 'lucide-react'

const STORAGE_KEY = 'lokales-cookie-consent'

export function CookieBanner() {
  const locale = useLocale()
  const isEs = locale === 'es'
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only show if the user hasn't already consented
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto bg-ink text-white rounded-2xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
          <Cookie className="h-5 w-5 text-white" />
        </div>
        <p className="flex-1 text-sm text-white/80 leading-relaxed">
          {isEs
            ? <>Usamos cookies esenciales para que la plataforma funcione. Sin ellas no podemos garantizar tu sesión de usuario. <Link href={`/${locale}/cookies`} className="text-white underline hover:no-underline">Política de cookies</Link>.</>
            : <>We use essential cookies to keep the platform running. Without them we cannot maintain your user session. <Link href={`/${locale}/cookies`} className="text-white underline hover:no-underline">Cookie policy</Link>.</>
          }
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={decline}
            className="text-sm font-medium text-white/60 hover:text-white px-3 py-2 rounded-xl transition-colors"
          >
            {isEs ? 'Rechazar' : 'Decline'}
          </button>
          <button
            onClick={accept}
            className="text-sm font-semibold bg-forest hover:bg-forest-mid text-white px-4 py-2 rounded-xl transition-colors"
          >
            {isEs ? 'Aceptar' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  )
}
