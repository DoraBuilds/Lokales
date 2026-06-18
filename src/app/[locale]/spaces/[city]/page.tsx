import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { NavbarServer } from '@/components/layout/NavbarServer'
import { Footer } from '@/components/layout/Footer'
import { ListingCard } from '@/components/listings/ListingCard'
import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import type { Listing } from '@/types'

// Cities we generate pages for — drives both static params and content
const CITIES: Record<string, {
  name: string
  nameEs: string
  province: string
  desc: string
  descEs: string
  population: string
}> = {
  madrid: {
    name: 'Madrid', nameEs: 'Madrid', province: 'Madrid',
    desc: 'Spain\'s capital and largest retail market. Home to iconic shopping centers with some of the highest footfall figures in the country.',
    descEs: 'Capital de España y mayor mercado retail del país. Alberga centros comerciales icónicos con algunas de las mayores cifras de afluencia.',
    population: '3.3M',
  },
  barcelona: {
    name: 'Barcelona', nameEs: 'Barcelona', province: 'Barcelona',
    desc: 'Spain\'s second city and a global retail destination, driven by tourism, a strong local consumer market, and a thriving brand culture.',
    descEs: 'Segunda ciudad de España y destino retail internacional, impulsado por el turismo, un sólido mercado local y una cultura de marca vibrante.',
    population: '1.6M',
  },
  valencia: {
    name: 'Valencia', nameEs: 'Valencia', province: 'Valencia',
    desc: 'The third-largest city in Spain, with a growing retail scene and a new generation of shopping centers attracting national and international brands.',
    descEs: 'Tercera ciudad de España, con una escena retail en crecimiento y una nueva generación de centros comerciales que atrae marcas nacionales e internacionales.',
    population: '800K',
  },
  sevilla: {
    name: 'Sevilla', nameEs: 'Sevilla', province: 'Sevilla',
    desc: 'Andalusia\'s capital and the retail gateway to southern Spain. Strong seasonal footfall boosted by tourism and major commercial hubs.',
    descEs: 'Capital de Andalucía y puerta retail del sur de España. Alta afluencia estacional impulsada por el turismo y grandes centros comerciales.',
    population: '690K',
  },
  malaga: {
    name: 'Málaga', nameEs: 'Málaga', province: 'Málaga',
    desc: 'One of the fastest-growing retail markets in Spain, benefiting from booming tourism, a young population, and significant investment in commercial infrastructure.',
    descEs: 'Uno de los mercados retail de mayor crecimiento en España, beneficiado por el auge del turismo, una población joven y una fuerte inversión en infraestructura comercial.',
    population: '580K',
  },
  zaragoza: {
    name: 'Zaragoza', nameEs: 'Zaragoza', province: 'Zaragoza',
    desc: 'Strategically located between Madrid and Barcelona, Zaragoza serves a broad regional catchment and hosts several large-format shopping centers.',
    descEs: 'Ubicada estratégicamente entre Madrid y Barcelona, Zaragoza sirve a una amplia área de influencia y alberga varios centros comerciales de gran formato.',
    population: '680K',
  },
}

export async function generateStaticParams() {
  return Object.keys(CITIES).map((city) => ({ city }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; city: string }>
}) {
  const { locale, city } = await params
  const info = CITIES[city]
  if (!info) return {}
  const isEs = locale === 'es'
  const cityName = isEs ? info.nameEs : info.name
  return {
    title: isEs
      ? `Espacios comerciales en ${cityName} — Lokales`
      : `Retail spaces in ${cityName} — Lokales`,
    description: isEs ? info.descEs : info.desc,
  }
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ locale: string; city: string }>
}) {
  const { locale, city } = await params
  const info = CITIES[city]
  if (!info) notFound()

  const isEs = locale === 'es'
  const cityName = isEs ? info.nameEs : info.name

  const supabase = await createClient()

  // Find shopping centers in this city
  const { data: scs } = await supabase
    .from('shopping_centers')
    .select('id')
    .ilike('city', info.name)

  const scIds = scs?.map((sc) => sc.id) ?? []

  let listings: Listing[] = []
  if (scIds.length > 0) {
    const { data } = await supabase
      .from('listings')
      .select('*, shopping_center:shopping_centers(id, name, city, address, province, postal_code, country, lat, lng, images, created_by, created_at)')
      .in('shopping_center_id', scIds)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(12)
    listings = (data ?? []) as unknown as Listing[]
  }

  const TYPES = [
    { value: 'long_term', label: isEs ? 'Largo plazo' : 'Long-term', color: 'bg-forest-light text-forest' },
    { value: 'popup',     label: 'Pop-up',                           color: 'bg-purple-soft text-purple-brand' },
    { value: 'marketing', label: 'Marketing',                        color: 'bg-amber-soft text-amber-brand' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <NavbarServer />

      <main className="flex-1">

        {/* Hero */}
        <div className="bg-forest py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 text-forest-light/70 text-sm mb-4">
              <MapPin className="h-4 w-4" />
              <span>España · {info.province}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              {isEs
                ? `Espacios comerciales en ${cityName}`
                : `Retail spaces in ${cityName}`}
            </h1>
            <p className="text-forest-light/80 max-w-2xl leading-relaxed mb-6">
              {isEs ? info.descEs : info.desc}
            </p>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <Link
                  key={t.value}
                  href={`/${locale}/search?q=${info.name}&type=${t.value}`}
                  className="text-sm font-semibold px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border-b border-warm-border py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto flex flex-wrap gap-8">
            <div>
              <p className="text-2xl font-extrabold text-forest">{listings.length || '—'}</p>
              <p className="text-xs text-ink-muted mt-0.5">{isEs ? 'Espacios disponibles' : 'Available spaces'}</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-forest">{info.population}</p>
              <p className="text-xs text-ink-muted mt-0.5">{isEs ? 'Habitantes' : 'Population'}</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-forest">{scIds.length || '—'}</p>
              <p className="text-xs text-ink-muted mt-0.5">{isEs ? 'Centros comerciales' : 'Shopping centers'}</p>
            </div>
          </div>
        </div>

        {/* Listings */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {listings.length > 0 ? (
            <>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-subtle mb-8">
                {isEs ? `Espacios disponibles en ${cityName}` : `Available spaces in ${cityName}`}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link
                  href={`/${locale}/search?q=${info.name}`}
                  className="inline-flex items-center gap-2 bg-forest hover:bg-forest-mid text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors"
                >
                  {isEs ? `Ver todos en ${cityName}` : `View all in ${cityName}`}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg font-semibold text-ink mb-2">
                {isEs ? 'Próximamente en ' : 'Coming soon to '}{cityName}
              </p>
              <p className="text-sm text-ink-muted mb-6">
                {isEs
                  ? 'Aún no tenemos espacios en esta ciudad, pero estamos creciendo.'
                  : 'We don\'t have spaces here yet, but we\'re growing fast.'}
              </p>
              <Link href={`/${locale}/search`}
                className="inline-flex items-center gap-2 bg-forest hover:bg-forest-mid text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors">
                {isEs ? 'Ver todos los espacios' : 'Browse all spaces'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  )
}
