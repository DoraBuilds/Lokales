import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { NavbarServer } from '@/components/layout/NavbarServer'
import { Footer } from '@/components/layout/Footer'
import { LinkButton } from '@/components/ui/link-button'
import { ShareButton } from '@/components/listings/ShareButton'
import { SaveButton } from '@/components/listings/SaveButton'
import { InquiryForm } from '@/components/listings/InquiryForm'
import {
  MapPin, Maximize2, ArrowLeft, Building2, Calendar,
  Megaphone, Users, BarChart3, Layers, Pencil,
  Zap, Wifi, Wind, Flame, Droplets, Car, Truck,
  ArrowUpDown, ShowerHead, Package, Shield, Camera,
} from 'lucide-react'

// ── Maps ──────────────────────────────────────────────────────────────────────

const BADGE: Record<string, string> = {
  long_term: 'bg-forest text-white',
  popup:     'bg-purple-brand text-white',
  marketing: 'bg-amber-brand text-white',
}
const TYPE_LABEL: Record<string, string> = {
  long_term: 'Long-term lease',
  popup:     'Pop-up / Event',
  marketing: 'Marketing placement',
}
const FLOOR_LABEL: Record<string, string> = {
  basement: 'Basement', ground: 'Ground floor', first: '1st floor',
  second: '2nd floor', third: '3rd floor', fourth: '4th floor',
  fifth: '5th floor', sixth: '6th floor', seventh: '7th floor',
  eighth: '8th floor', ninth: '9th floor', other: 'Other',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AMENITY_ICON: Record<string, React.ComponentType<any>> = {
  electricity:     Zap,
  wifi:            Wifi,
  airConditioning: Wind,
  heating:         Flame,
  water:           Droplets,
  parking:         Car,
  loadingDock:     Truck,
  elevator:        ArrowUpDown,
  toilet:          ShowerHead,
  storage:         Package,
  security:        Shield,
  cctv:            Camera,
}
const AMENITY_LABEL: Record<string, string> = {
  electricity: 'Electricity', wifi: 'Wi-Fi', airConditioning: 'A/C',
  heating: 'Heating', water: 'Water', parking: 'Parking',
  loadingDock: 'Loading dock', elevator: 'Elevator', toilet: 'Toilet',
  storage: 'Storage', security: 'Security', cctv: 'CCTV',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>
  searchParams: Promise<{ from?: string }>
}) {
  const { locale, id } = await params
  const { from } = await searchParams
  const fromDashboard = from === 'dashboard'
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: listing } = await supabase
    .from('listings')
    .select(`*, shopping_center:shopping_centers(*)`)
    .eq('id', id)
    .single()

  if (!listing) notFound()

  const sc = listing.shopping_center
  const isOwner = user?.id === listing.lister_id
  const isEs = locale === 'es'
  const images: string[] = listing.images ?? []

  // Check if user has saved this listing
  let initialSaved = false
  if (user) {
    const { data: saved } = await supabase
      .from('saved_listings')
      .select('listing_id')
      .eq('user_id', user.id)
      .eq('listing_id', id)
      .single()
    initialSaved = !!saved
  }

  // Similar listings — same city, different id
  const { data: similar } = await supabase
    .from('listings')
    .select(`id, title, images, rental_types, price_monthly, price_daily_popup, popup_price_unit, price_daily_marketing, marketing_price_unit, size_sqm, shopping_center:shopping_centers(name, city)`)
    .eq('status', 'active')
    .neq('id', id)
    .limit(3)

  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/${locale}/listings/${id}`

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <NavbarServer />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Back + actions ── */}
        <div className="flex items-center justify-between mb-6">
          <Link href={fromDashboard ? `/${locale}/dashboard` : `/${locale}/search`}
            className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors">
            <ArrowLeft className="h-4 w-4" /> {isEs ? 'Volver' : (fromDashboard ? 'Back to dashboard' : 'Back to search')}
          </Link>
          <div className="flex items-center gap-1">
            <ShareButton title={listing.title} url={pageUrl} />
            <SaveButton listingId={id} initialSaved={initialSaved} />
            {isOwner && (
              <LinkButton href={`/${locale}/listings/${id}/edit`}
                className="flex items-center gap-2 text-sm font-semibold border border-warm-border rounded-full px-4 py-2 hover:border-forest/40 hover:text-forest transition-colors bg-white text-ink ml-1">
                <Pencil className="h-3.5 w-3.5" /> {isEs ? 'Editar' : 'Edit'}
              </LinkButton>
            )}
          </div>
        </div>

        {/* ── Airbnb-style photo grid ── */}
        {images.length > 0 ? (
          <div className="relative mb-8 rounded-3xl overflow-hidden">
            {images.length === 1 ? (
              <div className="relative aspect-[16/7]">
                <Image src={images[0]} alt={listing.title} fill className="object-cover" priority />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 h-[420px]">
                {/* Large left image */}
                <div className="relative">
                  <Image src={images[0]} alt={listing.title} fill className="object-cover" priority />
                </div>
                {/* Right 2×2 grid */}
                <div className={`grid gap-2 ${images.length >= 4 ? 'grid-rows-2 grid-cols-2' : images.length === 3 ? 'grid-rows-2 grid-cols-1' : 'grid-rows-1 grid-cols-1'}`}>
                  {images.slice(1, 5).map((src: string, i: number) => (
                    <div key={i} className="relative overflow-hidden">
                      <Image src={src} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {images.length > 5 && (
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-ink text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                +{images.length - 5} photos
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-[16/6] bg-stone rounded-3xl flex items-center justify-center mb-8">
            <Maximize2 className="h-10 w-10 text-ink-subtle" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: main info ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Title + badges + location */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {(listing.rental_types as string[]).map((t: string) => (
                  <span key={t} className={`text-xs font-semibold px-3 py-1 rounded-full ${BADGE[t]}`}>
                    {TYPE_LABEL[t]}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl font-bold text-ink mb-2">{listing.title}</h1>
              {sc && (
                <div className="flex items-center gap-1.5 text-sm text-ink-muted">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{sc.name} · {sc.city}{sc.microlocation ? `, ${sc.microlocation}` : ''}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-subtle mb-3">
                {isEs ? 'Descripción' : 'Description'}
              </h2>
              <p className="text-sm text-ink leading-relaxed whitespace-pre-line">{listing.description}</p>
            </div>

            {/* Space details */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-subtle mb-4">
                {isEs ? 'Detalles del espacio' : 'Space details'}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: isEs ? 'Superficie' : 'GLA', value: listing.gla_sqm ? `${listing.gla_sqm} m²` : listing.size_sqm ? `${listing.size_sqm} m²` : null },
                  { label: isEs ? 'Planta' : 'Floor', value: FLOOR_LABEL[listing.floor_level] ?? listing.floor_level },
                  { label: isEs ? 'Fachada' : 'Façade', value: listing.facade_meters ? `${listing.facade_meters} m` : null },
                  { label: isEs ? 'Altura libre' : 'Ceiling', value: listing.ceiling_height ? `${listing.ceiling_height} m` : null },
                  { label: isEs ? 'Disponible desde' : 'Available from', value: listing.available_from },
                  { label: isEs ? 'Disponible hasta' : 'Available until', value: listing.available_until ?? null },
                ].filter(d => d.value).map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-2xl border border-warm-border p-4">
                    <p className="text-xs text-ink-subtle mb-1">{label}</p>
                    <p className="text-sm font-semibold text-ink">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities — icon grid */}
            {listing.amenities?.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-subtle mb-4">
                  {isEs ? 'Equipamiento' : 'Amenities'}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(listing.amenities as string[]).map((a: string) => {
                    const Icon = AMENITY_ICON[a]
                    return (
                      <div key={a} className="flex items-center gap-3 bg-white rounded-2xl border border-warm-border px-4 py-3">
                        {Icon && <Icon className="h-4 w-4 text-forest flex-shrink-0" />}
                        <span className="text-sm text-ink">{AMENITY_LABEL[a] ?? a}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Shopping center stats */}
            {sc && (sc.population || sc.gla_sqm || sc.footfall_annual) && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-subtle mb-4">
                  {isEs ? 'Datos del centro' : 'Shopping center data'}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {sc.population && (
                    <div className="bg-white rounded-2xl border border-warm-border p-4 flex items-start gap-3">
                      <Users className="h-4 w-4 text-forest mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-ink-subtle mb-0.5">{isEs ? 'Población' : 'Population'}</p>
                        <p className="text-sm font-semibold text-ink">{Number(sc.population).toLocaleString('en-US')}</p>
                      </div>
                    </div>
                  )}
                  {sc.gla_sqm && (
                    <div className="bg-white rounded-2xl border border-warm-border p-4 flex items-start gap-3">
                      <Layers className="h-4 w-4 text-forest mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-ink-subtle mb-0.5">GLA</p>
                        <p className="text-sm font-semibold text-ink">{Number(sc.gla_sqm).toLocaleString('en-US')} m²</p>
                      </div>
                    </div>
                  )}
                  {sc.footfall_annual && (
                    <div className="bg-white rounded-2xl border border-warm-border p-4 flex items-start gap-3">
                      <BarChart3 className="h-4 w-4 text-forest mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-ink-subtle mb-0.5">{isEs ? 'Visitantes/año' : 'Annual footfall'}</p>
                        <p className="text-sm font-semibold text-ink">{Number(sc.footfall_annual).toLocaleString('en-US')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: pricing + inquiry ── */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-warm-border p-6 sticky top-24">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-4">
                {isEs ? 'Precios' : 'Pricing'}
              </p>

              <div className="space-y-4 mb-6">
                {(listing.rental_types as string[]).includes('long_term') && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-forest-light flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-4 w-4 text-forest" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-forest mb-0.5">{isEs ? 'Largo plazo' : 'Long-term'}</p>
                      {listing.price_monthly && (
                        <p className="text-lg font-bold text-ink">
                          €{Number(listing.price_monthly).toLocaleString('en-US')}
                          <span className="text-sm font-normal text-ink-muted">/mo</span>
                        </p>
                      )}
                      {listing.utilities_monthly && (
                        <p className="text-xs text-ink-muted mt-0.5">
                          + €{Number(listing.utilities_monthly).toLocaleString('en-US')} utilities/mo
                        </p>
                      )}
                      {listing.long_term_notes && (
                        <p className="text-xs text-ink-muted mt-1 italic">{listing.long_term_notes}</p>
                      )}
                    </div>
                  </div>
                )}
                {(listing.rental_types as string[]).includes('popup') && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-soft flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-purple-brand" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-purple-brand mb-0.5">Pop-up</p>
                      {listing.price_daily_popup && (
                        <p className="text-lg font-bold text-ink">
                          €{Number(listing.price_daily_popup).toLocaleString('en-US')}
                          <span className="text-sm font-normal text-ink-muted">/{listing.popup_price_unit ?? 'day'}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {(listing.rental_types as string[]).includes('marketing') && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-soft flex items-center justify-center flex-shrink-0">
                      <Megaphone className="h-4 w-4 text-amber-brand" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-amber-brand mb-0.5">Marketing</p>
                      {listing.price_daily_marketing && (
                        <p className="text-lg font-bold text-ink">
                          €{Number(listing.price_daily_marketing).toLocaleString('en-US')}
                          <span className="text-sm font-normal text-ink-muted">/{listing.marketing_price_unit ?? 'day'}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-warm-border pt-5">
                <InquiryForm
                  listingId={id}
                  rentalTypes={listing.rental_types as string[]}
                  locale={locale}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Similar listings ── */}
        {similar && similar.length > 0 && (
          <div className="mt-16">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-subtle mb-6">
              {isEs ? 'Más espacios disponibles' : 'More available spaces'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similar.map((s) => {
                const img = s.images?.[0]
                const sc2 = Array.isArray(s.shopping_center) ? s.shopping_center[0] as { name: string; city: string } | undefined : s.shopping_center as { name: string; city: string } | null
                const price = s.price_monthly
                  ? `€${Number(s.price_monthly).toLocaleString('en-US')}/mo`
                  : s.price_daily_popup
                  ? `€${s.price_daily_popup}/${s.popup_price_unit ?? 'day'}`
                  : s.price_daily_marketing
                  ? `€${s.price_daily_marketing}/${s.marketing_price_unit ?? 'day'}`
                  : null
                return (
                  <Link key={s.id} href={`/${locale}/listings/${s.id}`}
                    className="bg-white rounded-3xl border border-warm-border overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="relative aspect-[4/3] bg-stone">
                      {img
                        ? <Image src={img} alt={s.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="absolute inset-0 flex items-center justify-center"><MapPin className="h-6 w-6 text-ink-subtle" /></div>
                      }
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-ink line-clamp-1 mb-1">{s.title}</h3>
                      {sc2 && (
                        <p className="text-xs text-ink-muted flex items-center gap-1 mb-2">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          {sc2.name} · {sc2.city}
                        </p>
                      )}
                      {price && <p className="text-sm font-bold text-ink">{price}</p>}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}
