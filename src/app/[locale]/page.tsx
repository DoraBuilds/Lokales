import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Search, ArrowRight, Building2, Calendar, Megaphone, MapPin } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { LinkButton } from '@/components/ui/link-button'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return { title: `Lokales — ${t('hero.title')}` }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const isEs = locale === 'es'

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-forest-light text-forest text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            {isEs ? 'España · Próximamente Europa' : 'Spain · Coming to Europe'}
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-ink leading-[1.05] tracking-tight mb-5">
            {isEs ? (
              <>El espacio para<br /><span className="text-forest">tu marca.</span></>
            ) : (
              <>The space for<br /><span className="text-forest">your brand.</span></>
            )}
          </h1>
          <p className="text-lg text-ink-muted max-w-xl mx-auto mb-10 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Airbnb-style unified search bar */}
          <form
            action={`/${locale}/search`}
            method="GET"
            className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl sm:rounded-full shadow-lg border border-warm-border overflow-hidden max-w-2xl mx-auto"
          >
            <div className="flex-1 flex items-center gap-3 px-5 py-3.5 sm:border-r border-warm-border">
              <MapPin className="h-4 w-4 text-ink-subtle flex-shrink-0" />
              <div className="text-left min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-subtle">
                  {isEs ? 'Ciudad o centro' : 'City or mall'}
                </p>
                <input
                  name="q"
                  placeholder={isEs ? 'Madrid, El Corte Inglés...' : 'Barcelona, La Maquinista...'}
                  className="w-full text-sm text-ink bg-transparent outline-none placeholder:text-ink-subtle font-medium"
                />
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center gap-3 px-5 py-3.5 sm:border-r border-warm-border">
              <div className="text-left">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-subtle">
                  {isEs ? 'Tipo' : 'Type'}
                </p>
                <select
                  name="type"
                  className="text-sm text-ink bg-transparent outline-none font-medium cursor-pointer appearance-none"
                >
                  <option value="">{isEs ? 'Todos' : 'All types'}</option>
                  <option value="long_term">{isEs ? 'Largo plazo' : 'Long-term'}</option>
                  <option value="popup">Pop-up</option>
                  <option value="marketing">{isEs ? 'Marketing' : 'Marketing'}</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-forest hover:bg-forest-mid text-white font-semibold text-sm px-7 py-4 sm:py-0 sm:m-1.5 sm:rounded-full transition-colors flex-shrink-0"
            >
              <Search className="h-4 w-4" />
              {t('hero.searchButton')}
            </button>
          </form>

          {/* Quick city links */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Málaga'].map((city) => (
              <Link
                key={city}
                href={`/${locale}/search?q=${city}`}
                className="text-xs text-ink-muted hover:text-ink bg-white border border-warm-border hover:border-forest/30 px-3 py-1.5 rounded-full transition-all"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Three rental types ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle text-center mb-3">
            {isEs ? 'Cómo funciona' : 'How it works'}
          </p>
          <h2 className="text-3xl font-bold text-ink text-center mb-10">
            {t('rentalTypes.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Long-term */}
            <Link
              href={`/${locale}/search?type=long_term`}
              className="group relative bg-white rounded-3xl p-7 border border-warm-border hover:border-forest/30 hover:shadow-md transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-forest-light rounded-full -translate-y-12 translate-x-12 opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-forest-light flex items-center justify-center mb-5">
                  <Building2 className="h-5 w-5 text-forest" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-2">{t('rentalTypes.longTerm.title')}</h3>
                <p className="text-sm text-ink-muted leading-relaxed mb-5">{t('rentalTypes.longTerm.desc')}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-forest">
                  {tCommon('learnMore')} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>

            {/* Pop-up */}
            <Link
              href={`/${locale}/search?type=popup`}
              className="group relative bg-white rounded-3xl p-7 border border-warm-border hover:border-purple-brand/30 hover:shadow-md transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-soft rounded-full -translate-y-12 translate-x-12 opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-purple-soft flex items-center justify-center mb-5">
                  <Calendar className="h-5 w-5 text-purple-brand" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-2">{t('rentalTypes.popup.title')}</h3>
                <p className="text-sm text-ink-muted leading-relaxed mb-5">{t('rentalTypes.popup.desc')}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-purple-brand">
                  {tCommon('learnMore')} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>

            {/* Marketing */}
            <Link
              href={`/${locale}/search?type=marketing`}
              className="group relative bg-white rounded-3xl p-7 border border-warm-border hover:border-amber-brand/30 hover:shadow-md transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-soft rounded-full -translate-y-12 translate-x-12 opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-amber-soft flex items-center justify-center mb-5">
                  <Megaphone className="h-5 w-5 text-amber-brand" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-2">{t('rentalTypes.marketing.title')}</h3>
                <p className="text-sm text-ink-muted leading-relaxed mb-5">{t('rentalTypes.marketing.desc')}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-brand">
                  {tCommon('learnMore')} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-stone">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { number: '500+', label: isEs ? 'Espacios disponibles' : 'Available spaces' },
            { number: '120+', label: isEs ? 'Centros comerciales' : 'Shopping centers' },
            { number: '3', label: isEs ? 'Formas de alquilar' : 'Ways to rent' },
          ].map(({ number, label }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-forest">{number}</p>
              <p className="text-xs text-ink-muted mt-1 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Lister CTA ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-forest rounded-3xl overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-forest-mid rounded-full opacity-40" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-forest-mid rounded-full opacity-30" />
            <div className="relative px-10 py-14 md:px-16 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p className="text-forest-light text-xs font-semibold uppercase tracking-widest mb-3">
                  {isEs ? 'Para propietarios' : 'For space owners'}
                </p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                  {isEs ? '¿Tienes un espacio vacío?' : 'Have an empty space?'}
                </h2>
                <p className="text-forest-light/80 max-w-md leading-relaxed">
                  {isEs
                    ? 'Publica tu local y conecta con marcas que buscan exactamente lo que ofreces. Gratis para empezar.'
                    : 'List your space and connect with brands looking for exactly what you offer. Free to get started.'}
                </p>
              </div>
              <LinkButton
                href={`/${locale}/listings/new`}
                className="flex-shrink-0 bg-white text-forest hover:bg-cream font-bold px-8 py-3 rounded-full text-sm shadow-md inline-flex items-center gap-2 whitespace-nowrap"
              >
                {isEs ? 'Publicar mi espacio' : 'List my space'}
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
