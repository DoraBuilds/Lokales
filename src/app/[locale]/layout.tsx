import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import '../globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Lokales — Retail Spaces in Shopping Centers',
  description: 'Discover and rent available spaces in shopping centers across Spain. Long-term leases, pop-ups, and marketing placements.'
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'es')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className={`${jakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-cream text-ink antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
