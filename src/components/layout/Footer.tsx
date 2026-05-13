'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'

export function Footer() {
  const locale = useLocale()
  const isEs = locale === 'es'

  return (
    <footer className="border-t border-warm-border bg-stone mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold text-forest tracking-tight">Lokales</span>
            <p className="text-sm text-ink-muted leading-relaxed mt-3 max-w-[200px]">
              {isEs
                ? 'Espacios comerciales en centros de toda España.'
                : 'Retail spaces in shopping centers across Spain.'}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-4">
              {isEs ? 'Descubrir' : 'Discover'}
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href={`/${locale}/search`} className="text-ink-muted hover:text-ink transition-colors">{isEs ? 'Buscar espacios' : 'Search spaces'}</Link></li>
              <li><Link href={`/${locale}/search?type=popup`} className="text-ink-muted hover:text-ink transition-colors">Pop-ups</Link></li>
              <li><Link href={`/${locale}/search?type=marketing`} className="text-ink-muted hover:text-ink transition-colors">Marketing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-4">
              {isEs ? 'Propietarios' : 'Listers'}
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href={`/${locale}/listings/new`} className="text-ink-muted hover:text-ink transition-colors">{isEs ? 'Publicar espacio' : 'List a space'}</Link></li>
              <li><Link href={`/${locale}/dashboard`} className="text-ink-muted hover:text-ink transition-colors">{isEs ? 'Mi panel' : 'My dashboard'}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href={`/${locale}/privacy`} className="text-ink-muted hover:text-ink transition-colors">{isEs ? 'Privacidad' : 'Privacy'}</Link></li>
              <li><Link href={`/${locale}/terms`} className="text-ink-muted hover:text-ink transition-colors">{isEs ? 'Términos' : 'Terms'}</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-warm-border mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-ink-subtle">
            © {new Date().getFullYear()} Lokales. {isEs ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
          <p className="text-xs text-ink-subtle">
            {isEs ? 'Hecho con' : 'Made with'} ♥ {isEs ? 'en España' : 'in Spain'}
          </p>
        </div>
      </div>
    </footer>
  )
}
