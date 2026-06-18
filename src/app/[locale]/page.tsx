import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Building2, Calendar, Megaphone } from 'lucide-react'
import { NavbarServer } from '@/components/layout/NavbarServer'
import { Footer } from '@/components/layout/Footer'
import { LinkButton } from '@/components/ui/link-button'
import { ListingCard } from '@/components/listings/ListingCard'
import { HeroSearch } from '@/components/search/HeroSearch'
import type { Listing } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return { title: `Lokales — ${t('hero.title')}` }
}

const MOCK_LISTINGS: Listing[] = [
  {
    id: 'mock-1',
    shopping_center_id: 'sc-1',
    lister_id: 'user-1',
    title: 'Espacio Premium — Planta Baja',
    description: 'Espacio diáfano de gran visibilidad en la planta principal del centro.',
    size_sqm: 120,
    floor_level: 'ground',
    rental_types: ['long_term'],
    price_monthly: 4500,
    available_from: '2026-06-01',
    status: 'active',
    images: ['/Assets/korie-cull-IzIME1jwjCY-unsplash.jpg'],
    amenities: ['electricity', 'wifi', 'airConditioning', 'security'],
    created_at: '2026-05-01T00:00:00Z',
    updated_at: '2026-05-01T00:00:00Z',
    shopping_center: {
      id: 'sc-1',
      name: 'El Corte Inglés Castellana',
      city: 'Madrid',
      address: 'Paseo de la Castellana, 79',
      province: 'Madrid',
      postal_code: '28046',
      country: 'ES',
      lat: 40.4378,
      lng: -3.6898,
      images: [],
      created_by: 'system',
      created_at: '2026-01-01T00:00:00Z',
    },
  },
  {
    id: 'mock-2',
    shopping_center_id: 'sc-2',
    lister_id: 'user-1',
    title: 'Stand de Marketing — Zona Central',
    description: 'Ubicación estratégica en el pasillo central con altísimo tráfico peatonal.',
    size_sqm: 25,
    floor_level: 'ground',
    rental_types: ['marketing'],
    price_daily_marketing: 180,
    available_from: '2026-06-01',
    status: 'active',
    images: ['/Assets/philippe-bontemps-Wvh0KgE42mQ-unsplash.jpg'],
    amenities: ['electricity', 'wifi'],
    created_at: '2026-05-01T00:00:00Z',
    updated_at: '2026-05-01T00:00:00Z',
    shopping_center: {
      id: 'sc-2',
      name: 'La Maquinista',
      city: 'Barcelona',
      address: 'Carrer de Potosí, 2',
      province: 'Barcelona',
      postal_code: '08030',
      country: 'ES',
      lat: 41.4347,
      lng: 2.1963,
      images: [],
      created_by: 'system',
      created_at: '2026-01-01T00:00:00Z',
    },
  },
  {
    id: 'mock-3',
    shopping_center_id: 'sc-3',
    lister_id: 'user-1',
    title: 'Galería Boutique — Entrada Principal',
    description: 'Local con encanto en galería de lujo, perfecto para marcas lifestyle y moda.',
    size_sqm: 55,
    floor_level: 'ground',
    rental_types: ['popup'],
    price_daily_popup: 850,
    available_from: '2026-06-01',
    status: 'active',
    images: ['/Assets/charlesdeluvio-_4K7BwaHUGc-unsplash.jpg'],
    amenities: ['electricity', 'wifi', 'airConditioning', 'security', 'cctv'],
    created_at: '2026-05-01T00:00:00Z',
    updated_at: '2026-05-01T00:00:00Z',
    shopping_center: {
      id: 'sc-3',
      name: 'Aqua Multiespacio',
      city: 'Valencia',
      address: 'Av. de Napoleón Bonaparte, 47',
      province: 'Valencia',
      postal_code: '46011',
      country: 'ES',
      lat: 39.4529,
      lng: -0.3347,
      images: [],
      created_by: 'system',
      created_at: '2026-01-01T00:00:00Z',
    },
  },
  {
    id: 'mock-4',
    shopping_center_id: 'sc-4',
    lister_id: 'user-1',
    title: 'Local Comercial — Nivel 1',
    description: 'Amplio local en posición de esquina con doble escaparate y gran afluencia.',
    size_sqm: 85,
    floor_level: 'first',
    rental_types: ['long_term', 'popup'],
    price_monthly: 2800,
    price_daily_popup: 650,
    available_from: '2026-06-01',
    status: 'active',
    images: ['/Assets/gigstore-C1BryewCOq0-unsplash.jpg'],
    amenities: ['electricity', 'wifi', 'airConditioning', 'parking', 'elevator'],
    created_at: '2026-05-01T00:00:00Z',
    updated_at: '2026-05-01T00:00:00Z',
    shopping_center: {
      id: 'sc-4',
      name: 'Parquesur',
      city: 'Madrid',
      address: 'Av. de los Castillos, s/n',
      province: 'Madrid',
      postal_code: '28916',
      country: 'ES',
      lat: 40.3301,
      lng: -3.7852,
      images: [],
      created_by: 'system',
      created_at: '2026-01-01T00:00:00Z',
    },
  },
]

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const isEs = locale === 'es'

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <NavbarServer />

      {/* ── Hero — full-bleed image ── */}
      <section className="relative flex items-center justify-center min-h-[580px] px-4 sm:px-6 lg:px-8 overflow-hidden">
        <Image
          src="/Assets/3.jpg"
          alt="Shopping center interior"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-ink/55" />

        <div className="relative z-10 max-w-4xl w-full mx-auto text-center py-20">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4 drop-shadow-sm">
            {isEs
              ? <>Encuentra tu espacio<br /><span className="text-forest-light">perfecto.</span></>
              : <>Find your perfect<br /><span className="text-forest-light">space.</span></>
            }
          </h1>
          <p className="text-base text-white/80 max-w-xl mx-auto mb-7 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Search bar with autocomplete */}
          <HeroSearch locale={locale} searchButtonLabel={t('hero.searchButton')} />

          {/* Quick city links */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Málaga'].map((city) => (
              <Link
                key={city}
                href={`/${locale}/search?q=${city}`}
                className="text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-full transition-all backdrop-blur-sm"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured listings ── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-1">
                {isEs ? 'Selección del mes' : 'This month\'s picks'}
              </p>
              <h2 className="text-2xl font-bold text-ink">
                {isEs ? 'Espacios destacados' : 'Featured spaces'}
              </h2>
            </div>
            <Link
              href={`/${locale}/search`}
              className="text-sm font-semibold text-forest hover:underline hidden sm:flex items-center gap-1"
            >
              {isEs ? 'Ver todos' : 'View all'} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
            {MOCK_LISTINGS.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Three rental types ── */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-stone">
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
      <section className="py-10 px-4 sm:px-6 lg:px-8">
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
