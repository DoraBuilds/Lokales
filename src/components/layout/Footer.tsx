'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { NewsletterSignup } from './NewsletterSignup'

export function Footer() {
  const locale = useLocale()
  const isEs = locale === 'es'

  return (
    <footer className="border-t border-warm-border bg-stone mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">

        {/* Newsletter banner */}
        <div className="bg-white rounded-3xl border border-warm-border px-8 py-8 mb-14 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-forest mb-1">
              {isEs ? 'Boletín' : 'Newsletter'}
            </p>
            <h3 className="text-lg font-bold text-ink">
              {isEs
                ? 'Nuevos espacios, cada semana'
                : 'New spaces, every week'}
            </h3>
          </div>
          <div className="w-full md:w-96 flex-shrink-0">
            <NewsletterSignup />
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href={`/${locale}`} className="text-xl font-bold text-forest tracking-tight">
              Lokales
            </Link>
            <p className="text-sm text-ink-muted leading-relaxed mt-3 max-w-[200px]">
              {isEs
                ? 'El marketplace de espacios comerciales en centros de España.'
                : 'The marketplace for retail spaces in Spanish shopping centers.'}
            </p>
          </div>

          {/* Discover */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-4">
              {isEs ? 'Buscar' : 'Discover'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${locale}/search`} className="text-ink-muted hover:text-ink transition-colors">{isEs ? 'Todos los espacios' : 'All spaces'}</Link></li>
              <li><Link href={`/${locale}/search?type=long_term`} className="text-ink-muted hover:text-ink transition-colors">{isEs ? 'Largo plazo' : 'Long-term'}</Link></li>
              <li><Link href={`/${locale}/search?type=popup`} className="text-ink-muted hover:text-ink transition-colors">Pop-ups</Link></li>
              <li><Link href={`/${locale}/search?type=marketing`} className="text-ink-muted hover:text-ink transition-colors">Marketing</Link></li>
              <li><Link href={`/${locale}/search?q=Madrid`} className="text-ink-muted hover:text-ink transition-colors">Madrid</Link></li>
              <li><Link href={`/${locale}/search?q=Barcelona`} className="text-ink-muted hover:text-ink transition-colors">Barcelona</Link></li>
              <li><Link href={`/${locale}/search?q=Valencia`} className="text-ink-muted hover:text-ink transition-colors">Valencia</Link></li>
            </ul>
          </div>

          {/* Owners */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-4">
              {isEs ? 'Propietarios' : 'For owners'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${locale}/listings/new`} className="text-ink-muted hover:text-ink transition-colors">{isEs ? 'Publicar espacio' : 'List a space'}</Link></li>
              <li><Link href={`/${locale}/dashboard`} className="text-ink-muted hover:text-ink transition-colors">{isEs ? 'Mi panel' : 'My dashboard'}</Link></li>
              <li><Link href={`/${locale}/faq#owners`} className="text-ink-muted hover:text-ink transition-colors">{isEs ? 'Cómo funciona' : 'How it works'}</Link></li>
              <li><Link href={`/${locale}/contact`} className="text-ink-muted hover:text-ink transition-colors">{isEs ? 'Contacto' : 'Contact us'}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-4">
              {isEs ? 'Empresa' : 'Company'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${locale}/about`} className="text-ink-muted hover:text-ink transition-colors">{isEs ? 'Quiénes somos' : 'About us'}</Link></li>
              <li><Link href={`/${locale}/blog`} className="text-ink-muted hover:text-ink transition-colors">Blog</Link></li>
              <li><Link href={`/${locale}/contact`} className="text-ink-muted hover:text-ink transition-colors">{isEs ? 'Prensa' : 'Press'}</Link></li>
            </ul>
          </div>

          {/* Help / Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-4">
              {isEs ? 'Ayuda y legal' : 'Help & legal'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${locale}/faq`} className="text-ink-muted hover:text-ink transition-colors">FAQs</Link></li>
              <li><Link href={`/${locale}/contact`} className="text-ink-muted hover:text-ink transition-colors">{isEs ? 'Contacto' : 'Contact'}</Link></li>
              <li><Link href={`/${locale}/privacy`} className="text-ink-muted hover:text-ink transition-colors">{isEs ? 'Privacidad' : 'Privacy'}</Link></li>
              <li><Link href={`/${locale}/cookies`} className="text-ink-muted hover:text-ink transition-colors">Cookies</Link></li>
              <li><Link href={`/${locale}/terms`} className="text-ink-muted hover:text-ink transition-colors">{isEs ? 'Términos' : 'Terms'}</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-warm-border mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-ink-subtle">
            © {new Date().getFullYear()} Lokales. {isEs ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
          <p className="text-xs text-ink-subtle">
            {isEs ? 'Hecho con ♥ en España' : 'Made with ♥ in Spain'}
          </p>
        </div>
      </div>
    </footer>
  )
}
