import { createClient } from '@/lib/supabase/server'
import { NavbarServer } from '@/components/layout/NavbarServer'
import { Footer } from '@/components/layout/Footer'
import { ListingCard } from '@/components/listings/ListingCard'
import { MallCard } from '@/components/listings/MallCard'
import { SearchFilters } from '@/components/search/SearchFilters'
import { Suspense } from 'react'
import { SlidersHorizontal, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Listing, ShoppingCenter } from '@/types'

const SORT_MAP: Record<string, { column: string; ascending: boolean }> = {
  price_asc:  { column: 'price_monthly', ascending: true },
  price_desc: { column: 'price_monthly', ascending: false },
  size_asc:   { column: 'size_sqm',      ascending: true },
  size_desc:  { column: 'size_sqm',      ascending: false },
}

const SELECT_COLS = '*, shopping_center:shopping_centers(id, name, city, address, province, postal_code, country, lat, lng, images, gla_sqm, center_type, shops_count, created_by, created_at)'

interface MallGroup {
  mall: ShoppingCenter
  listings: Listing[]
  counts: { total: number; long_term: number; popup: number; marketing: number }
}

interface SearchPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    q?: string
    type?: string
    size_min?: string
    price_max?: string
    sort?: string
    sc?: string   // shopping_center_id — drill into a specific mall
  }>
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params
  const { q, type, size_min, price_max, sort, sc } = await searchParams
  const isEs = locale === 'es'

  const supabase = await createClient()
  const sortOpt = sort && SORT_MAP[sort] ? SORT_MAP[sort] : { column: 'created_at', ascending: false }

  // ── Step 1: resolve matching shopping center IDs from text query ────────────
  let scIds: string[] | null = null
  if (q?.trim()) {
    const safeQ = q.replace(/[,():*\\]/g, '')
    const { data: matchingSCs } = await supabase
      .from('shopping_centers')
      .select('id')
      .or(`name.ilike.%${safeQ}%,city.ilike.%${safeQ}%,province.ilike.%${safeQ}%`)
    scIds = matchingSCs?.map(r => r.id) ?? []
  }

  const noSCsFound = scIds !== null && scIds.length === 0

  // ── Step 2: fetch listings ──────────────────────────────────────────────────
  let listings: Listing[] = []

  if (!noSCsFound) {
    let query = supabase
      .from('listings')
      .select(SELECT_COLS)
      .eq('status', 'active')
      .order(sortOpt.column, { ascending: sortOpt.ascending })

    // When drilling into a specific mall, override the text search filter
    if (sc) {
      query = query.eq('shopping_center_id', sc)
    } else if (scIds && scIds.length > 0) {
      query = query.in('shopping_center_id', scIds)
    }

    if (type)      query = query.contains('rental_types', [type])
    if (size_min)  { const n = parseInt(size_min); if (!isNaN(n)) query = query.gte('size_sqm', n) }
    if (price_max) { const n = parseInt(price_max); if (!isNaN(n)) query = query.lte('price_monthly', n) }

    const { data } = await query.limit(200)
    listings = (data ?? []) as unknown as Listing[]
  }

  // ── Step 3: if drilling into a mall, fetch its info for the header ──────────
  let drillMall: ShoppingCenter | null = null
  if (sc) {
    const { data } = await supabase
      .from('shopping_centers')
      .select('id, name, city, province, images, gla_sqm, center_type')
      .eq('id', sc)
      .single()
    drillMall = data as ShoppingCenter | null
  }

  // ── Step 4: group into mall cards (when NOT drilling) ──────────────────────
  let mallGroups: MallGroup[] = []
  if (!sc) {
    const grouped: Record<string, MallGroup> = {}
    for (const listing of listings) {
      const mall = listing.shopping_center
      if (!mall) continue
      if (!grouped[mall.id]) {
        grouped[mall.id] = {
          mall,
          listings: [],
          counts: { total: 0, long_term: 0, popup: 0, marketing: 0 },
        }
      }
      grouped[mall.id].listings.push(listing)
      grouped[mall.id].counts.total++
      for (const t of listing.rental_types) {
        if (t === 'long_term' || t === 'popup' || t === 'marketing') {
          grouped[mall.id].counts[t]++
        }
      }
    }
    mallGroups = Object.values(grouped).sort((a, b) => b.counts.total - a.counts.total)
  }

  // ── Build the sc drill-down URL (preserves q / type / size / price filters) ─
  function mallDrillUrl(mallId: string) {
    const p = new URLSearchParams()
    if (q)         p.set('q', q)
    if (type)      p.set('type', type)
    if (size_min)  p.set('size_min', size_min)
    if (price_max) p.set('price_max', price_max)
    if (sort)      p.set('sort', sort)
    p.set('sc', mallId)
    return `/${locale}/search?${p.toString()}`
  }

  function backUrl() {
    const p = new URLSearchParams()
    if (q)         p.set('q', q)
    if (type)      p.set('type', type)
    if (size_min)  p.set('size_min', size_min)
    if (price_max) p.set('price_max', price_max)
    if (sort)      p.set('sort', sort)
    const qs = p.toString()
    return `/${locale}/search${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <NavbarServer />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="mb-8">
          {sc && drillMall ? (
            // Drill-down header
            <>
              <Link
                href={backUrl()}
                className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-4 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {isEs ? 'Todos los centros' : 'All shopping centers'}
              </Link>
              <h1 className="text-2xl font-bold text-ink">{drillMall.name}</h1>
              <p className="text-sm text-ink-muted mt-1">
                {drillMall.city}{drillMall.province && drillMall.province !== drillMall.city ? `, ${drillMall.province}` : ''}
                {listings.length > 0 && (
                  <> · {listings.length} {isEs
                    ? listings.length === 1 ? 'espacio disponible' : 'espacios disponibles'
                    : listings.length === 1 ? 'space available' : 'spaces available'}</>
                )}
              </p>
            </>
          ) : (
            // Mall browse header
            <>
              <h1 className="text-2xl font-bold text-ink">
                {q
                  ? (isEs ? `Centros para "${q}"` : `Malls matching "${q}"`)
                  : (isEs ? 'Todos los centros comerciales' : 'All shopping centers')}
              </h1>
              <p className="text-sm text-ink-muted mt-1">
                {mallGroups.length === 0
                  ? (isEs ? 'Sin resultados' : 'No results found')
                  : isEs
                    ? `${mallGroups.length} centro${mallGroups.length !== 1 ? 's' : ''} con espacios disponibles`
                    : `${mallGroups.length} mall${mallGroups.length !== 1 ? 's' : ''} with available spaces`}
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl border border-warm-border p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="h-4 w-4 text-forest" />
                <p className="text-sm font-semibold text-ink">{isEs ? 'Filtros' : 'Filters'}</p>
              </div>
              <Suspense fallback={null}>
                <SearchFilters locale={locale} />
              </Suspense>
            </div>
          </aside>

          {/* ── Main content ─────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {sc ? (
              // ── Drill-down: individual listing cards ──────────────────────
              listings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8">
                  {listings.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <EmptyState isEs={isEs} onBack={backUrl()} />
              )
            ) : (
              // ── Mall cards grid ───────────────────────────────────────────
              mallGroups.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-6">
                  {mallGroups.map(group => (
                    <MallCard
                      key={group.mall.id}
                      mall={group.mall}
                      counts={group.counts}
                      href={mallDrillUrl(group.mall.id)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState isEs={isEs} onBack={`/${locale}/search`} noQuery={!q && !type && !size_min && !price_max} />
              )
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function EmptyState({ isEs, onBack, noQuery }: { isEs: boolean; onBack: string; noQuery?: boolean }) {
  return (
    <div className="bg-white rounded-3xl border border-warm-border px-8 py-10">
      <p className="text-base font-semibold text-ink mb-1">
        {noQuery
          ? (isEs ? 'Aún no hay espacios disponibles' : 'No spaces listed yet')
          : (isEs ? 'Sin resultados para esta búsqueda' : 'No results match your search')}
      </p>
      <p className="text-sm text-ink-muted mb-5">
        {isEs ? 'Prueba a ajustar los filtros o a ampliar la búsqueda.' : 'Try adjusting your filters or broadening your search.'}
      </p>
      <Link
        href={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-forest text-white hover:bg-forest-mid transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {isEs ? 'Ver todos los centros' : 'See all malls'}
      </Link>
    </div>
  )
}
