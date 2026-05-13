import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Building2, Calendar, Megaphone, Search, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { Input } from '@/components/ui/input'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return {
    title: `ShopSpace — ${t('hero.title')}`,
  }
}

function HeroSearchForm({ locale, placeholder, buttonText }: { locale: string; placeholder: string; buttonText: string }) {
  return (
    <form action={`/${locale}/search`} method="GET" className="flex gap-2 w-full max-w-xl">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input
          name="q"
          placeholder={placeholder}
          className="pl-10 h-12 text-sm border-zinc-300 bg-white"
        />
      </div>
      <Button type="submit" className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium">
        {buttonText}
      </Button>
    </form>
  )
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <HeroSearchForm
              locale={locale}
              placeholder={t('hero.searchPlaceholder')}
              buttonText={t('hero.searchButton')}
            />
          </div>
        </div>
      </section>

      {/* Three rental types */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-zinc-900 mb-10 text-center">
            {t('rentalTypes.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href={`/${locale}/search?type=long_term`}
              className="group p-6 rounded-2xl border border-zinc-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                {t('rentalTypes.longTerm.title')}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {t('rentalTypes.longTerm.desc')}
              </p>
              <div className="flex items-center gap-1 mt-4 text-sm font-medium text-blue-600">
                {tCommon('learnMore')} <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            <Link
              href={`/${locale}/search?type=popup`}
              className="group p-6 rounded-2xl border border-zinc-200 hover:border-amber-300 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                <Calendar className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                {t('rentalTypes.popup.title')}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {t('rentalTypes.popup.desc')}
              </p>
              <div className="flex items-center gap-1 mt-4 text-sm font-medium text-amber-600">
                {tCommon('learnMore')} <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            <Link
              href={`/${locale}/search?type=marketing`}
              className="group p-6 rounded-2xl border border-zinc-200 hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                <Megaphone className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                {t('rentalTypes.marketing.title')}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {t('rentalTypes.marketing.desc')}
              </p>
              <div className="flex items-center gap-1 mt-4 text-sm font-medium text-emerald-600">
                {tCommon('learnMore')} <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA for listers */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-3xl p-10 md:p-14 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {locale === 'es' ? '¿Tienes un espacio vacío?' : 'Have an empty space?'}
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              {locale === 'es'
                ? 'Lista tu espacio y conecta con marcas y emprendedores que buscan exactamente lo que ofreces.'
                : 'List your space and connect with brands and entrepreneurs looking for exactly what you offer.'}
            </p>
            <LinkButton
              href={`/${locale}/listings/new`}
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 inline-flex items-center gap-2"
            >
              {locale === 'es' ? 'Publicar mi espacio' : 'List my space'}
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
