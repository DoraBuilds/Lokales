'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Building2 } from 'lucide-react'

export function Footer() {
  const locale = useLocale()

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-lg text-blue-600 mb-3">
              <Building2 className="h-5 w-5" />
              <span>ShopSpace</span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed">
              {locale === 'es'
                ? 'La plataforma para espacios comerciales en centros comerciales de España.'
                : 'The platform for retail spaces in shopping centers across Spain.'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">
              {locale === 'es' ? 'Descubrir' : 'Discover'}
            </h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href={`/${locale}/search`} className="hover:text-zinc-900">{locale === 'es' ? 'Buscar espacios' : 'Search spaces'}</Link></li>
              <li><Link href={`/${locale}/search?type=popup`} className="hover:text-zinc-900">Pop-ups</Link></li>
              <li><Link href={`/${locale}/search?type=marketing`} className="hover:text-zinc-900">{locale === 'es' ? 'Marketing' : 'Marketing'}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">
              {locale === 'es' ? 'Propietarios' : 'Listers'}
            </h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href={`/${locale}/listings/new`} className="hover:text-zinc-900">{locale === 'es' ? 'Publicar espacio' : 'List a space'}</Link></li>
              <li><Link href={`/${locale}/dashboard`} className="hover:text-zinc-900">{locale === 'es' ? 'Mi panel' : 'My dashboard'}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">
              {locale === 'es' ? 'Legal' : 'Legal'}
            </h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href={`/${locale}/privacy`} className="hover:text-zinc-900">{locale === 'es' ? 'Privacidad' : 'Privacy'}</Link></li>
              <li><Link href={`/${locale}/terms`} className="hover:text-zinc-900">{locale === 'es' ? 'Términos' : 'Terms'}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-200 mt-10 pt-6 text-center text-xs text-zinc-400">
          © {new Date().getFullYear()} ShopSpace. {locale === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
        </div>
      </div>
    </footer>
  )
}
